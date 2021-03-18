<template>
	<div class="company-sign-up-in">
		<!--<div class="back-route">-->
			<!--<img src="../../assets/icons/left-arrow.svg" @click="$router.push('/')"/>Назад-->
		<!--</div>-->
		<h3 class="head-title">Добро пожаловать!</h3>
		<span class="sign-up-in-text">Быстрый, легкий и максимально удобный поиск туров!</span>
		<div class="sign-in-up-type">
			<span class="change" @click="$emit('changeType', 'client')">Турист</span>
			<span class="selected">Тур-оператор</span>
		</div>
		<v-form ref="signInForm">
			<v-text-field
				class="no-border"
				label="Электронная почта"
				:rules="emailRule"
				v-model="loginObj.email"
				:readonly="isDisabled"
				@click="isDisabled = false"
			/>
			<v-text-field
				class="no-border"
				label="Пароль"
				:rules="requiredRule"
				v-model="loginObj.password"
				type="password"
				:readonly="isDisabled"
			/>
			<button class="btn purple next" @click.prevent="submitLogin">
				Войти
			</button>
		</v-form>
	</div>
</template>

<script>
import {mapState} from 'vuex';

export default {
	components: {},
	data() {
		return {
			requiredRule: [(v) => !!v || 'Обязательное поле'],
			emailRule: [
				(v) => !!v || 'Email обязательный',
				(v) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Email должен быть валидным',
			],
			loginObj: {
				email: '',
				password: '',
			},
			isDisabled: true
		};
	},
	computed: {
		...mapState('account', ['onError'])
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
