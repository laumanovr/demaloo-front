<template>
	<div class="company-sign-up-in">
		<h3 class="head-title">Добро пожаловать!</h3>
		<span class="sign-up-in-text">Быстрый, легкий и максимально удобный поиск туров!</span>
		<div class="sign-in-up-type">
			<span class="selected">Турист</span>
			<span class="change" @click="$emit('changeType', 'company')">Тур-оператор</span>
		</div>
		<v-form ref="signInForm">
			<div class="masked-input" @click="isDisabled = false">
				<MaskedInput
					mask="\+\996 (111) 11-11-11"
					placeholder="+996(555)12-34-56"
					@input="phoneValue = arguments[1]"
					:readonly="isDisabled"
				/>
				<v-text-field class="error-only" v-model="phoneValue" :rules="phoneRule"/>
			</div>
			<v-text-field
				class="no-border"
				label="Пароль"
				type="password"
				:rules="requiredRule"
				v-model="loginObj.password"
				:readonly="isDisabled"
			/>
			<button class="btn purple next" @click.prevent="submitLogin">
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
		...mapState('account', ['onError']),
	},
	data() {
		return {
			requiredRule: [(v) => !!v || 'Обязательное поле'],
			phoneRule: [
				v => !!v || 'Обязательное поле',
				v => ( v && !v.includes('_') ) || 'Введите правильный номер телефона'
			],
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
			if (this.$refs.signInForm.validate()) {
				this.$emit('loading', true);
				this.loginObj.phoneNumber = `+996${this.phoneValue}`;
				this.$store.dispatch('account/clientLogin', this.loginObj);
			}
		}
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