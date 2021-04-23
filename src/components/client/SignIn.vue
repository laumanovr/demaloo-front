<template>
	<div class="client-login">
		<h3 class="head-title">Войти в учетную запись</h3>
		<v-form ref="signInForm">
			<div class="masked-input">
				<span class="label">Телефон</span>
				<MaskedInput
					mask="\+\996 (111) 11-11-11"
					placeholder="+996(555)12-34-56"
					@input="phoneValue = arguments[1]"
				/>
			</div>
			<div class="password" @click="isDisabled=false">
				<span class="label">Пароль</span>
				<v-text-field
					solo
					label="Пароль"
					type="password"
					:rules="requiredRule"
					v-model="loginObj.password"
					:readonly="isDisabled"
				/>
			</div>
			<button class="btn green-main next" @click.prevent="submitLogin">
				Войти
			</button>
		</v-form>
	</div>
</template>

<script>
import MaskedInput from 'vue-masked-input';
import {mapState} from 'vuex';

export default {
	components: {
		MaskedInput
	},
	computed: {
		...mapState('account', ['onSuccess', 'onError']),
	},
	data() {
		return {
			requiredRule: [(v) => !!v || 'Обязательное поле'],
			// phoneRule: [
			// 	v => !!v || 'Обязательное поле',
			// 	v => ( v && !v.includes('_') ) || 'Введите правильный номер телефона'
			// ],
			phoneValue: '',
			loginObj: {
				phoneNumber: '',
				password: ''
			},
			isDisabled: true
		};
	},
	methods: {
		submitLogin() {
			if (this.phoneValue.includes('_')) {
				this.$toast.error('Введите правильный номер телефона');
				return;
			}
			if (this.$refs.signInForm.validate()) {
				this.$emit('loading', true);
				this.loginObj.phoneNumber = `+996${this.phoneValue}`;
				this.$store.dispatch('account/clientLogin', {loginObj: this.loginObj, url: this.$route.path});
			}
		}
	},
	watch: {
		onSuccess(msg) {
			if (msg) {
				this.$emit('loading', false);
				this.$store.state.account.onSuccess = '';
				this.$modal.hide('login-modal');
				this.$toast.success('Вы вошли в систему');
			}
		},
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

<style lang="scss"></style>