<template>
	<div class="sidebar-container">
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
				<div class="tab" @click="logOut">
					<img src="../../assets/icons/logout.svg" class="logout-icon"><span>Выход</span>
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
			</div>
		</div>
	</div>
</template>

<script>
import Sidebars from '@/utils/sidebars';
import {API_BASE_URL} from '@/services/api.service';

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
			return this.$store.state.account.company;
		},
		profilePhoto() {
			return this.userProfile.logo ? `${API_BASE_URL}/images/` + this.userProfile.logo : '';
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
			}
		}
	}
}
</style>
