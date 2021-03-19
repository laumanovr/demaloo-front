<template>
	<div class="header-container">
		<div class="header-info">
			<div class="logo" @click="$router.push('/')"><img src="../../assets/images/logo.svg"></div>
			<div class="links">
				<template v-if="userLogged">
					<span @click="$router.push('/profile-manage')">
						<img :src="profilePhoto" v-if="profilePhoto">
						<img src="../../assets/icons/profile.svg" v-else>
					</span>
				</template>
				<template v-else>
					<router-link to="/login">Войти</router-link>
					<router-link to="/registration">Регистрация</router-link>
				</template>
			</div>
		</div>
	</div>
</template>

<script>
import {API_BASE_URL} from '@/services/api.service';
export default {
	computed: {
		userProfile() {
			return this.$store.state.account.customer;
		},
		userLogged() {
			return Object.values(this.userProfile).length > 0;
		},
		profilePhoto() {
			return this.userProfile.photo ? `${API_BASE_URL}/images/` + this.userProfile.photo : '';
		}
	}
};
</script>

<style lang="scss">
	.header-container {
		background: $indigo-blue;
		text-align: center;
		.header-info {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 87px;
			max-width: 1366px;
			margin: 0 auto;
			padding: 0 30px;
			.logo {
				cursor: pointer;
			}
			.links {
				display: flex;
				a {
					color: #fff;
					font-size: 14px;
					font-weight: 500;
					text-decoration: none;
					letter-spacing: 0.8px;
					&:hover {
						font-weight: 900;
					}
					&:first-child {
						margin-right: 25px;
					}
				}
				span {
					width: 30px;
					height: 30px;
					cursor: pointer;
					&:hover {
						width: 35px;
						height: 35px;
					}
					img {
						background: #fff;
						border-radius: 20px;
						width: 100%;
						height: 100%;
					}
				}
			}
		}
	}
</style>