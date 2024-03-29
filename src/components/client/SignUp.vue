<template>
	<div class="client-login sign-up">
		<h3 class="head-title">{{$t('signUp.title')}}</h3>
		<template v-if="formStep == 'first'">
			<v-form ref="registerForm">
				<img src="../../assets/images/register-step-one.svg" class="step">
				<div class="masked-input">
					<span class="label">{{$t('phone')}}</span>
					<MaskedInput
						mask="\+\996 (111) 11-11-11"
						:placeholder="$t('phoneNumber')"
						v-model="phoneView"
						@input="rawPhoneValue = arguments[1]"
						autocomplete="new-password"
					/>
					<v-text-field class="error-only" v-model="rawPhoneValue" :rules="phoneRule"/>
				</div>
				<button class="btn green-main next" @click.prevent="sendPhoneNum" v-if="showBtn">
					{{$t('getCode')}}
				</button>
				<div id="recaptcha-container"></div>
			</v-form>
		</template>

		<template v-if="formStep == 'second'">
			<img src="../../assets/images/register-step-two.svg" class="margin-bottom step">
			<div class="password">
				<span class="label">{{$t('phoneNumber')}}</span>
				<v-text-field
					solo
					v-model="phoneView"
					readonly
					disabled
					class="no-detail"
				/>
			</div>
			<div class="masked-input text-lg-center code">
				<span class="label d-block">{{$t('confirmationCode')}}</span>
				<MaskedInput
					mask="1•1•1•1•1•1"
					@input="codeValue = arguments[1]"
					class="text-lg-center short"
				/>
			</div>
			<div class="btn-actions">
				<button class="btn white-color-green" @click="formStep='first';showBtn=true">{{$t('button.back')}}</button>
				<button class="btn green-main next" @click="sendReceivedSmsCode">{{$t('button.next')}}</button>
			</div>
		</template>

		<template v-if="formStep == 'last'">
			<img src="../../assets/images/register-step-last.svg" class="step margin-bottom">
			<div class="password">
				<span class="label">{{$t('phoneNumber')}}</span>
				<v-text-field
					solo
					v-model="phoneView"
					readonly
					disabled
					class="no-detail"
				/>
			</div>
			<div class="set-pass">
				<div class="password first-pass">
					<span class="label">{{$t('password')}}</span>
					<v-text-field
						solo
						type="password"
						v-model="registerObj.password"
						:rules="requiredRule"
					/>
				</div>
				<div class="password">
					<span class="label">Повторите пароль</span>
					<v-text-field
						solo
						type="password"
						v-model="checkPassword"
						:rules="requiredRule"
					/>
				</div>
			</div>
			<button class="btn green-main next" @click.prevent="submitRegister">{{$t('signUp.submitSignUp')}}</button>
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
			requiredRule: [(v) => !!v || this.$t('requiredField')],
			phoneRule: [
				v => !!v || this.$t('requiredField'),
				v => ( v && !v.includes('_') ) || 'Введите правильный номер телефона'
			],
			formStep: 'first',
			phoneView: '',
			codeValue: '',
			rawPhoneValue: '',
			showBtn: true,
			secretCode: '',
			checkPassword: '',
			registerObj: {
				phoneNumber: '',
				password: ''
			},
		};
	},
	computed: {
		...mapState('account', ['onSuccess', 'onError'])
	},
	methods: {
		async sendPhoneNum() {
			if (this.$refs.registerForm.validate()) {
				this.showBtn = false;
				try {
					const recaptcha = new firebase.firebase_.auth.RecaptchaVerifier("recaptcha-container");
					const provider = new firebase.firebase_.auth.PhoneAuthProvider();
					this.secretCode = await provider.verifyPhoneNumber(`+996${this.rawPhoneValue}`, recaptcha);
					this.formStep = 'second';
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
			try {
				this.$emit('loading', true);
				const credential = await firebase.firebase_.auth.PhoneAuthProvider.credential(this.secretCode, this.codeValue);
				await firebase.auth().signInWithCredential(credential);
				this.registerObj.idToken = await firebase.auth().currentUser.getIdToken();
				this.formStep = 'last';
				this.$emit('loading', false);
			} catch (err) {
				this.$toast.error(err);
				this.$emit('loading', false);
			}
		},
			
		async submitRegister() {
			if (!this.registerObj.password || this.registerObj.password !== this.checkPassword) {
				this.$toast.info('Пароли не совпадают!');
				return;
			}
			this.$emit('loading', true);
			this.registerObj.phoneNumber = `+996${this.rawPhoneValue}`;
			this.$store.dispatch('account/clientRegister', this.registerObj);
		}
	},

	watch: {
		onSuccess(msg) {
			if (msg) {
				this.$modal.hide('login-modal');
				this.$store.state.account.onSuccess = '';
				this.$toast.success('Вы успешно зарегистрировались, осталось заполнить профиль', {duration: 3500});
			}
		},
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