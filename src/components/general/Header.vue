<template>
	<div class="header-container">
		<div class="header-info">
			<div class="logo" @click="$router.push('/')">
				<img src="../../assets/images/logo.svg">
				<span>Demaloo</span>
			</div>
			<div class="links">
				<template v-if="$route.path == '/'">
					<!--mobile-->
					<svg @click="showMobileSearch" class="mob" :class="{'searchOpen': isSearchOpen}">
						<use href="../../assets/icons/svg-sprite/loupe-icon.svg#loupe"/>
					</svg>
					<img src="../../assets/icons/sort-icon.svg" class="mob sort">
				</template>
				<a href="#" class="web">Поддержка</a>
				<template v-if="userLogged">
					<div class="profile" @click="$router.push('/profile-manage')">
						<span class="name web">{{userProfile.name}}</span>
						<img :src="profilePhoto" v-if="profilePhoto">
						<img src="../../assets/icons/profile.svg" v-else>
					</div>
				</template>
				<template v-else>
					<router-link :to="{name: 'companyLogin'}" class="web">Для туроператоров</router-link>
					<a class="login web" @click="$emit('onLogin')">Войти</a>
					<!--mobile-->
					<img src="../../assets/icons/circle-person.svg" @click="$emit('onLogin')" class="mob">
				</template>
			</div>
		</div>
	</div>
</template>

<script>
import {API_BASE_URL} from '@/services/api.service';
import {CustomEventEmitter} from '@/utils/customEventEmitter';

export default {
	data() {
		return {
			isSearchOpen: false
		}
	},
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
	},
	methods: {
		showMobileSearch() {
			this.isSearchOpen = !this.isSearchOpen;
			CustomEventEmitter.$emit('onShowSearch');
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
		@media #{$mob-view} {
			padding: 0 10px;
		}
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
				.profile {
					cursor: pointer;
					border: 1px solid $gray-light;
					border-radius: 30px;
					display: flex;
					align-items: center;
					padding: 2px 5px 2px 20px;
					margin-left: 50px;
					@media #{$mob-view} {
						border: 0;
						padding: 0;
						margin: 0;
					}
					&:hover {
					}
					img {
						background: #fff;
						border-radius: 20px;
						width: 30px;
						height: 30px;
					}
					.name {
						font-weight: 600;
						font-size: 12px;
						color: $blue-darkest;
						margin-right: 10px;
					}
				}
			}
		}
		@media #{$mob-view} {
			.links {
				img.sort {
					margin: 0 18px;
				}
				svg {
					fill: $blue-darkest;
					&.searchOpen {
						fill: #0ACF83;
					}
				}
			}
		}
	}
</style>