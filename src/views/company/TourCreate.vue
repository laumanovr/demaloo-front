<template>
    <div class="tour-create-container">
        <PreLoader v-if="isLoading"/>
        <div class="header-create">
            <div class="head-title">
                <img src="../../assets/icons/left-arrow.svg" @click="$router.go(-1)"/>Создайте тур
            </div>
            <div class="create-step">
                <template v-if="formStep == 'first'">
                    <img src="../../assets/icons/icon-process.svg"/>
                    <span class="label">Заполните основную информацию</span>
                </template>
                <template v-if="formStep == 'last'">
                    <img src="../../assets/icons/icon-process2.svg"/>
                    <span class="label">
                        Вы почти у цели. Заполните что входит в тур и загрузите фотографии вашего тура
                    </span>
                </template>
            </div>
        </div>

        <v-form ref="tourForm">
            <template v-if="formStep == 'first'">
                <div class="form-field">
                    <span class="label">Название тура:</span>
                    <v-text-field v-model="tourObj.name.ru" :rules="requiredRule" solo/>
                </div>
                <div class="form-field">
                    <span class="label">Описание:</span>
                    <v-textarea
                        v-model="tourObj.description.ru"
                        :rules="requiredRule"
                        solo
                    />
                </div>
                <div class="form-field">
                    <span class="label">Цена:</span>
                    <v-text-field
                        v-model.number="tourObj.price"
                        :rules="numberRule"
                        placeholder="Сом / за человека"
                        solo
                        type="number"
                    />
                </div>
                <div class="form-field">
                    <span class="label">Длительность:</span>
                    <v-text-field
                        v-model.number="tourObj.duration"
                        :rules="numberRule"
                        placeholder="кол-во дней"
                        solo
                        type="number"
                    />
                </div>
                <div class="form-field">
                    <span class="label">Транспорт:</span>
                    <v-text-field
                        v-model="tourObj.transport.ru"
                        :rules="requiredRule"
                        solo
                    />
                </div>
                <div class="form-field">
                    <span class="label">Гид:</span>
                    <v-select
                        :items="teamGuides"
                        item-text="fullName"
                        item-value="fullName"
                        v-model="tourObj.guides"
                        solo
                    />
                </div>
                <div class="form-field">
                    <span class="label">Водитель:</span>
                    <v-select
                        :items="teamDrivers"
                        item-text="fullName"
                        item-value="fullName"
                        v-model="tourObj.drivers"
                        solo
                    />
                </div>
                <div class="form-field">
                    <span class="label">Максимальное кол-во людей:</span>
                    <v-text-field
                        v-model.number="tourObj.peopleCount"
                        :rules="numberRule"
                        solo
                        type="number"
                    />
                </div>
                <div class="form-field">
                    <span class="label">Категории:</span>
                    <v-select
                        :items="tourCategories"
                        v-model="tourObj.categories"
                        item-text="title"
                        item-value="name"
                        :rules="multipleRule"
                        solo
                        multiple
                    />
                </div>

                <div class="form-field">
                    <span class="label">Дистанция тура:</span>
                    <v-text-field
                        v-model.number="tourObj.distance"
                        :rules="numberRule"
                        placeholder="км"
                        solo
                        type="number"
                    />
                </div>
                <div class="form-field">
                    <span class="label">Точка сбора:</span>
                    <v-text-field
                        v-model="tourObj.meetingPoint.ru"
                        :rules="requiredRule"
                        solo
                    />
                </div>

                <div class="form-field location">
                    <span class="label">Локация тура:</span>
                    <v-select
                        label="Область"
                        :items="allRegions"
                        item-text="ru"
                        v-model="selectRegion"
                        return-object
                        :rules="requiredRule"
                        @change="findRegionRayons"
                        solo
                    />
                    <v-select
                        label="Район"
                        :items="rayons"
                        item-text="ru"
                        v-model="selectedRayon"
                        return-object
                        @change="selectRayon"
                        :rules="requiredRule"
                        solo
                    />
                    <template v-if="!isAddTourPlace && rayons.length">
                        <v-autocomplete
                            label="Место"
                            :items="selectedRayon.places"
                            v-model="tourObj.locations[0].place"
                            :rules="requiredRule"
                            solo
                        />
                        <PlusIcon @click="addNewTourPlace" :iconTitle="'Добавить новое место'"/>
                    </template>
                    <template v-if="isAddTourPlace">
                        <v-text-field
                            label="Добавьте новое место"
                            :rules="requiredRule"
                            v-model="tourObj.locations[0].place"
                            solo
                        />
                    </template>
                </div>

                <div class="form-field time-picker">
                    <span class="label">Время сбора:</span>
                    <vue-timepicker v-model="tourObj.meetingTime" close-on-complete/>
                </div>
                <div class="form-field">
                    <span class="label">Дата</span>
                    <div class="date-picker">
                        <v-menu
                            v-model="showDatePicker"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="290px"
                        >
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    label="ДД.ММ.ГГГГ"
                                    placeholder="ДД.ММ.ГГГГ"
                                    readonly
                                    solo
                                    v-bind="attrs"
                                    v-on="on"
                                    v-model="pickerDate"
                                    :rules="requiredRule"
                                />
                            </template>
                            <v-date-picker
                                locale="ru-RU"
                                v-model="tourObj.dates"
                                :min="todayDate"
                                @input="onChangeDate"
                            />
                        </v-menu>
                    </div>
                </div>
                <div class="btn-actions">
                    <button
                        class="btn red-primary"
                        type="button"
                        @click.prevent="$router.push('/company-manage')"
                    >
                        Отменить
                    </button>
                    <button class="btn blue-primary" @click.prevent="nextFormStep">
                        Далее
                    </button>
                </div>
            </template>
            <template v-if="formStep == 'last'">
                <div class="form-field">
                    <span class="label">Что включено:</span>
                    <div class="tour-items">
                        <div class="tour-field" v-for="(item, i) in tourObj.includedInCost" :key="i">
                            <v-text-field
                                class="auto"
                                v-model="item.ru"
                                solo
                                placeholder="Что включено..."
                                :rules="requiredRule"
                            />
                            <CloseIcon
                                @click="removeTourArrayItem(i, 'includedInCost')"
                                v-if="tourObj.includedInCost.length > 1"
                            />
                        </div>
                        <button class="btn white" @click.prevent="addIncludeItem">
                            + Добавить
                        </button>
                    </div>
                </div>
                <div class="form-field">
                    <span class="label">Что взять с собой:</span>
                    <div class="tour-items">
                        <div class="tour-field" v-for="(item, i) in tourObj.notIncludedInCost" :key="i">
                            <v-text-field
                                class="auto"
                                v-model="item.ru"
                                solo
                                placeholder="Что взять с собой..."
                                :rules="requiredRule"
                            />
                            <CloseIcon
                                @click="removeTourArrayItem(i, 'notIncludedInCost')"
                                v-if="tourObj.notIncludedInCost.length > 1"
                            />
                        </div>
                        <button class="btn white" @click.prevent="addExcludeItem">
                            + Добавить
                        </button>
                    </div>
                </div>
                <div class="form-field">
                    <span class="label">Дополнительно:</span>
                    <div class="tour-items">
                        <div class="tour-field" v-for="(item, i) in tourObj.additional" :key="i">
                            <v-text-field
                                class="auto"
                                v-model="item.ru"
                                solo
                                placeholder="Дополнительно..."
                            />
                            <CloseIcon
                                @click="removeTourArrayItem(i, 'additional')"
                                v-if="tourObj.additional.length > 1"
                            />
                        </div>
                        <button class="btn white" @click.prevent="addAdditionalItem">
                            + Добавить
                        </button>
                    </div>
                </div>
                <div class="form-field image">
                    <span class="label">Изображения:</span>
                    <div class="previews">
                        <div class="image" v-for="(image, i) in previewImages" :key="i">
                            <img :src="image"/>
                            <span class="delete-img" @click="removeTourArrayItem(i, 'images')">УДАЛИТЬ</span>
                        </div>
                        <label for="image" class="file">
                            <span class="download">Загрузить</span>
                            <input type="file" id="image" @change="addImage"/>
                        </label>
                    </div>
                </div>
                <div class="btn-actions">
                    <button class="btn red-primary" @click.prevent="formStep = 'first'">
                        Назад
                    </button>
                    <button class="btn green-primary" @click.prevent="submitCreateTour">
                        Сохранить
                    </button>
                </div>
            </template>
        </v-form>
    </div>
