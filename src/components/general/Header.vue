<template>
	<div class="header-container">
		<div class="header-info">
			<div class="logo" @click="$router.push('/')">
				<img src="../../assets/images/logo.svg">
				<span>Demaloo</span>
			</div>
			<div class="links">
				<template v-if="userLogged">
					<span @click="$router.push('/profile-manage')">
						<img :src="profilePhoto" v-if="profilePhoto">
						<img src="../../assets/icons/profile.svg" v-else>
					</span>
				</template>
				<template v-else>
					<router-link :to="{name: 'companyLogin'}">Для туроператоров</router-link>
					<a href="#">Поддержка</a>
					<router-link to="/login" class="login">Войти</router-link>
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
		background: #fff;
		text-align: center;
		border-bottom: 1px solid $gray-light;
		padding: 0 2px;
		.header-info {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 65px;
			max-width: 1200px;
			margin: 0 auto;
			.logo {
				cursor: pointer;
				display: flex;
				align-items: center;
				span {
					font-size: 18px;
					font-weight: bold;
					margin-left: 10px;
					color: $blue-darkest;
				}
			}
			.links {
				display: flex;
				align-items: center;
				a {
					color: $blue-darkest;
					font-weight: 600;
					font-size: 13px;
					text-decoration: none;
					letter-spacing: 0.8px;
					margin-left: 30px;
					&:hover {
						font-weight: 900;
					}
					&.login {
						color: $green-main;
						font-size: 14px;
						border: 1px solid;
						border-radius: 20px;
						padding: 4px 15px;
					}
				}
				span {
					width: 30px;
					height: 30px;
					cursor: pointer;
					border: 1px solid $green-main;
					border-radius: 30px;
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