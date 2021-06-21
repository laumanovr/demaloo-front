<template>
	<div class="chat-container">
		<PreLoader v-if="isLoading"/>
		<div class="messaging">
			<div class="inbox_msg">
				<div class="inbox_people">
					<div class="headind_srch">
						<div class="recent_heading">
							<h4>Сообщения</h4>
						</div>
					</div>
					<div class="inbox_chat">
						<div
							class="chat_list"
							v-for="room in chatRooms"
							:key="room._id"
							:class="{'active': selectedRoom._id === room._id}"
						>
							<div class="chat_people" @click="onSelectRoom(room)">
								<div class="chat_img">
									<img :src="require('@/assets/icons/group-people-icon.svg')" v-if="room.tour">
									<img :src="require('@/assets/icons/profile-tab.svg')" v-else>
								</div>
								<div class="chat_ib">
									<h5>
										{{ getRoomName(room) }}
										<span class="unread-count" v-if="room.unreadCount">
										{{room.unreadCount}}
										</span>
									</h5>
									<p v-if="room.lastMessage">{{room.lastMessage.msg}}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="message-list">
					<div class="selected-user" v-if="selectedRoom">
						{{selectedRoom.tour ? showFullTourInfo() : selectedRoom.host.name}}
						<img
							src="../../assets/icons/group-people-icon.svg"
							class="members" title="Участники" v-if="selectedRoom.tour"
							@click="toggleMemberModal"
						>
					</div>
					<div class="msg_history" ref="msgHistory">
						<template v-for="msg in messages">
							<div class="outgoing_msg" v-if="userProfile._id === msg.from._id" :key="msg._id">
								<div class="user-name right">{{msg.from.name+' '}}{{msg.from.surname || ''}}</div>
								<div class="sent_msg d-flex">
									<span class="time_date out">{{ formatTime(msg.createdAt) }}</span>
									<p>{{ msg.msg }}</p>
								</div>
							</div>
							<div class="incoming_msg" :key="msg._id" v-else>
								<div class="user-name left">{{msg.from.name+' '}}{{msg.from.surname || ''}}</div>
								<div class="received_withd_msg d-flex">
									<p>{{ msg.msg }}</p>
									<span class="time_date in">{{ formatTime(msg.createdAt) }}</span>
								</div>
							</div>
						</template>
					</div>
					<div class="type_msg" v-if="selectedRoom">
						<input
							type="text"
							class="write_msg"
							placeholder="Написать сообщение"
							v-model="inputValue"
							@keyup.enter="onSendMessage"
						/>
						<button class="msg_send_btn" type="button" @click="onSendMessage">
							<inline-svg :src="require('../../assets/icons/telegram-icon.svg')"/>
						</button>
					</div>
				</div>
			</div>
		</div>
		<modal name="member-modal" width="500px" height="auto">
			<div class="modal-container member-modal">
				<h3>Участники</h3>
				<div class="member-item" v-for="(member, i) in selectedRoom.users" :key="member._id">
					<span>{{i + 1}}.</span>
					<span>{{member.name}}</span>
				</div>
			</div>
		</modal>
	</div>
</template>

<script>
import {io} from 'socket.io-client';
import {userToken} from '../../utils/authHeader';

export default {
	data() {
		return {
			isLoading: false,
			socket: {},
			chatRooms: [],
			messages: [],
			selectedRoom: '',
			inputValue: ''
		};
	},
	computed: {
		userProfile() {
			return this.$store.state.account.customer;
		},
	},
	async created() {
		this.isLoading = true;
		await this.openConnection();
		this.onGetChatList();
		this.onGetRoomMessages();
		this.onNewMessage();
		this.onSocketError();
	},
	methods: {
		openConnection() {
			this.socket = io(process.env.VUE_APP_BASE_URL, {
				auth: {
					jwt: userToken
				},
			});
			this.socket.on('connect', () => {
				console.log('CONNECT');
				this.socket.emit('chat_list');
			});
		},

		onGetChatList() {
			this.socket.on('chat_list', (rooms) => {
				this.chatRooms = rooms;
				this.isLoading = false;
				console.log('CHAT_LIST');
				console.log(rooms);
			});
		},

		onGetRoomMessages() {
			this.socket.on('chat_messages', (messages) => {
				this.messages = messages;
				this.scrollToBottom();
			});
		},

		onNewMessage() {
			this.socket.on('message', (msgObj) => {
				console.log('New MESSAGE');
				this.messages.push(msgObj);
				this.scrollToBottom();
				this.playSound(msgObj);
			});
		},

		onSelectRoom(room) {
			this.messages = [];
			this.isLoading = true;
			this.selectedRoom = room;
			this.socket.emit('join', room._id, room.users.map((user) => user._id));
			this.$nextTick(() => {
				setTimeout(() => {
					this.isLoading = false;
				}, 200);
			});
		},

		onSendMessage() {
			this.inputValue = this.inputValue.trim();
			if (this.inputValue) {
				this.socket.emit('message', this.inputValue);
				this.inputValue = '';
			}
		},

		onSocketError() {
			this.socket.on('connect_error', (err) => {
				this.$toast.error(err.message ? err.message : err);
			});
		},

		formatTime(time) {
			return new Date(time).toLocaleTimeString('ru').slice(0, 5);
		},

		scrollToBottom() {
			this.$nextTick(() => {
				setTimeout(() => {
					if (this.$refs.msgHistory) {
						this.$refs.msgHistory.scrollTop = this.$refs.msgHistory.scrollHeight;
					}
				});
			});
		},

		playSound(msgObj) {
			if (msgObj.from._id !== this.userProfile._id) {
				const sound = new Audio(require('@/assets/sounds/notify-sound.mp3'));
				sound.play();
			}
		},

		getRoomName(room) {
			return room.tour ? room.tour.name.ru : 'Demaloo тех.отдел';
		},

		showFullTourInfo() {
			return this.selectedRoom.tour.name.ru + ' - ' + new Date(this.selectedRoom.tour.date).toLocaleDateString('ru');
		},

		toggleMemberModal() {
			this.$modal.toggle('member-modal');
		}
	},

	beforeDestroy() {
		this.socket.disconnect();
	}
};
</script>

