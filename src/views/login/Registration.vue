<template>
	<div class="main-sign-up-in-container">
		<PreLoader v-if="isLoading"/>
		<div class="login-image">
			<router-link to="/">
				<img src="../../assets/images/welcome.svg">
			</router-link>
		</div>
		<div class="form-container">
			<ClientSignUp
				v-if="registerType == 'client'"
				@changeType="changeForm"
				@loading="showLoader"
			/>
			<CompanySignUp
				v-if="registerType == 'company'"
				@changeType="changeForm"
				@loading="showLoader"
			/>
			<div class="form-link">
				<span>Уже есть аккаунт?</span><span @click="$router.push('/login')">Войти</span>
			</div>
		</div>
	</div>
</template>

<script>
import CompanySignUp from '@/components/company/SignUp';
import ClientSignUp from '@/components/client/SignUp';
import PreLoader from '@/components/general/PreLoader';

export default {
	components: {
		CompanySignUp,
		ClientSignUp,
		PreLoader
	},
	data() {
		return {
			isLoading: false,
			registerType: 'company'
		};
	},
	methods: {
		changeForm(type) {
			this.registerType = type;
		},
		showLoader(bool) {
			this.isLoading = bool;
		}
	}
};
</script>
