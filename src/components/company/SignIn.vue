<template>
	<div class="company-sign-up-in login">
		<h3 class="head-title">Добро пожаловать!</h3>
		<span class="sign-up-in-text">Быстрый, легкий и максимально удобный поиск туров!</span>
		<v-form ref="signInForm">
			<v-text-field
				outlined
				label="Электронная почта"
				:rules="emailRule"
				v-model="loginObj.email"
				autocomplete="new-password"
				validate-on-blur
			/>
			<v-text-field
				outlined
				label="Пароль"
				:rules="requiredRule"
				v-model="loginObj.password"
				type="password"
				autocomplete="new-password"
			/>
			<button class="btn green-main next" @click.prevent="submitLogin">
				Войти
			</button>
			<div class="forgot-password" @click="$emit('recoverPass')">Забыли пароль?</div>
		</v-form>
	</div>
</template>

<script>
import {mapState} from 'vuex';

export default {
	components: {},
	data() {
		return {
			requiredRule: [(v) => !!v || this.$t('requiredField')],
			emailRule: [
				(v) => !!v || 'Email обязательный',
				(v) => /^[a-zA-Z0-9()*_\-!#$%^&*,."'@\][]+$/.test(v) || 'Email должен быть на латинице',
				(v) => {
					const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
					return pattern.test(v) || 'Email должен быть валидным';
				}
			],
			loginObj: {
				email: '',
				password: '',
			}
		};
	},
	computed: {
		...mapState('account', ['onError'])
	},
	mounted() {
		window.scrollTo(0, 0);
	},
	methods: {
		submitLogin() {
			if (this.$refs.signInForm.validate()) {
				this.$emit('loading', true);
				this.$store.dispatch('account/companyLogin', this.loginObj);
			}
		},
	},
	watch: {
		onError(msg) {
			if (msg) {
				this.$toast.error(msg);
				this.$emit('loading', false);
				this.$store.state.account.onError = '';
			}
		}
	}
};
</script>
