<template>
	<div class="company-profile">
		<PreLoader v-if="isLoading"/>
		<div class="head-title">
			<img src="../../assets/icons/left-arrow.svg" @click="$router.go(-1)"/>Профиль
		</div>
		<v-form ref="profileForm">
			<div class="form-field">
				<span class="label">Название компании:</span>
				<v-text-field v-model="profileObj.name" :rules="requiredRule" solo/>
			</div>
			<div class="form-field">
				<span class="label">Юридическое лицо:</span>
				<v-text-field v-model="profileObj.osoo" :rules="requiredRule" solo/>
			</div>
			<div class="form-field">
				<span class="label">Описание:</span>
				<v-textarea
					solo
					:rules="requiredRule"
					v-model="profileObj.description"
				/>
			</div>
			<div class="form-field">
				<span class="label">Город:</span>
				<v-text-field v-model="profileObj.city" :rules="requiredRule" solo/>
			</div>
			<div class="form-field">
				<span class="label">Адрес:</span>
				<v-text-field v-model="profileObj.address" :rules="requiredRule" solo/>
			</div>
			<div class="form-field">
				<span class="label">Телефон:</span>
				<v-text-field
					solo
					:rules="requiredRule"
					v-model.number="profileObj.phoneNumber"
				/>
			</div>
			<div class="form-field">
				<span class="label">Email:</span>
				<v-text-field
					solo
					:rules="emailRule"
					v-model="profileObj.email"
				/>
			</div>
			<div class="form-field image">
				<span class="label">Логотип:</span>
				<div class="preview">
					<div class="image" v-if="previewUrl">
						<img :src="previewUrl"/>
						<span class="delete-img" @click="previewUrl=''">УДАЛИТЬ</span>
					</div>
					<label for="image" class="file" v-if="!previewUrl">
						<span class="download">Загрузить</span>
						<input type="file" id="image" @change="addLogo"/>
					</label>
				</div>
			</div>
		</v-form>
		<div class="btn-actions">
			<button class="btn green-primary" @click="submitUpdate">Сохранить</button>
		</div>
	</div>
</template>

<script>
import {mapState} from 'vuex';
import PreLoader from '@/components/general/PreLoader';
import {AWS_IMAGE_URL} from '@/services/api.service';
import {ImageService} from '@/services/image.service';

export default {
	components: {
		PreLoader
	},
	data() {
		return {
			emailRule: [
				(v) => !!v || 'Email обязательный',
				(v) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Email должен быть валидным',
			],
			requiredRule: [(v) => !!v || 'Обязательное поле'],
			profileObj: {},
			previewUrl: '',
			isLoading: false
		};
	},
	computed: {
		...mapState('account', ['onSuccess', 'onError']),
		userProfile() {
			return this.$store.state.account.company;
		}
	},
	created() {
		this.profileObj.name = this.userProfile.name;
		this.profileObj.osoo = this.userProfile.osoo;
		this.profileObj.city = this.userProfile.city;
		this.profileObj.description = this.userProfile.description;
		this.profileObj.address = this.userProfile.address;
		this.profileObj.phoneNumber = this.userProfile.phoneNumber;
		this.profileObj.email = this.userProfile.email;
		this.profileObj.logo = this.userProfile.logo;
		this.previewUrl = this.profileObj.logo ? `${AWS_IMAGE_URL}/logos/` + this.profileObj.logo : '';
	},
	methods: {
		async addLogo(e) {
			const formats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg', 'image/svg+xml'];
			const file = e.target.files[0];
			if (!formats.includes(file.type)) {
				this.$toast.error('Ошибка! Файл не похож на картинку!');
				return;
			}
			try {
				this.isLoading = true;
				const res = await ImageService.generateSaveUrl({folder: 'logos', fileType: file.type.slice(6)});
				await ImageService.saveImage(res.data.url, file);
				this.profileObj.logo = res.data.fileName;
				this.previewUrl = URL.createObjectURL(file);
				this.isLoading = false;
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		async submitUpdate() {
			if (this.$refs.profileForm.validate()) {
				if (!this.previewUrl) {
					this.$toast.info('Загрузите логотип!');
					return;
				}
				this.isLoading = true;
				const formData = new FormData();
				Object.entries(this.profileObj).forEach((item) => formData.append(item[0], item[1]));
				this.$store.dispatch('account/companyUpdate', formData);
			}
		}
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

<style lang="scss" scoped>
.company-profile {
	.form-field {
		&.image {
			.preview {
				display: flex;
				align-items: center;
			}
			.image {
				width: 90px;
				height: 90px;
				margin: 0 10px 10px;
				border-radius: 4px;
				border: 1px solid $gray-light;
				position: relative;
				.delete-img {
					position: absolute;
					top: 0;
					width: 100%;
					height: 100%;
					background: #000000d4;
					color: $red-primary;
					font-weight: bold;
					letter-spacing: 1px;
					display: none;
					align-items: center;
					justify-content: center;
				}
				img {
					width: 100%;
					height: 100%;
					object-fit: cover;
					border-radius: 4px;
				}
				&:hover {
					.delete-img {
						display: flex;
						cursor: pointer;
					}
				}
			}
			span.download {
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
	}
	.btn-actions {
		max-width: 300px;
	}
}
</style>