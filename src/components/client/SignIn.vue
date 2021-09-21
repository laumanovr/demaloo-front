<template>
	<div class="client-login">
		<h3 class="head-title">{{$t('signIn.loginTitle')}}</h3>
		<v-form ref="signInForm">
			<div class="masked-input">
				<span class="label">{{$t('phone')}}</span>
				<MaskedInput
					mask="\+\996 (111) 11-11-11"
					placeholder="+996(555)12-34-56"
					@input="phoneValue = arguments[1]"
					autocomplete="new-password"
				/>
			</div>
			<div class="password">
				<span class="label">{{$t('password')}}</span>
				<v-text-field
					solo
					:label="$t('password')"
					type="password"
					:rules="requiredRule"
					v-model="loginObj.password"
					autocomplete="new-password"
				/>
			</div>
			<button class="btn green-main next" @click.prevent="submitLogin">
				{{$t('button.login')}}
			</button>
			<div class="forgot-password" @click="$emit('resetPass')">{{$t('signIn.forgotPassLink')}}?</div>
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
			requiredRule: [(v) => !!v || this.$t('requiredField')],
			phoneValue: '',
			loginObj: {
				phoneNumber: '',
				password: ''
			}
		};
	},
	methods: {
		submitLogin() {
			if (!this.phoneValue || this.phoneValue.includes('_')) {
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
				this.$toast.success('Вы вошли в систему', {duration: 1000});
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