<style lang="scss">
	.chat-container {
		max-width: 1130px;
		margin: 20px auto 0;
		img {
			max-width: 100%;
		}

		.inbox_people {
			overflow: hidden;
			width: 35%;
			border-right: 1px solid #EDEDF0;
			background: #fff;
		}

		.inbox_msg {
			box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
			border-radius: 7px;
			clear: both;
			overflow: hidden;
			display: flex;
		}

		.top_spac {
			margin: 20px 0 0;
		}

		.srch_bar {
			display: inline-block;
			text-align: right;
			width: 65%;
		}

		.headind_srch {
			padding: 20px 15px;
			overflow: hidden;
			border-bottom: 1px solid #EDEDF0;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.recent_heading h4 {
			color: $blue-darkest;
			font-size: 15px;
			margin: auto;
			font-weight: 600;
		}

		.srch_bar input {
			border-bottom: 1px solid #EDEDF0;
			width: 100%;
			padding: 2px 0 4px 6px;
			background: none;
			outline: none;
		}

		.srch_bar .input-group-addon button {
			background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
			border: medium none;
			padding: 0;
			color: #707070;
			font-size: 18px;
		}

		.srch_bar .input-group-addon {
			margin: 0 0 0 -27px;
		}

		.chat_ib h5 {
			font-size: 15px;
			color: #464646;
			margin: 0 0 5px 0;
		}

		.chat_ib h5 span {
			font-size: 13px;
			float: right;
		}

		.chat_ib p {
			font-size: 12px;
			color: #989898;
			margin: auto
		}

		.chat_img {
			width: 11%;
		}

		.chat_ib {
			padding: 0 0 0 15px;
			width: 88%;
		}

		.chat_people {
			overflow: hidden;
			clear: both;
			display: flex;
			.unread-count {
				background: $red-primary;
				color: #fff;
				border-radius: 30px;
				padding: 0 6px;
			}
		}

		.chat_list {
			border-bottom: 1px solid #EDEDF0;
			margin: 0;
			padding: 18px 16px 10px;
			cursor: pointer;
			&.active {
				background: #00dcb3;
				.chat_ib h5 {
					color: #fff;
					font-weight: bold;
				}
			}
		}

		.inbox_chat {
			height: 75vh;
			overflow-y: auto;
		}

		.incoming_msg_img {
			display: inline-block;
			width: 6%;
		}

		.received_msg {
			display: inline-block;
			padding: 0 0 0 10px;
			vertical-align: top;
			width: 92%;
		}

		.received_withd_msg p {
			background: #ebebeb none repeat scroll 0 0;
			border-radius: 3px;
			color: #000;
			font-size: 14px;
			margin: 0;
			padding: 5px 10px 5px 12px;
			width: 100%;
			font-weight: 600;
		}

		.time_date {
			color: #747474;
			display: block;
			font-size: 12px;
			margin: 8px 0 0;
			&.out {
				margin-right: 10px;
			}
			&.in {
				margin-left: 10px;
			}
		}

		.received_withd_msg {
			width: 60%;
		}

		.message-list {
			width: 65%;
			background: #fff;
			.selected-user {
				position: relative;
				padding: 18px 0 17px;
				text-align: center;
				border-bottom: 1px solid #EDEDF0;
				font-size: 18px;
				font-weight: 700;
				font-family: $montserrat;
				color: $blue-darkest;
				.members {
					position: absolute;
					top: 50%;
					right: 15px;
					transform: translateY(-50%);
					cursor: pointer;
				}
			}
			.user-name {
				&.right {
					text-align: right;
					font-size: 13px;
				}
				&.left {
					text-align: left;
					font-size: 13px;
				}
			}
		}

		.incoming_msg {
			margin: 24px 0;
		}

		.sent_msg p {
			background: $green-main;
			border-radius: 3px;
			font-size: 14px;
			margin: 0;
			color: #fff;
			padding: 5px 10px 5px 12px;
			width: 100%;
			font-weight: 600;
		}

		.outgoing_msg {
			overflow: hidden;
			margin: 24px 0;
		}

		.sent_msg {
			float: right;
			width: 60%;
		}

		.type_msg {
			border-top: 1px solid #EDEDF0;
			padding: 0 16px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			input {
				background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
				border: medium none;
				color: #4c4c4c;
				font-size: 15px;
				min-height: 55px;
				width: 90%;
				padding-left: 8px;
				outline: none;
			}
		}

		.msg_send_btn {
			border: medium none;
			border-radius: 50%;
			color: #fff;
			cursor: pointer;
			font-size: 17px;
			height: 30px;
			width: 30px;
			outline: none;
			svg {
				path {
					fill: $green-main;
				}
			}
		}

		.messaging {
			padding: 0 0 50px 0;
		}

		.msg_history {
			height: 70vh;
			overflow-y: auto;
			padding: 0 16px;
		}

		.modal-container.member-modal {
			max-height: 550px;
			.member-item {
				padding-bottom: 10px;
				span {
					&:first-child {
						margin-right: 10px;
					}
					&:last-child {

					}
				}
			}
		}
	}
</style>