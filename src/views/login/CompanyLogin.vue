<template>
	<div class="company-sign-up-in-container">
		<PreLoader v-if="isLoading"/>
		<div class="login-image">
			<router-link to="/">
				<img src="../../assets/images/welcome.png" class="welcome" :class="{'sign-in': loginType == 'login'}">
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
			/>
			<CompanySignUp
				v-if="loginType == 'signUp'"
				@loading="showLoader"
			/>
			<div class="form-link">
				<template v-if="loginType == 'login'">
					<span>Нет аккаунта?</span>
					<span @click="loginType = 'signUp'">Зарегистрироваться</span>
				</template>
				<template v-if="loginType == 'signUp'">
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
import PreLoader from '@/components/general/PreLoader';

export default {
	components: {
		CompanySignUp,
		CompanyLogin,
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
