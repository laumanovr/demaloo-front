<template>
	<div class="client-sidebar-container web">
		<div class="sticky-block">
			<div class="profile-data">
				<div class="avatar">
					<img :src="profilePhoto" @error="$event.target.src = require('@/assets/icons/profile-tab.svg')"/>
				</div>
				<div class="profile-name">
					<div>{{ userProfile.name }}</div>
					<div class="profile-phone">{{userProfile.phoneNumber}}</div>
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
					<inline-svg :src="require(`@/assets/icons/${item.icon}`)" :class="item.className"/>
					<span>{{ item.name }}</span>
				</div>
				<div class="tab" @click="$modal.show('logout-modal')">
					<img src="../../assets/icons/person-logout.svg" class="logout-icon">
					<span>Выход</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Sidebars from '@/utils/sidebars';
import {AWS_IMAGE_URL} from '@/services/api.service';

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
			return `${AWS_IMAGE_URL}/photos/` + this.userProfile.photo;
		}
	},
	created() {
		this.sidebars = Sidebars[this.role];
	}
};
</script>

<style lang="scss">
	.client-sidebar-container.web {
		min-width: 280px;
		border-right: 1px solid $gray-light;
		.sticky-block {
			position: sticky;
			top: 0;
		}
		.profile-data {
			display: flex;
			align-items: center;
			border-bottom: 1px solid $gray-light;
			margin-bottom: 10px;
			text-align: center;
			padding: 20px 0 25px;
			.avatar {
				width: 40px;
				height: 40px;
				margin-right: 14px;
				img {
					width: 100%;
					height: 100%;
					object-fit: cover;
					border-radius: 30px;
				}
			}
			.profile-name {
				font-weight: 700;
				font-size: 14px;
				.profile-phone {
					font-size: 14px;
					font-weight: 500;
					color: $gray-dark;
				}
			}
		}
		.tabs {
			padding: 10px 0;
			.tab {
				font-size: 14px;
				display: flex;
				align-items: center;
				margin-bottom: 5px;
				padding: 9px 0;
				cursor: pointer;
				color: $blue-darkest;
				svg {
					margin: 0 13px 0 10px;
				}
				.logout-icon {
					margin: 0 15px 0 10px;
				}
				&.active {
					background: rgba($green-main, 0.15);
					color: $green-main;
					border-radius: 7px;
					margin: 0 20px 5px 0;
					font-weight: 600;
					svg {
						&.single {
							path {
								fill: #fff;
							}
						}
						&.multi {
							path:first-child {
								fill: #fff;
								opacity: 1;
							}
						}
					}
				}
			}
		}
	}
</style>
