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
					label="Введите вашу электронную почту"
					placeholder="Email будет вашим логином"
					class="no-border"
					:rules="emailRule"
					v-model="companyObj.email"
				/>
				<v-text-field
					label="Название"
					class="no-border"
					:rules="required"
					v-model="companyObj.name"
				/>
				<v-text-field
					label="Название Юр.лица"
					class="no-border"
					:rules="required"
					v-model="companyObj.osoo"
				/>
				<v-text-field
					label="Введите город"
					class="no-border"
					:rules="required"
					v-model="companyObj.city"
				/>
				<v-text-field
					label="Ваш адрес"
					class="no-border"
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
					label="Пароль"
					class="no-border"
					type="password"
					:rules="required"
					v-model="companyObj.password"
					:readonly="isReadOnly"
					@focus="isReadOnly=false"
				/>
				<v-text-field
					label="Повторите пароль"
					class="no-border"
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
				<button class="btn blue-primary">
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
			required: [(v) => !!v || 'Обязательное поле'],
			emailRule: [
				(v) => !!v || 'Email обязательный',
				(v) => {
					const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
					return pattern.test(v) || 'Email должен быть валидным';
				}
			],
			phoneRule: [
				v => !!v || 'Обязательное поле',
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
</style>
