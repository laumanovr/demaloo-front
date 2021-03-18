<template>
	<div class="main-sign-up-in-container">
		<PreLoader v-if="isLoading"/>
		<div class="login-image">
			<router-link to="/">
				<img src="../../assets/images/welcome.svg">
			</router-link>
		</div>
		<div class="form-container">
			<ClientSignIn
				v-if="loginType == 'client'"
				@changeType="showLoginForm"
				@loading="showLoader"
			/>
			<CompanySignIn
				v-if="loginType == 'company'"
				@changeType="showLoginForm"
				@loading="showLoader"
			/>
			<div class="form-link">
				<span>Нет аккаунта?</span>
				<span @click="$router.push('/registration')">Зарегистрироваться</span>
			</div>
		</div>
	</div>
</template>

<script>
import CompanySignIn from '@/components/company/SignIn';
import ClientSignIn from '@/components/client/SignIn';
import PreLoader from '@/components/general/PreLoader';

export default {
	components: {
		CompanySignIn,
		ClientSignIn,
		PreLoader
	},
	data() {
		return {
			loginType: 'company',
			isLoading: false
		};
	},
	methods: {
		showLoginForm(type) {
			this.loginType = type;
		},

		showLoader(bool) {
			this.isLoading = bool;
		}
	}
};
</script>

<style lang="scss">
  .main-sign-up-in-container {}
</style>
