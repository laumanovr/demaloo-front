<template>
	<div class="client-sign-up-in-container">
		<PreLoader v-if="isLoading"/>
		<div class="login-image web">
			<img src="../../assets/images/welcome.png" class="welcome">
			<div class="logo-text">
				<img src="../../assets/images/big-logo.svg">
				<div class="title">
					<img src="../../assets/images/demaloo-text.png">
					<span>Отдых без забот</span>
				</div>
			</div>
		</div>
		<div class="form-container" v-if="showContent">
			<ClientSignIn
				v-if="loginType == 'login'"
				@loading="showLoader"
			/>
			<ClientSignUp
				v-if="loginType == 'signUp'"
				@loading="showLoader"
			/>
			<div class="form-link">
				<template v-if="loginType == 'login'">
					<div class="question">Вы еще не зарегистрированы?</div>
					<span class="answer" @click="loginType = 'signUp'">Зарегистрироваться</span>
				</template>
				<template v-if="loginType == 'signUp'">
					<div class="question">Уже есть аккаунт?</div>
					<span class="answer" @click="loginType = 'login'">Войти</span>
				</template>
			</div>
			<div class="policy">
				By login into account, I agree to the Demaloo Terms of Use, Privacy Policy, and Demaloo Rewards Terms and Conditions.
			</div>
		</div>
	</div>
</template>

<script>
import ClientSignIn from '@/components/client/SignIn';
import ClientSignUp from '@/components/client/SignUp';
import PreLoader from '@/components/general/PreLoader';

export default {
	components: {
		ClientSignUp,
		ClientSignIn,
		PreLoader
	},
	data() {
		return {
			loginType: 'login',
			isLoading: false,
			showContent: false
		};
	},
	created() {
		this.isLoading = true;
		this.$nextTick(() => {
			setTimeout(() => {
				this.showContent = true;
				this.isLoading = false;
			});
		});
	},
	methods: {
		showLoader(bool) {
			this.isLoading = bool;
		}
	}
};
</script>

<style lang="scss">
	.client-sign-up-in-container {
		display: flex;
		align-items: flex-start;
		.login-image {
			position: relative;
			.welcome {
				max-width: 513px;
			}
			.logo-text {
				display: flex;
				align-items: center;
				justify-content: center;
				position: absolute;
				top: 0;
				left: 0;
				height: 100%;
				width: 100%;
				background: rgba($blue-darkest, 0.3);
				.title {
					display: inline-block;
					margin: 28px 0 0 20px;
					span {
						display: block;
						font-size: 14px;
						color: #fff;
						text-align: right;
					}
				}
			}
		}
		.form-container {
			padding: 25px 25px 18px;
			width: 507px;
			@media #{$mob-view} {
				width: 100%;
			}
			.form-link {
				text-align: center;
				border-bottom: 1px solid $gray-light;
				padding-bottom: 20px;
				.question {
					font-size: 14px;
					color: $gray-blue;
					margin: 25px 0 6px;
				}
				.answer {
					font-weight: 600;
					font-size: 16px;
					color: $green-main;
					text-decoration: underline;
					cursor: pointer;
				}
			}
			.policy {
				font-size: 13px;
				color: $gray-blue;
				text-align: center;
				margin-top: 15px;
			}
		}
	}
</style>
