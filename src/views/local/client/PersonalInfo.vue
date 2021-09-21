<template>
	<div class="personal-info">
		<PreLoader v-if="isLoading"/>
		<div class="mob-profile-head head-title mob">
			<img src="../../../assets/icons/arrow-dark.svg" @click="$router.push('/mobile-profile')"/>
			<span>{{$t('profile.updateProfile')}}</span>
		</div>
		<v-form ref="profileForm">
			<div class="profile-avatar">
				<div class="image">
					<img :src="avatarUrl" @error="$event.target.src = require('@/assets/icons/profile-tab.svg')">
				</div>
				<label for="ava">{{$t('profile.changePhoto')}}</label>
				<input type="file" id="ava" @change="selectPhoto">
			</div>
			<v-text-field
				outlined
				:label="$t('profile.name')"
				v-model="profileObj.name"
				:rules="requiredRule"
			/>
			<v-text-field
				outlined
				:label="$t('profile.surname')"
				v-model="profileObj.surname"
				:rules="requiredRule"
			/>
			<v-text-field
				outlined
				label="Email"
				v-model="profileObj.email"
				:rules="requiredRule"
			/>
			<v-select
				outlined
				:items="genders"
				:label="$t('profile.gender')"
				item-text="title"
				item-value="value"
				v-model="profileObj.gender"
				:rules="requiredRule"
			/>
			<div class="masked-input">
				<span class="label">{{$t('profile.dateOfBirth')}}</span>
				<MaskedInput
					mask="11.11.1111"
					placeholder="Дата рождения: 15.03.1985"
					v-model="profileDob"
				/>
			</div>
			<div class="single-center">
				<button class="btn green-main" @click.prevent="submitProfileInfo">{{$t('button.save')}}</button>
			</div>
		</v-form>

		<!--PROFILE INFO MODAL-->
		<modal name="profile-info-modal" height="auto" :adaptive="true">
			<div class="modal-container">
				<h3>{{$t('profile.fillInfoWarning')}}!</h3>
				<div class="single-center">
					<button class="btn green-main" @click="$modal.hide('profile-info-modal')">OK</button>
				</div>
			</div>
		</modal>
	</div>
</template>

<script>
import MaskedInput from 'vue-masked-input';
import PreLoader from '@/components/general/PreLoader';
import {mapState} from 'vuex';
import {format, parse, isValid} from 'date-fns';
import {ImageService} from '@/services/image.service';
import {AWS_IMAGE_URL} from '@/services/api.service';
import {UserService} from '../../../services/user.service';

export default {
	components: {
		MaskedInput,
		PreLoader
	},
	data() {
		return {
			isLoading: false,
			requiredRule: [(v) => !!v || this.$t('requiredField')],
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
		this.isLoading = true;
		this.getMyProfile();
	},
	methods: {
		async getMyProfile() {
			try {
				const res = await UserService.fetchMyProfile();
				this.profileObj = res.data.user;
				this.profileDob = this.profileObj.birthdate ? format(new Date(this.profileObj.birthdate), 'dd.MM.yyyy') : '';
				this.avatarUrl = `${AWS_IMAGE_URL}/photos/` + this.profileObj.photo;
				this.isLoading = false;
				this.$nextTick(() => {
					this.$refs.profileForm.resetValidation();
				});
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},
		async selectPhoto(e) {
			const formats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg', 'image/svg+xml'];
			const file = e.target.files[0];
			if (!formats.includes(file.type)) {
				this.$toast.error('Ошибка! Файл не похож на картинку!');
				return;
			}
			try {
				this.isLoading = true;
				const res = await ImageService.generateSaveUrl({folder: 'photos', fileType: file.type.slice(6)});
				await ImageService.saveImage(res.data.url, file);
				this.profileObj.photo = res.data.fileName;
				this.avatarUrl = URL.createObjectURL(file);
				this.isLoading = false;
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		submitProfileInfo() {
			if (this.$refs.profileForm.validate()) {
				const parsedDate = parse(this.profileDob, 'dd.MM.yyyy', new Date());
				if (!isValid(parsedDate) || parsedDate.getFullYear() < 1940) {
					this.$toast.error('Некорректная дата рождения!');
					return;
				}
				this.isLoading = true;
				this.profileObj.birthdate = format(parsedDate, 'yyyy-MM-dd');
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
		max-width: 60%;
		@media #{$mob-view} {
			max-width: none;
		}
		.v-form {
			min-width: 500px;
			@media #{$mob-view} {
				min-width: auto;
				padding: 0 15px 20px;
			}
			.profile-avatar {
				margin: 20px 0;
				display: flex;
				align-items: center;
				.image {
					width: 85px;
					height: 85px;
					display: flex;
					align-items: center;
					margin-right: 25px;
					img {
						width: 100%;
						height: 100%;
						object-fit: cover;
						margin-right: 10px;
						border-radius: 35px;
					}
				}
				label {
					font-weight: 600;
					font-size: 14px;
					color: $blue-darkest;
					text-decoration: underline;
					cursor: pointer;
				}
				input {
					display: none;
				}
			}
			.single-center {
				margin: 50px 0 5px;
				.btn {
					height: 53px;
				}
			}
			.masked-input {
				margin: 0;
				input {
					border-color: $gray-dark;
					box-shadow: none;
					height: 52px;
				}
			}
		}
	}
</style>