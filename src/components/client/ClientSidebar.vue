<template>
	<div class="client-sidebar-container">
		<div class="profile-data">
			<div class="avatar">
				<img :src="profilePhoto" v-if="userProfile.photo"/>
				<img src="../../assets/icons/profile.svg" v-else>
			</div>
			<div class="profile-name">
				{{ userProfile.name }}
				<div class="profile-phone">{{userProfile.phoneNumber}}</div>
				<div class="profile-logout" @click="logOut">Выход<img src="../../assets/icons/logout.svg"></div>
			</div>
		</div>
		<div class="tabs">
			<div
				class="tab"
				v-for="(item, i) in sidebars"
				:key="i"
				:class="{ active: $route.path === item.route }"
				@click="$router.push(item.route)"
			>
				<img :src="require(`@/assets/icons/${item.icon}`)"/>
				<span>{{ item.name }}</span>
			</div>
		</div>
	</div>
</template>

<script>
import Sidebars from '@/utils/sidebars';

export default {
	props: {
		role: String,
	},
	data() {
		return {
			sidebars: [],
		};
	},
	computed: {
		userProfile() {
			return this.$store.state.account.customer;
		},
		profilePhoto() {
			return process.env.VUE_APP_BASE_URL + this.userProfile.photo;
		}
	},
	created() {
		this.sidebars = Sidebars[this.role];
	},
	methods: {
		logOut() {
			this.$store.dispatch('account/logout');
		}
	}
};
</script>

<style lang="scss">
	.client-sidebar-container {
		min-width: 300px;
		border-right: 1px solid $gray-light;
		padding: 20px 10px 0;
		.profile-data {
			border-bottom: 1px solid $gray-light;
			margin-bottom: 14px;
			text-align: center;
			.avatar {
				width: 130px;
				height: 130px;
				margin: 0 auto;
				img {
					width: 100%;
					height: 100%;
					object-fit: cover;
					border-radius: 30px;
				}
			}
			.profile-name {
				font-weight: 500;
				font-size: 20px;
				padding: 8px 0 12px;
				.profile-phone {
					font-size: 14px;
				}
				.profile-logout {
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 15px;
					margin-top: 5px;
					cursor: pointer;
					img {
						margin-left: 8px;
					}
				}
			}
		}
		.tabs {
			padding: 10px 0;
			.tab {
				font-weight: 500;
				font-size: 16px;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-bottom: 5px;
				padding: 8px 5px;
				cursor: pointer;
				&.active {
					background: $indigo-light;
					color: #fff;
					border-radius: 4px;
				}
				span {
					margin-left: 20px;
					width: 40%;
				}
			}
		}
	}
</style>
