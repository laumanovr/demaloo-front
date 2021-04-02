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
				v-if="loginType == 'login'"
				@loading="showLoader"
			/>
			<ClientSignUp
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
  .main-sign-up-in-container {}
</style>
