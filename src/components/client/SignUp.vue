<template>
	<div class="company-sign-up-in">
		<!--<div class="back-route">-->
			<!--<img src="../../assets/icons/left-arrow.svg" @click="$router.push('/')"/>Назад-->
		<!--</div>-->
		<h3 class="head-title">Регистрация</h3>
		<template v-if="formStep == 'first'">
			<span class="sign-up-in-text">Быстрый, легкий и максимально удобный поиск туров!</span>
			<!--<div class="sign-in-up-type">-->
				<!--<span class="selected">Турист</span>-->
				<!--<span class="change" @click="$emit('changeType', 'company')">Тур-оператор</span>-->
			<!--</div>-->
			<v-form ref="registerForm">
				<div class="masked-input" @click="inputDisabled = false">
					<MaskedInput
						mask="\+\996 (111) 11-11-11"
						placeholder="Ваш номер телефона"
						v-model="phoneView"
						@input="registerObj.phoneNumber = arguments[1]"
						:readonly="inputDisabled"
					/>
					<v-text-field class="error-only" v-model="registerObj.phoneNumber" :rules="phoneRule"/>
				</div>
				<v-text-field
					solo
					label="Пароль"
					placeholder="Пароль"
					type="password"
					v-model="registerObj.password"
					:rules="requiredRule"
					:readonly="inputDisabled"
				/>
				<div class="btn-actions" v-if="showBtn">
					<button class="btn purple next" @click.prevent="sendPhoneNum">
						Далее
					</button>
				</div>
				<div id="recaptcha-container"></div>
			</v-form>
		</template>

		<template v-if="formStep == 'last'">
			<span class="sign-up-in-text">Ваш номер телефона {{phoneView}}</span>
			<div class="type-code">Введите 6-ти значный код отправленный на ваш телефон</div>
			<div class="masked-input code">
				<MaskedInput
					mask="1.1.1.1.1.1"
					placeholder="_._._._._._"
					@input="codeValue = arguments[1]"
				/>
			</div>
			<button class="btn purple next" @click="sendReceivedSmsCode">
				Далее
			</button>
		</template>
	</div>
</template>

<script>
import MaskedInput from 'vue-masked-input';
import firebase from '../../plugins/firebase';
import {mapState} from 'vuex';

export default {
	components: {
		MaskedInput,
	},
	data() {
		return {
			requiredRule: [(v) => !!v || 'Обязательное поле'],
			phoneRule: [
				v => !!v || 'Обязательное поле',
				v => ( v && !v.includes('_') ) || 'Введите правильный номер телефона'
			],
			formStep: 'first',
			phoneView: '',
			codeValue: '',
			inputDisabled: true,
			showBtn: true,
			secretCode: '',
			registerObj: {
				phoneNumber: '',
				password: ''
			},

		};
	},
	computed: {
		...mapState('account', ['onError'])
	},
	methods: {
		async sendPhoneNum() {
			if (this.$refs.registerForm.validate()) {
				this.showBtn = false;
				try {
					const recaptcha = new firebase.firebase_.auth.RecaptchaVerifier("recaptcha-container");
					const provider = new firebase.firebase_.auth.PhoneAuthProvider();
					this.secretCode = await provider.verifyPhoneNumber(`+996${this.registerObj.phoneNumber}`, recaptcha);
					this.formStep = 'last';
				} catch (err) {
					this.$toast.error(err);
				}
			}
		},
			
		async sendReceivedSmsCode() {
			if (this.codeValue.replaceAll('_','').length !== 6) {
				this.$toast.error('Введите все 6 цифр!');
				return;
			}
			this.$emit('loading', true);
			const credential = await firebase.firebase_.auth.PhoneAuthProvider.credential(this.secretCode, this.codeValue);
			await firebase.auth().signInWithCredential(credential);
			const token = await firebase.auth().currentUser.getIdToken();
			this.submitRegister(token);
		},
			
		async submitRegister(userToken) {
			this.registerObj.idToken = userToken;
			this.registerObj.phoneNumber = `+996${this.registerObj.phoneNumber}`;
			this.$store.dispatch('account/clientRegister', this.registerObj);
		}
	},

	watch: {
		onError(message) {
			if (message) {
				this.$toast.error(message);
				this.$emit('loading', false);
				this.$store.state.account.onError = '';
			}
		}
	}
};
</script>