</template>

<script>
import VueTimepicker from 'vue2-timepicker';
import moment from 'moment';
import {TourService} from '@/services/tour.service';
import {LocationService} from '@/services/location.service';
import PlusIcon from '@/components/icons/PlusIcon';
import CloseIcon from '@/components/icons/CloseIcon';
import PreLoader from '@/components/general/PreLoader';
import {API_BASE_URL} from '@/services/api.service';

export default {
	components: {
		VueTimepicker,
		PlusIcon,
		CloseIcon,
		PreLoader
	},
	data() {
		return {
			isLoading: false,
			apiImageUrl: `${API_BASE_URL}/images/`,
			requiredRule: [(v) => !!v || 'Обязательное поле'],
			multipleRule: [(v) => v.length > 0 || 'Обязательное поле'],
			numberRule: [
				(v) => !!v || 'Обязательное поле',
				(v) => (v && v > 0 && v <= 50000) || 'Неправильное значение'
			],
			tourObj: {
				name: {ru: ''},
				description: {ru: ''},
				meetingPoint: {ru: ''},
				meetingTime: '',
				locations: [
					{
						oblast: {id: 0, ru: ''},
						region: {id: 0, ru: ''},
						place: '',
					},
				],
				transport: {ru: ''},
				categories: [],
				duration: '',
				price: '',
				peopleCount: '',
				dates: '',
				includedInCost: [{ru: ''}],
				notIncludedInCost: [{ru: ''}],
				additional: [{ru: ''}],
				distance: '',
			},
			tourCategories: [
				{title: 'Озера и реки', name: 'lakes'},
				{title: 'Горы', name: 'mountains'},
			],
			showDatePicker: false,
			formStep: 'first',
			pickerDate: '',
			todayDate: moment().format('YYYY-MM-DD'),
			selectRegion: {},
			selectedRayon: {},
			rayons: [],
			selectedImages: [],
			previewImages: [],
			isAddTourPlace: false,
		};
	},
	created() {
		if (this.$route.params.tourId) {
			this.createTourWithSameData(this.$route.params.tourId);
		}
	},
	computed: {
		allRegions() {
			return this.$store.state.location.regions;
		},
		teamDrivers() {
			return this.$store.state.team.drivers.map((i) => ({...i, fullName: `${i.surname} ${i.name}`}));
		},
		teamGuides() {
			return this.$store.state.team.guides.map((i) => ({...i, fullName: `${i.surname} ${i.name}`}));
		},
	},
	methods: {
		async createTourWithSameData(tourId) {
			try {
				this.isLoading = true;
				const res = await TourService.fetchTourById(tourId);
				this.tourObj = res.data.tour;
				this.selectRegion = this.allRegions.find((i) => i.id === this.tourObj.locations[0].oblast.id);
				this.rayons = this.selectRegion.regions;
				this.selectedRayon = this.rayons.find((i) => i.id === this.tourObj.locations[0].region.id);
				this.tourObj.images.forEach((img) => {
					this.previewImages.push(this.apiImageUrl + img);
					this.selectedImages.push(img);
				});
				this.isLoading = false;
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		nextFormStep() {
			if (this.$refs.tourForm.validate()) {
				this.formStep = 'last';
			}
		},

		onChangeDate() {
			this.pickerDate = moment(this.tourObj.dates, 'YYYY-MM-DD').format('DD.MM.YYYY');
			this.showDatePicker = false;
		},

		addIncludeItem() {
			const item = {ru: ''};
			this.tourObj.includedInCost.push(item);
		},

		addExcludeItem() {
			const item = {ru: ''};
			this.tourObj.notIncludedInCost.push(item);
		},

		addAdditionalItem() {
			const item = {ru: ''};
			this.tourObj.additional.push(item);
		},

		removeTourArrayItem(index, field) {
			if (field === 'images') {
				this.previewImages.splice(index, 1);
				this.selectedImages.splice(index, 1);
				return;
			}
			this.tourObj[field].splice(index, 1);
		},

		findRegionRayons(region) {
			this.tourObj.locations[0].oblast.id = region.id;
			this.tourObj.locations[0].oblast.ru = region.ru;
			this.rayons = region.regions;
		},

		selectRayon(rayon) {
			this.tourObj.locations[0].region.id = rayon.id;
			this.tourObj.locations[0].region.ru = rayon.ru;
			this.isAddTourPlace = !rayon.places.length;
			this.tourObj.locations[0].place = '';
		},

		addNewTourPlace() {
			this.isAddTourPlace = true;
			this.tourObj.locations[0].place = '';
		},

		addImage(e) {
			const formats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg', 'image/svg+xml'];
			const file = e.target.files[0];
			if (!formats.includes(file.type)) {
				this.$toast.error('Ошибка! Файл не похож на картинку!');
				return;
			}
			this.selectedImages.push(file);
			const imgUrl = URL.createObjectURL(file);
			this.previewImages.push(imgUrl);
		},

		async submitCreateTour() {
			if (this.$refs.tourForm.validate()) {
				if (!this.selectedImages.length) {
					this.$toast.info('Загрузите фотографии тура!');
					return;
				}
				this.isLoading = true;
				this.tourObj.dates = this.tourObj.dates.split();
				try {
					const res = await TourService.createTour(this.tourObj);
					await this.sendTourImages(res.data.tours[0]._id);
					await this.createNewPlaces();
					this.$toast.success('Тур успешно создан!');
				} catch (err) {
					this.$toast.error(err);
					this.isLoading = false;
				}
			}
		},

		async sendTourImages(tourId) {
			if (this.selectedImages.length) {
				const formData = new FormData();
				this.selectedImages.forEach((image) => formData.append('images', image));
				try {
					await TourService.addImagesForTour(tourId, formData);
					this.$router.push('/company-manage');
				} catch (err) {
					this.$toast.error(err);
				}
			}
		},

		async createNewPlaces() {
			if (this.isAddTourPlace) {
				const regionId = this.tourObj.locations[0].oblast.id;
				const rayonId = this.tourObj.locations[0].region.id;
				const newPlace = {place: this.tourObj.locations[0].place};
				try {
					await LocationService.addNewPlace(newPlace, regionId, rayonId);
					this.$store.dispatch('location/fetchRegions', {}, {root: true});
				} catch (err) {
					this.$toast.error(`new-place-${err}`);
				}
			}
		},
	},
};
</script>

<style lang="scss">
    .tour-create-container {
        .header-create {
            border-bottom: 1px solid $gray-light;
            padding-bottom: 5px;
            margin-bottom: 30px;
            .head-title {
                display: flex;
                align-items: center;
                margin-bottom: 20px;
                img {
                    margin-right: 25px;
                }
            }
            .create-step {
                display: flex;
                align-items: center;
                img {
                    margin: 0 10px 0 30px;
                }
                span {
                    font-size: 14px;
                    font-weight: 500;
                }
            }
        }
        .btn-actions {
            max-width: 450px;
        }
        .time-picker {
            margin-bottom: 14px;
        }
        .tour-items {
            min-width: 530px;
            .tour-field {
                display: flex;
                .close-icon {
                    margin: 10px 0 0 10px;
                }
            }
            .btn {
                height: 45px;
                margin-bottom: 30px;
                max-width: 494px;
            }
        }
        .form-field {
            &.location {
                .v-select {
                    margin-right: 10px !important;
                    max-width: 290px;
                }
                .plus-icon {
                    margin-top: 10px;
                }
            }
            &.image {
                .previews {
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                    max-width: 700px;
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
        .vue__time-picker {
            input {
                height: 48px;
                background: #fff;
                border: 0;
                box-shadow: 0 4px 4px rgba(51, 51, 51, 0.04),
                0 4px 16px rgba(51, 51, 51, 0.08);
            }
        }
    }
</style>
