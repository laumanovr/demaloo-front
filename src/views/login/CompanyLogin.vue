<template>
	<div class="company-sign-up-in-container">
		<PreLoader v-if="isLoading"/>
		<div class="login-image">
			<router-link to="/">
				<img src="../../assets/images/welcome-big.jpg" class="welcome">
				<div class="logo-text">
					<img src="../../assets/images/big-logo.svg">
					<div class="title">
						<img src="../../assets/images/demaloo-text.png">
						<span>Отдых без забот</span>
					</div>
				</div>
			</router-link>
		</div>
		<div class="form-container">
			<CompanyLogin
				v-if="loginType == 'login'"
				@loading="showLoader"
				@recoverPass="loginType='recovery'"
			/>
			<CompanySignUp
				v-if="loginType == 'signUp'"
				@loading="showLoader"
			/>
			<RecoveryPassword
				v-if="loginType == 'recovery'"
				@restored="loginType='login'"
				@loading="showLoader"
			/>
			<div class="form-link">
				<template v-if="loginType == 'login'">
					<span>Нет аккаунта?</span>
					<span @click="loginType = 'signUp'">Зарегистрироваться</span>
				</template>
				<template v-if="loginType == 'signUp' || loginType == 'recovery'">
					<span>Уже есть аккаунт?</span>
					<span @click="loginType = 'login'">Войти</span>
				</template>
			</div>
		</div>
	</div>
</template>

<script>
import CompanySignUp from '@/components/company/SignUp';
import CompanyLogin from '@/components/company/SignIn';
import RecoveryPassword from '@/components/company/RecoveryPassword';
import PreLoader from '@/components/general/PreLoader';

export default {
	components: {
		CompanySignUp,
		CompanyLogin,
		RecoveryPassword,
		PreLoader
	},
	data() {
		return {
			isLoading: false,
			loginType: 'login'
		};
	},
	methods: {
		showLoader(bool) {
			this.isLoading = bool;
		}
	}
};
</script>

<style lang="scss" scoped>
	.company-sign-up-in-container {
		display: flex;
		background: #fff;
		position: relative;
		.login-image {
			position: relative;
			min-width: 45%;
			.welcome {
				width: 100%;
				min-height: 100%;
				object-fit: cover;
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
			min-width: 55%;
			background: #fff;
		}
		.form-link {
			text-align: center;
			font-size: 14px;
			color: $black-light;
			padding-bottom: 25px;
			span:last-child {
				margin-left: 5px;
				color: $red-primary;
				cursor: pointer;
			}
		}
	}
</style>