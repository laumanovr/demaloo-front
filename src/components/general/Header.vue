<template>
	<div class="header-container">
		<div class="header-info">
			<div class="logo" @click="$router.push('/')">
				<img src="../../assets/images/logo-text.svg">
			</div>
			<div class="links">
				<div class="lang-select d-flex align-center">
					<inline-svg :src="require('@/assets/icons/globus.svg')" fill="#102542"/>
					<v-select
						class="no-detail"
						:items="languages"
						item-text="title"
						item-value="value"
						v-model="currentLang"
						@change="changeLang"
					/>
				</div>
				<template v-if="$route.path == '/'">
					<!--mobile-->
					<svg @click="showMobileSearch" class="mob search" :class="{'searchOpen': isSearchOpen}">
						<use href="../../assets/icons/svg-sprite/loupe-icon.svg#loupe"/>
					</svg>
					<img src="../../assets/icons/sort-icon.svg" class="mob sort" @click="openMobileFilter">
				</template>
				<router-link :to="{name: 'contacts'}" class="web contact">{{$t('contact.about7')}}</router-link>
				<template v-if="userLogged">
					<div class="profile web" @click="$router.push('/profile-manage')">
						<span class="name">{{userProfile.name}}</span>
						<img :src="profilePhoto" @error="$event.target.src = require('@/assets/icons/profile-tab.svg')">
					</div>
					<!--mobile-->
					<div class="profile mob" @click="$router.push('/mobile-profile')">
						<img :src="profilePhoto" @error="$event.target.src = require('@/assets/icons/profile-tab.svg')">
					</div>
				</template>
				<template v-else>
					<router-link :to="{name: 'companyLogin'}" class="web">{{$t('forOperators')}}</router-link>
					<a class="login web" @click="$emit('onLogin')">{{$t('button.login')}}</a>
					<!--mobile-->
					<img src="../../assets/icons/circle-person.svg" @click="$emit('onLogin')" class="mob">
				</template>
			</div>
		</div>
	</div>
</template>

<script>
import {AWS_IMAGE_URL} from '@/services/api.service';
import {CustomEventEmitter} from '@/utils/customEventEmitter';

export default {
	data() {
		return {
			isSearchOpen: false,
			currentLang: 'ru',
			languages: [
				{title: 'English', value: 'en'},
				{title: 'Русский', value: 'ru'}
			]
		};
	},
	created() {
		const selected = JSON.parse(window.localStorage.getItem('demalooLang'));
		this.currentLang = selected ? selected : 'ru';
		this.$root.$i18n.locale = this.currentLang;
	},
	computed: {
		userProfile() {
			return this.$store.state.account.customer;
		},
		userLogged() {
			return Object.values(this.userProfile).length > 0;
		},
		profilePhoto() {
			return `${AWS_IMAGE_URL}/photos/` + this.userProfile.photo;
		}
	},
	methods: {
		showMobileSearch() {
			this.isSearchOpen = !this.isSearchOpen;
			CustomEventEmitter.$emit('onShowSearch');
		},

		openMobileFilter() {
			CustomEventEmitter.$emit('onOpenFilter');
		},

		changeLang(selectedLang) {
			this.$root.$i18n.locale = selectedLang;
			window.localStorage.setItem('demalooLang', JSON.stringify(selectedLang));
			window.location.reload();
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
			padding: 0 20px;
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
			}
			.links {
				display: flex;
				align-items: center;
				a {
					color: $blue-darkest;
					font-weight: 600;
					font-size: 12px;
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
					&.router-link-exact-active {
						color: $green-main;
					}
				}
				.profile {
					cursor: pointer;
					border: 1px solid $gray-light;
					border-radius: 30px;
					display: flex;
					align-items: center;
					padding: 2px 5px 2px 20px;
					margin-left: 30px;
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
				.lang-select {
					outline: none;
					cursor: pointer;
					color: $blue-darkest;
					padding: 0 5px;
					svg {
						margin-right: 5px;
					}
					.no-detail {
						max-width: 97px;
						margin: 0;
						padding-top: 8px;
						.v-input__slot:before {
							content: none;
						}
						.v-input__append-inner {
							transform: translateX(-10px);
						}
					}
				}
			}
		}
		@media #{$mob-view} {
			.links {
				img.sort {
					margin: 0 20px;
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