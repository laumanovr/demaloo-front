<template>
	<div class="personal-info">
		<PreLoader v-if="isLoading"/>
		<div class="head-title">Обновить профиль</div>
		<v-form ref="profileForm">
			<div class="profile-avatar">
				<div class="image" v-if="avatarUrl">
					<img :src="avatarUrl">
					<CloseIcon/>
				</div>
				<label for="ava" v-else>Загрузить фото</label>
				<input type="file" id="ava" @change="selectPhoto">
			</div>
			<v-text-field
				solo
				label="Имя"
				v-model="profileObj.name"
				:rules="requiredRule"
			/>
			<v-text-field
				solo
				label="Фамилия"
				v-model="profileObj.surname"
				:rules="requiredRule"
			/>
			<v-text-field
				solo
				label="Email"
				v-model="profileObj.email"
				:rules="requiredRule"
			/>
			<v-select
				solo
				:items="genders"
				label="Пол"
				item-text="title"
				item-value="value"
				v-model="profileObj.gender"
				:rules="requiredRule"
			/>
			<div class="masked-input">
				<MaskedInput
					mask="11.11.1111"
					placeholder="Дата рождения: 15.03.1985"
					v-model="profileDob"
				/>
			</div>
			<div class="single-center">
				<button class="btn green-primary" @click.prevent="submitProfileInfo">Сохранить</button>
			</div>
		</v-form>

		<!--PROFILE INFO MODAL-->
		<modal name="profile-info-modal" height="auto">
			<div class="modal-container">
				<h3>Заполните пожалуйста все поля, <br> и нажмите сохранить!</h3>
				<div class="single-center">
					<button class="btn blue-primary" @click="$modal.hide('profile-info-modal')">OK</button>
				</div>
			</div>
		</modal>
	</div>
</template>

<script>
import MaskedInput from 'vue-masked-input';
import PreLoader from '@/components/general/PreLoader';
import CloseIcon from '@/components/icons/CloseIcon';
import {mapState} from 'vuex';
import {format, parse} from 'date-fns';
import {API_BASE_URL} from '@/services/api.service';

export default {
	components: {
		MaskedInput,
		CloseIcon,
		PreLoader
	},
	data() {
		return {
			isLoading: false,
			requiredRule: [(v) => !!v || 'Обязательное поле'],
			genders: [
				{title: 'Мужской', value: 'male'},
				{title: 'Женский', value: 'female'}
			],
			avatarUrl: '',
			profileDob: '',
			profileObj: {
				photo: '',
				name: '',
				surname: '',
				email: '',
				gender: '',
				birthdate: ''
			}
		};
	},
	computed: {
		...mapState('account', ['onSuccess', 'onError']),
		userProfile() {
			return this.$store.state.account.customer;
		},
		userLogged() {
			return Object.values(this.userProfile).length > 0;
		}
	},
	created() {
		this.profileObj = JSON.parse(JSON.stringify(this.userProfile));
		this.profileDob = this.profileObj.birthdate ? format(new Date(this.profileObj.birthdate), 'dd.MM.yyyy') : '';
		this.avatarUrl = this.profileObj.photo ? `${API_BASE_URL}/images/` + this.profileObj.photo : '';
	},
	methods: {
		selectPhoto(e) {
			const formats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg', 'image/svg+xml'];
			const file = e.target.files[0];
			if (!formats.includes(file.type)) {
				this.$toast.error('Ошибка! Файл не похож на картинку!');
				return;
			}
			this.avatarUrl = URL.createObjectURL(file);
			this.profileObj.photo = file;
		},

		submitProfileInfo() {
			if (this.$refs.profileForm.validate()) {
				this.isLoading = true;
				this.profileObj.birthdate = format(parse(this.profileDob, 'dd.MM.yyyy', new Date()), 'yyyy-MM-dd');
				const formData = new FormData();
				Object.entries(this.profileObj).forEach((item) => formData.append(item[0], item[1]));
				this.$store.dispatch('account/clientUpdate', formData);
			}
		}
	},
	beforeRouteLeave(to, from, next) {
		if (!this.userLogged || this.userProfile.name) {
			return next();
		}
		this.$modal.show('profile-info-modal');
	},
	watch: {
		onSuccess(msg) {
			if (msg) {
				this.isLoading = false;
				this.$toast.success('Успешно обновлено!');
				this.$store.state.account.onSuccess = '';
			}
		},
		onError(msg) {
			if (msg) {
				this.isLoading = false;
				this.$toast.error(msg);
				this.$store.state.account.onError = '';
			}
		}
	}
};
</script>

<style lang="scss">
	.personal-info {
		.v-form {
			min-width: 500px;
			.profile-avatar {
				margin: 20px 0;
				.image {
					width: 80px;
					height: 80px;
					display: flex;
					align-items: center;
					img {
						width: 100%;
						height: 100%;
						object-fit: cover;
						margin-right: 10px;
					}
				}
				label {
					background: #fff;
					color: $blue-primary;
					border: 1px solid $gray-light;
					border-radius: 4px;
					cursor: pointer;
					padding: 10px 26px;
					display: inline-block;
				}
				input {
					display: none;
				}
			}
			.single-center {
				margin: 50px 0 5px;
			}
		}
	}
</style>