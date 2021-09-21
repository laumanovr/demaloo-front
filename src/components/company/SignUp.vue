<template>
	<div class="company-sign-up-in" :class="{ 'step-two': formStep == 'two' || formStep == 'complete' }">
		<h3 class="head-title">
			<template v-if="formStep == 'complete'">Регистрация завершена!</template>
			<template v-else>Регистрация</template>
		</h3>
		<span class="sign-up-in-text">Быстрый, легкий и максимально удобный поиск туров!</span>
		<v-form ref="signUpForm">
			<template v-if="formStep == 'one'">
				<v-text-field
					class="sm-h"
					outlined
					label="Введите вашу электронную почту"
					placeholder="Email будет вашим логином"
					:rules="emailRule"
					v-model="companyObj.email"
				/>
				<v-text-field
					class="sm-h"
					label="Название"
					outlined
					:rules="required"
					v-model="companyObj.name"
				/>
				<v-text-field
					class="sm-h"
					label="Название Юр.лица"
					outlined
					:rules="required"
					v-model="companyObj.osoo"
				/>
				<v-text-field
					class="sm-h"
					label="Введите город"
					outlined
					:rules="required"
					v-model="companyObj.city"
				/>
				<v-text-field
					class="sm-h"
					label="Ваш адрес"
					outlined
					:rules="required"
					v-model="companyObj.address"
				/>
				<div class="masked-input">
					<MaskedInput
						mask="\+\996 (111) 11-11-11"
						placeholder="Ваш номер телефона"
						@input="companyObj.phoneNumber = arguments[1]"
					/>
					<v-text-field class="error-only" :rules="phoneRule" v-model="companyObj.phoneNumber"/>
				</div>
				<v-text-field
					class="sm-h"
					label="Пароль"
					placeholder="Минимум 6 символов"
					outlined
					type="password"
					:rules="required"
					v-model="companyObj.password"
					:readonly="isReadOnly"
					@focus="isReadOnly=false"
				/>
				<v-text-field
					class="sm-h"
					label="Повторите пароль"
					placeholder="Минимум 6 символов"
					outlined
					type="password"
					:rules="required"
					v-model="repeatPass"
					:readonly="isReadOnly"
				/>
				<button class="btn green-main next" @click.prevent="submitRegister">
					Регистрация
				</button>
			</template>
		</v-form>
		<template v-if="formStep == 'complete'">
			<h3>
				Ваша заявка отправлена на проверку, ожидайте пожалуйста, в скором
				времени вас уведомят!
			</h3>
			<div class="complete-icon">
				<img src="../../assets/icons/checked-icon.svg">
			</div>
			<div class="btn-actions">
				<button class="btn green-main">
					<router-link to="/" class="white--text">На главную</router-link>
				</button>
			</div>
		</template>
	</div>
</template>

<script>
import {UserService} from '@/services/user.service';
import MaskedInput from 'vue-masked-input';

export default {
	components: {
		MaskedInput,
	},
	data() {
		return {
			required: [(v) => !!v || this.$t('requiredField')],
			emailRule: [
				(v) => !!v || 'Email обязательный',
				(v) => /^[a-zA-Z0-9()*_\-!#$%^&*,."'@\][]+$/.test(v) || 'Email должен быть на латинице',
				(v) => {
					const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
					return pattern.test(v) || 'Email должен быть валидным';
				}
			],
			phoneRule: [
				v => !!v || this.$t('requiredField'),
				v => ( v && !v.includes('_') ) || 'Введите правильный номер телефона'
			],
			formStep: 'one',
			repeatPass: '',
			companyObj: {
				name: '',
				osoo: '',
				phoneNumber: '',
				email: '',
				password: '',
				city: '',
				address: '',
			},
			isReadOnly: true
		};
	},
	mounted() {
		window.scrollTo(0, 0);
	},
	methods: {
		async submitRegister() {
			if (this.$refs.signUpForm.validate()) {
				if (this.companyObj.password !== this.repeatPass) {
					this.$toast.warning('Пароли не совпадают!');
					return;
				}
				this.$emit('loading', true);
				try {
					await UserService.registerCompany(this.companyObj);
					this.formStep = 'complete';
					this.$emit('loading', false);
					this.$nextTick(() => {
						window.scrollTo(0, 0);
					});
				} catch (err) {
					this.$toast.error(err);
					this.$emit('loading', false);
				}
			}
		},
	},
};
</script>

<style lang="scss" scoped>
	.complete-icon {
		display: flex;
		justify-content: center;
		margin-top: 20px;
	}
	.masked-input {
		margin: 5px 0;
		input {
			box-shadow: none;
			border-color: $gray-dark;
		}
	}
</style>
