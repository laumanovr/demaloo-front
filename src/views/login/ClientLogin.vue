<template>
	<div class="client-sign-up-in-container">
		<PreLoader v-if="isLoading"/>
		<div class="login-image web">
			<img src="../../assets/images/welcome.png" class="welcome">
			<div class="logo-text">
				<img src="../../assets/images/big-logo.svg">
				<div class="title">
					<img src="../../assets/images/demaloo-text.png">
					<span>{{$t('slogan2')}}</span>
				</div>
			</div>
		</div>
		<div class="form-container">
			<ClientSignIn
				v-if="loginType == 'login'"
				@loading="showLoader"
				@resetPass="loginType='reset'"
			/>
			<ClientSignUp
				v-if="loginType == 'signUp'"
				@loading="showLoader"
			/>
			<ForgotPassword
				v-if="loginType == 'reset'"
				@loading="showLoader"
				@restored="loginType='login'"
			/>
			<div class="form-link">
				<template v-if="loginType == 'login'">
					<div class="question">{{$t('signUp.noAccount')}}?</div>
					<span class="answer" @click="loginType = 'signUp'">{{$t('signUp.title')}}</span>
				</template>
				<template v-if="loginType == 'signUp' || loginType == 'reset'">
					<div class="question">{{$t('signUp.hasAccount')}}?</div>
					<span class="answer" @click="loginType = 'login'">{{$t('button.login')}}</span>
				</template>
			</div>
			<div class="policy" v-if="loginType == 'login'">
				{{$t('signUp.termsOfUse')}}.
			</div>
		</div>
	</div>
</template>

<script>
import ClientSignIn from '@/components/client/SignIn';
import ClientSignUp from '@/components/client/SignUp';
import ForgotPassword from '@/components/client/ForgotPassword';

export default {
	components: {
		ClientSignUp,
		ClientSignIn,
		ForgotPassword
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
					margin: 12px 0 6px;
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
