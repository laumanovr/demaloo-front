<template>
	<div class="company-sign-up-in" :class="{ 'step-two': formStep == 'two' || formStep == 'complete' }">
		<h3 class="head-title">
			<template v-if="formStep == 'complete'">Регистрация завершена!</template>
			<template v-else>Регистрация</template>
		</h3>
		<span class="sign-up-in-text">Быстрый, легкий и максимально удобный поиск туров!</span>
		<div class="sign-in-up-type" v-if="formStep == 'one'">
			<span class="change" @click="$emit('changeType', 'client')">Турист</span>
			<span class="selected">Тур-оператор</span>
		</div>
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
					label="Название ОсОО"
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
				<button class="btn purple next" @click.prevent="goToNextStep">
					Далее
				</button>
			</template>

			<template v-if="formStep == 'two'">
				<v-text-field
					label="Пароль"
					class="no-border"
					type="password"
					:rules="required"
					v-model="companyObj.password"
				/>
				<v-text-field
					label="Повторите пароль"
					class="no-border"
					type="password"
					:rules="required"
					v-model="repeatPass"
				/>
				<button class="btn purple next" @click.prevent="submitRegister">
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
					<router-link to="/">На главную</router-link>
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
				(v) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Email должен быть валидным',
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
		};
	},
	methods: {
		goToNextStep() {
			if (this.$refs.signUpForm.validate()) {
				this.formStep = 'two';
				this.$refs.signUpForm.resetValidation();
			}
		},

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
		text-align: center;
		margin-top: 20px;
	}
</style>
