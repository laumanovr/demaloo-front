<template>
	<div class="client-sign-up-in-container">
		<PreLoader v-if="isLoading"/>
		<div class="login-image web">
				<img src="../../assets/images/welcome.svg">
			<div class="logo-text">
				<img src="../../assets/images/big-logo.svg">
				<div class="title">
					<span>Demaloo</span>
					<!--<span>Отдых без забот</span>-->
				</div>
			</div>
		</div>
		<div class="form-container">
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
					<span class="question">Уже есть аккаунт?</span>
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
			isLoading: false
		};
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
		.login-image {
			position: relative;
			.logo-text {
				display: flex;
				align-items: center;
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				.title {
					display: inherit;
					span {
						font-size: 45px;
						color: #fff;
						margin-left: 20px;
					}
				}
			}
		}
		.form-container {
			padding: 25px;
			width: 507px;
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
