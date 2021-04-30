<template>
	<div class="sidebar-container">
		<PreLoader v-if="isLoading"/>
		<div class="profile-data">
			<div class="avatar">
				<img :src="profilePhoto" v-if="profilePhoto"/>
				<img src="../../assets/icons/profile.svg" v-else>
			</div>
			<div class="profile-name">
				{{ userProfile.name }}
			</div>
			<div class="tabs">
				<div
					class="tab" @click="$router.push('/company-manage/profile')"
					:class="{active: $route.path === '/company-manage/profile'}"
				>
					<img src="../../assets/icons/profile.svg"/><span>Профиль</span>
				</div>
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
				<span class="new-notify" v-if="hasNewNotify && item.route == '/company-manage/notifications'"/>
			</div>
		</div>
		<div class="sign-out" @click="$modal.show('logout-modal')">
			<img src="../../assets/icons/logout.svg" class="logout-icon"><span>Выход</span>
		</div>
	</div>
</template>

<script>
import Sidebars from '@/utils/sidebars';
import {AWS_IMAGE_URL} from '@/services/api.service';
import PreLoader from '@/components/general/PreLoader';

export default {
	components: {
		PreLoader
	},
	props: {
		role: String,
		hasNewNotify: Boolean
	},
	data() {
		return {
			isLoading: false,
			sidebars: [],
		};
	},
	computed: {
		userProfile() {
			return this.$store.state.account.company;
		},
		profilePhoto() {
			return this.userProfile.logo ? `${AWS_IMAGE_URL}/logos/` + this.userProfile.logo : '';
		}
	},
	created() {
		this.sidebars = Sidebars[this.role];
	}
};
</script>

<style lang="scss" scoped>
.sidebar-container {
	width: 250px;
	border-right: 1px solid $gray-light;
	padding: 20px 10px 0;
	.profile-data {
		border-bottom: 1px solid $gray-light;
		margin-bottom: 14px;
		.avatar {
			width: 60px;
			height: 60px;
			margin: 0 auto;
			img {
				width: 100%;
				height: 100%;
				object-fit: cover;
				border-radius: 50px;
			}
		}
		.profile-name {
			font-weight: 500;
			font-size: 20px;
			padding: 8px 0;
			text-align: center;
		}
	}
	.tabs {
		.tab {
			font-weight: 500;
			font-size: 16px;
			display: flex;
			align-items: center;
			margin-bottom: 5px;
			padding: 8px 5px;
			cursor: pointer;
			&.active {
				background: #a2d7ff;
				color: #fff;
				border-radius: 4px;
			}
			span {
				margin-left: 30px;
				&.new-notify {
					display: inline-block;
					width: 7px;
					height: 7px;
					background: $red-primary;
					margin-left: 8px;
					border-radius: 5px;
				}
			}
		}
	}
	.sign-out {
		position: fixed;
		bottom: 0;
		width: 225px;
		display: flex;
		justify-content: center;
		border-top: 1px solid $gray-dark;
		padding: 12px 0;
		font-weight: 500;
		font-size: 16px;
		cursor: pointer;
		background: #fff;
		img {
			margin-right: 15px;
		}
	}
}
</style>
