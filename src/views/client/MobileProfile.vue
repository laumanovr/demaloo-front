<template>
	<div class="client-sidebar-container">
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
				<div class="tab" v-for="(item, i) in sidebars" :key="i" @click="$router.push(item.route)">
					<inline-svg :src="require(`@/assets/icons/${item.icon}`)"/>
					<span>{{ item.name }}</span>
				</div>
				<div class="tab profile-logout" @click="$modal.show('logout-modal')">
					<img src="../../assets/icons/person-logout.svg" class="logout-icon">
					Выход
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
		this.sidebars = Sidebars.client;
	}
};
</script>

<style lang="scss" scoped>
	.client-sidebar-container {
		.profile-data {
			display: flex;
			align-items: center;
			border-bottom: 1px solid $gray-light;
			margin-bottom: 10px;
			text-align: center;
			padding: 20px 0 25px 20px;
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
			padding-bottom: 10px;
			.tab {
				font-size: 14px;
				display: flex;
				align-items: center;
				padding: 14px 0;
				color: $blue-darkest;
				margin: 0 20px;
				&:not(:last-child) {
					border-bottom: 1px solid $gray-light;
				}
				svg, img {
					margin-right: 13px;
				}
				&.profile-logout {
					margin-top: 5px;
				}
			}
		}
	}
</style>
