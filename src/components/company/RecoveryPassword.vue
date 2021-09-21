<template>
	<div class="recovery-pass-container">
		<h3 class="head-title">
			<template v-if="mode == 'first'">Введите ваш email</template>
			<template v-else>Введите код отправленный на ваш email, и задайте новый пароль.</template>
		</h3>
		<v-form ref="resetForm">
			<template v-if="mode == 'first'">
				<v-text-field
					autocomplete="new-password"
					label="Электронная почта"
					v-model="emailObj.email"
					:rules="emailRule"
					validate-on-blur
					outlined
				/>
				<button class="btn green-main" @click.prevent="sendCodeToEmail">Отправить</button>
			</template>
			<template v-if="mode == 'last'">
				<v-text-field
					label="Код отправленный на ваш email"
					autocomplete="new-password"
					v-model="resetPass.token"
					:rules="requiredRule"
					validate-on-blur
					outlined
				/>
				<v-text-field
					label="Задайте новый пароль"
					autocomplete="new-password"
					v-model="resetPass.password"
					:rules="requiredRule"
					validate-on-blur
					type="password"
					outlined
				/>
				<button class="btn green-main" @click.prevent="resetPassword">Сохранить</button>
			</template>
		</v-form>
	</div>
</template>

<script>
import {UserService} from '../../services/user.service';

export default {
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
			mode: 'first',
			emailObj: {
				email: ''
			},
			resetPass: {
				token: '',
				password: ''
			}
		};
	},
	methods: {
		async sendCodeToEmail() {
			if (this.$refs.resetForm.validate()) {
				try {
					this.$emit('loading', true);
					await UserService.sendRecoveryEmail(this.emailObj);
					this.mode = 'last';
					this.$emit('loading', false);
				} catch (err) {
					this.$toast.error(err);
					this.$emit('loading', false);
				}
			}
		},
		async resetPassword() {
			if (this.$refs.resetForm.validate()) {
				try {
					this.$emit('loading', true);
					await UserService.resetCompanyPassword(this.resetPass);
					this.$emit('restored');
					this.$emit('loading', false);
					this.$toast.success('Пароль успешно сброшен!');
				} catch (err) {
					this.$toast.error(err);
					this.$emit('loading', false);
				}
			}
		}
	}
};
</script>

<style lang="scss" scoped>
	.recovery-pass-container {
		padding: 30px 25px;
		margin-top: 15%;
	}
</style>