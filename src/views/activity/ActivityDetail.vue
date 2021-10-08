<template>
    <div class="activity-container">
        <div class="activity-detail__container">
            <PreLoader v-if="isLoading"/>
            <div class="tour-content">
                <div class="activity-detail__left">
                    <div class="activity-detail__image">
                        <carousel
                            :perPage="1"
                            :navigationEnabled="true"
                            :paginationEnabled="false"
                            @page-change="changeImage"
                        >
                            <slide v-for="imageUrl in slideImages" :key="imageUrl">
                                <img class="main-img" :src="imageUrl" @click="openFullSizeModal">
                            </slide>
                        </carousel>
                        <div class="arrows">
                            <img src="./../../assets/icons/circle-arrow-left.svg">
                            <img src="./../../assets/icons/circle-arrow-right.svg">
                        </div>
                        <div class="image-count" v-if="activityDetail.images">
                            {{imgIndex}}/{{activityDetail.images.length}}
                        </div>
                    </div>
                    <div class="activity-detail__info">
                        <div class="top-title flex align-center justify-space-between">
                            <span class="activity-detail__name">{{activityDetail.title}}</span>
                        </div>
                        <span class="activity-detail__company-info link flex align-center">
                                <img :src="activityDetail.logo.url" class="company">
                                {{activityDetail.company}}
                        </span>
                        <div class="activity-detail__description">
                            {{activityDetail.description}}
                        </div>
                        <!--Mobile-->
                        <div class="mob detail">
                            <div class="short-info">
                                <div class="item flex align-center">
                                    <img src="./../../assets/icons/calendar-blue.svg">
                                    <span>Рабочие дни:</span>
                                </div>
                                <div class="value">{{activityDetail.days}}</div>
                            </div>
                            <div class="short-info">
                                <div class="item flex align-center">
                                    <img src="./../../assets/icons/timer-icon.svg">
                                    <span>График работы:</span>
                                </div>
                                <div class="value">{{activityDetail.hours}}</div>
                            </div>
                            <div class="short-info">
                                <div class="item flex align-center">
                                    <img src="./../../assets/icons/marker-dark.png">
                                    <span>Адрес:</span>
                                </div>
                                <div class="value">{{activityDetail.location}}</div>
                            </div>
                        </div>
                        <!--Mobile end-->
                        <div class="activity-detail__additional-block flex">
                            <div class="includes">
                                <div class="data-block">
                                    <div class="block-title flex">
                                        <img src="./../../assets/icons/include-icon.svg">
                                        <span>{{$t('tourBooking.includes')}}</span>
                                    </div>
                                    <div class="block-item" v-for="(item, i) in activityDetail.included_items" :key="i">
                                        <span class="dot"></span>
                                        <span class="item-title">{{item.included_item}}</span>
                                    </div>
                                </div>
                                <div class="data-block additional">
                                    <div class="block-title flex">
                                        <img src="./../../assets/icons/additional-icon.svg">
                                        <span>{{$t('tourBooking.additional')}}</span>
                                    </div>
                                    <div class="block-item" v-for="(item, i) in activityDetail.additional_items"
                                         :key="i">
                                        <span class="dot"></span>
                                        <span class="item-title">{{item.additional_item}}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="not-include">
                                <div class="data-block">
                                    <div class="block-title flex">
                                        <img src="./../../assets/icons/not-include-icon.svg">
                                        <span>{{$t('tourBooking.notIncludes')}}</span>
                                    </div>
                                    <div class="block-item" v-for="(item, i) in activityDetail.necessary_items"
                                         :key="i">
                                        <span class="dot"></span>
                                        <span class="item-title">{{item.necessary_item}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="activity-detail__right">
                    <div class="reserve-block">
                        <div class="head-block flex align-center justify-space-between">
                            <div class="price">{{activityDetail.price}} {{$t('tourBooking.som')}}</div>
                        </div>
                        <div class="short-info web">
                            <div class="item flex align-center">
                                <img src="./../../assets/icons/duration-icon.svg">
                                <span>Рабочие дни:</span>
                            </div>
                            <div class="value">{{activityDetail.days}}</div>
                        </div>
                        <div class="short-info web">
                            <div class="item flex align-center">
                                <img src="./../../assets/icons/timer-icon.svg">
                                <span>График работы:</span>
                            </div>
                            <div class="value">{{activityDetail.hours}}</div>
                        </div>
                        <div class="short-info web">
                            <div class="item flex align-center">
                                <img src="./../../assets/icons/marker-dark.png">
                                <span>Адрес:</span>
                            </div>
                            <div class="value">{{activityDetail.location}}</div>
                        </div>
                        <div class="total flex align-center justify-space-between web">
                            <span>{{$t('tourBooking.total')}}:</span>
                            <span>{{activityDetail.price}} {{$t('tourBooking.som')}}</span>
                        </div>
                        <button class="btn green-main" @click="toggleContactReserveModal">
                            Забронировать
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!--RESERVE MODAL-->
        <modal
            name="reserve-contact-modal"
            class="reserve-contact-modal"
            :class="{'complete': reserveMode === 'complete'}"
            :width="isMobileWindow ? '100%' : '390px'"
            height="97%"
        >
            <div class="modal-container">
                <template v-if="reserveMode === 'initial'">
                    <div class="reserve__title flex align-center justify-end">
                        <span>{{$t('tourBooking.bookDetail')}}</span>
                        <img src="./../../assets/icons/close.svg" @click="toggleContactReserveModal">
                    </div>
                    <div class="reserve__tour-title">{{activityDetail.title}}</div>
                    <div class="reserve__company-date flex align-center justify-space-between">
                        <div class="activity-detail__company-info flex align-center">
                            <img :src="activityDetail.logo.url" class="company">
                            {{activityDetail.company}}
                        </div>
                    </div>
                    <div class="short-info">
                        <div class="item flex align-center">
                            <img src="./../../assets/icons/duration-icon.svg">
                            <span>Рабочие дни:</span>
                        </div>
                        <div class="value">{{activityDetail.days}}</div>
                    </div>
                    <div class="short-info">
                        <div class="item flex align-center">
                            <img src="./../../assets/icons/timer-icon.svg">
                            <span>График работы:</span>
                        </div>
                        <div class="value">{{activityDetail.hours}}</div>
                    </div>
                    <div class="short-info">
                        <div class="item flex align-center">
                            <img src="./../../assets/icons/marker-dark.png">
                            <span>Адрес:</span>
                        </div>
                        <div class="value">{{activityDetail.location}}</div>
                    </div>
                    <v-form ref="reserveContactForm" class="contact-form">
                        <v-text-field label="Имя" outlined :rules="requiredRule" v-model="reserveClient.name"/>
                        <v-text-field label="Фамилия" outlined :rules="requiredRule" v-model="reserveClient.surname"/>
                        <v-text-field label="Ваш телефон" outlined :rules="requiredRule" v-model="reserveClient.phone" type="number"/>
                        <v-text-field label="Количество человек" outlined :rules="requiredRule" v-model="reserveClient.personCount" type="number"/>
                        <div class="btn-actions">
                            <button class="btn green-main" @click.prevent="submitReserve">Подтвердить</button>
                        </div>
                    </v-form>
                </template>
                <template v-if="reserveMode === 'complete'">
                    <div class="warn-img"><img src="./../../assets/icons/checked-icon.svg"></div>
                    <div class="warn-title">
                        Бронь успешно произведена. <br> В скором времени с вами свяжутся!
                    </div>
                    <div class="single-center complete">
                        <button class="btn green-main" @click="toggleContactReserveModal">{{$t('button.ready')}}
                        </button>
                    </div>
                </template>
            </div>
        </modal>

        <!--FOR MOBILE FULL SIZE VIEW IMAGES-->
        <FullSizeSliderModal
            :imgIndex="imgIndex"
            :slideImages="slideImages"
            :tourImagesCount="activityDetail.images && activityDetail.images.length"
        />
    </div>
</template>

<script>
import FullSizeSliderModal from '@/components/client/FullSizeSliderModal';
import {Carousel, Slide} from 'vue-carousel';
import {ActivityService} from '../../services/activity.service';
import axios from 'axios';

export default {
	components: {
		Carousel,
		Slide,
		FullSizeSliderModal
	},
	data() {
		return {
			requiredRule: [(v) => !!v || this.$t('requiredField')],
			activityDetail: {logo: {}},
			isLoading: false,
			imgIndex: 1,
			slideImages: [],
			reserveMode: 'initial',
			reserveClient: {
				name: '',
				surname: '',
				phone: '',
				personCount: 1
			}
		};
	},
	computed: {
		userProfile() {
			return this.$store.state.account.customer;
		},
		isMobileWindow() {
			return window.innerWidth < 1024;
		},
		userLogged() {
			return Object.values(this.userProfile).length > 0;
		}
	},
	created() {
		this.isLoading = true;
		this.getSelectedActivity(this.$route.params.id);
	},
	methods: {
		async getSelectedActivity(id) {
			try {
				this.activityDetail = await ActivityService.fetchById(id);
				this.activityDetail.images.forEach((item) => {
					this.slideImages.push(item.image.url);
				});
				this.isLoading = false;
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		changeImage(slidePage) {
			this.imgIndex = slidePage + 1;
		},

		openFullSizeModal() {
			if (this.isMobileWindow) {
				this.$modal.show('big-slider-modal');
			}
		},

		toggleContactReserveModal() {
			this.$modal.toggle('reserve-contact-modal');
			if (this.userLogged && this.reserveMode === 'initial') {
				this.reserveClient.name = this.userProfile.name;
				this.reserveClient.surname = this.userProfile.surname;
				this.reserveClient.phone = this.userProfile.phoneNumber.replace('+', '');
			}
		},

		async submitReserve() {
			if (this.$refs.reserveContactForm.validate()) {
				const token = 'bot2086720150:AAF5lzUgZR4nCPhhz714qSnQKjUIVba-3cQ';
				const chatId = '-515975513';
				const clientFio = `ФИО: ${this.reserveClient.name} ${this.reserveClient.surname}\n`;
				const clientPhone = `Телефон: ${this.reserveClient.phone}\n`;
				const title = `Развлечение: ${this.activityDetail.title}\n`;
				const personCount = `Кол-во людей: ${this.reserveClient.personCount}\n`;
				const time = `Время брони: ${new Date().toLocaleString('ru')}`;
				const fullData = encodeURIComponent(clientFio + clientPhone + title + personCount + time);
				try {
					this.isLoading = true;
					await axios.post(`https://api.telegram.org/${token}/sendMessage?chat_id=${chatId}&text=${fullData}`);
					this.reserveMode = 'complete';
					this.isLoading = false;
				} catch (e) {
					this.$toast.error(e);
					this.isLoading = false;
				}
			}
		}
	}
};
</script>

<style lang="scss">
    .activity-container {
        background: #f5f5f5;

        .activity-detail {
            &__container {
                padding: 25px 0 20px;
                max-width: 1200px;
                margin: 0 auto;
                @media #{$mob-view} {
                    padding: 16px 0 20px;
                    background: #fff;
                    box-shadow: 0 -5px 8px 2px rgb(0 0 0 / 5%);
                }

                .tour-content {
                    display: flex;
                    justify-content: space-between;
                    @media #{$mob-view} {
                        display: block;
                    }
                }

                .single-center {
                    &.complete {
                        justify-content: center;
                    }

                    .btn {
                        max-width: 165px;
                        height: 40px;

                        &:first-child {
                            margin-right: 20px;
                        }
                    }
                }

                .warn-img {
                    width: 60px;
                    height: 60px;
                    margin: 0 auto;

                    img {
                        width: 100%;
                        height: 100%;
                    }
                }

                .warn-title {
                    color: #1E2432;
                    font-size: 14px;
                    text-align: center;
                    margin: 25px 0;
                }

                .other-tours {
                    background: #fff;
                    margin-top: 25px;
                    border-radius: 7px;

                    .current-company-name {
                        margin: 0 0 20px 26px;
                        padding-top: 18px;
                        font-family: $montserrat;

                        span {
                            font-weight: bold;
                            font-size: 18px;
                            color: $blue-darkest;
                            margin-right: 10px;
                        }

                        a {
                            font-weight: 500;
                            font-size: 18px;
                            color: $green-main;
                            text-decoration: underline;
                            cursor: pointer;
                        }
                    }

                    .tour-items {
                        display: flex;
                        flex-wrap: wrap;
                        padding: 0 25px;

                        .tour-item {
                            color: $blue-darkest;
                            max-width: 260px;
                            margin-bottom: 25px;
                            border-radius: 7px;
                            cursor: pointer;

                            &:not(:last-child) {
                                margin-right: 25px;
                            }

                            .tour-img {
                                width: 260px;
                                height: 155px;

                                img {
                                    width: 100%;
                                    height: 100%;
                                    object-fit: cover;
                                    border-radius: 7px;
                                }
                            }

                            .tour-name {
                                font-family: $montserrat;
                                font-weight: bold;
                                font-size: 16px;
                                margin-top: 5px;
                                white-space: nowrap;
                                overflow-x: hidden;
                                text-overflow: ellipsis;
                            }

                            .tour-desc {
                                font-size: 12px;
                                height: 36px;
                                overflow-y: hidden;
                            }

                            .date-price {
                                padding: 5px 0;

                                .date {
                                    font-weight: 600;
                                    font-size: 16px;
                                }

                                .price {
                                    font-family: $montserrat;
                                    font-weight: bold;
                                    font-size: 18px;
                                }
                            }
                        }
                    }
                }
            }

            &__left {
                width: 67%;
                @media #{$mob-view} {
                    width: auto;
                }
            }

            &__image {
                width: 100%;
                height: 455px;
                margin-bottom: 25px;
                position: relative;
                border: 1px solid $gray-light;
                border-radius: 7px;
                @media #{$mob-view} {
                    height: auto;
                    padding: 0 20px;
                    border: 0;
                }

                img.main-img {
                    min-width: 100%;
                    height: 453px;
                    border-radius: 6px;
                    object-fit: contain;
                    @media #{$mob-view} {
                        height: 220px;
                        object-fit: cover;
                    }
                }

                .arrows {
                    position: absolute;
                    top: 50%;
                    left: 0;
                    transform: translateY(-50%);
                    display: flex;
                    width: 100%;
                    justify-content: space-between;
                    padding: 0 15px;

                    img {
                        cursor: pointer;
                    }

                    @media #{$mob-view} {
                        display: none;
                        padding: 0 25px;
                    }
                }

                .image-count {
                    position: absolute;
                    left: 50%;
                    bottom: 15px;
                    color: #fff;
                    font-size: 14px;
                    background: rgba(0, 0, 0, 0.5);
                    border-radius: 5px;
                    padding: 3px 14px;
                    @media #{$mob-view} {
                        bottom: 5px;
                        left: 48%;
                    }
                }
            }

            &__info {
                background: #fff;
                padding: 25px;
                border-radius: 7px;
            }

            &__name {
                font-family: $montserrat;
                font-weight: bold;
                font-size: 20px;
                color: #00113C;
            }

            &__favorite {
                font-weight: 600;
                font-size: 14px;
                color: $blue-darkest;
                cursor: pointer;

                svg {
                    margin-right: 4px;
                    width: 18px;
                    height: 18px;

                    &.saved {
                        path {
                            fill: $red-primary;
                        }
                    }
                }
            }

            &__company-info {
                font-weight: 600;
                font-size: 14px;
                color: $blue-darkest !important;
                margin: 10px 0;

                .company-name {
                    max-width: 65%;
                    white-space: nowrap;
                    overflow-x: hidden;
                    text-overflow: ellipsis;
                }

                img.company {
                    width: 24px;
                    height: 24px;
                    margin-right: 7px;
                    object-fit: cover;
                    border-radius: 4px;
                }

                .rating {
                    font-weight: normal;
                    margin-left: 10px;

                    span {
                        margin-left: 3px;
                    }
                }
            }

            &__description {
                padding-bottom: 20px;
                border-bottom: 2px solid $gray-light;
                font-size: 14px;
                color: #153243;
                margin-bottom: 25px;
                white-space: pre-line;
            }

            &__additional-block {
                color: $blue-darkest;
                border-bottom: 1px solid $gray-light;
                padding-bottom: 25px;
                @media #{$mob-view} {
                    flex-wrap: wrap;
                }

                .additional {
                    margin-top: 50px;
                    @media #{$mob-view} {
                        margin: 25px 0;
                    }
                }

                .includes {
                    width: 50%;
                    @media #{$mob-view} {
                        width: 100%;
                    }
                }

                .not-include {
                    width: 50%;
                    @media #{$mob-view} {
                        width: 100%;
                    }
                }

                .block-title {
                    span {
                        font-family: $montserrat;
                        font-weight: bold;
                        font-size: 18px;
                        color: #153243;
                        margin-left: 20px;
                    }
                }

                .block-item {
                    font-size: 14px;
                    color: $blue-darkest;
                    display: flex;
                    align-items: center;
                    margin-top: 20px;

                    .dot {
                        display: block;
                        min-width: 4px;
                        height: 4px;
                        border-radius: 4px;
                        background: $blue-darkest;
                        margin-right: 8px;
                    }

                }
            }

            &__transport-block {
                padding-top: 25px;

                .label {
                    font-weight: 600;
                    font-size: 18px;
                    color: $blue-darkest;
                    @media #{$mob-view} {
                        min-width: 50%;
                        font-size: 16px;
                    }

                    img {
                        margin-right: 8px;
                    }
                }

                .distance {
                    margin: 25px 0 45px;
                }

                .kilometer {
                    border-bottom: 1px solid $gray-light;
                    padding-bottom: 12px;

                    .avto-foot {
                        span {
                            &:first-child {
                                width: 40%;
                                text-align: center;
                            }

                            &:last-child {
                                width: 30%;
                                text-align: center;
                            }

                            @media #{$mob-view} {
                                font-size: 14px;
                            }
                        }
                    }
                }

                span {
                    font-size: 18px;
                    color: $blue-darkest;
                    margin-left: 12px;
                }
            }

            &__program-block {
                padding-top: 30px;

                .program-title {
                    margin-bottom: 30px;

                    span {
                        margin-left: 12px;
                        font-weight: 600;
                        font-size: 18px;
                        color: $blue-darkest;
                    }
                }

                .program-item {
                    margin-bottom: 16px;

                    .day {
                        span {
                            color: $green-main;
                            font-weight: 600;
                            font-size: 14px;
                            margin-left: 7px;
                        }
                    }

                    .text {
                        font-weight: 300;
                        font-size: 14px;
                        color: #153243;
                        margin-top: 11px;
                        white-space: pre-line;
                    }
                }
            }

            &__right {
                position: relative;
                width: calc(33% - 25px);
                @media #{$mob-view} {
                    width: auto;
                }

                .reserve-block {
                    position: sticky;
                    top: 25px;
                    background: #fff;
                    padding: 22px 23px 25px;
                    color: $blue-darkest;
                    border-radius: 7px;
                    @media #{$mob-view} {
                        display: flex;
                        border-top: 1px solid $gray-light;
                        border-bottom: 1px solid $gray-light;
                        padding: 12px 15px;
                        position: fixed;
                        top: auto;
                        bottom: 0;
                        width: 100%;
                        align-items: center;
                        border-radius: 0;
                    }

                    .price {
                        font-weight: bold;
                        font-size: 24px;
                    }

                    .head-block {
                        border-bottom: 1px solid $gray-light;
                        padding-bottom: 14px;
                        margin-bottom: 18px;
                        @media #{$mob-view} {
                            display: block;
                            width: 50%;
                            margin: 0;
                            padding: 0;
                            border: 0;
                        }
                    }

                    .date-place {
                        .date {
                            display: flex;
                            font-weight: 600;
                            font-size: 16px;
                            text-align: right;
                            text-transform: capitalize;
                        }

                        .place {
                            font-size: 14px;
                            color: $red-primary;
                        }
                    }

                    .total {
                        font-weight: bold;
                        font-size: 18px;
                        border-top: 1px solid $gray-light;
                        margin-bottom: 20px;
                        padding-top: 13px;

                        span {
                            font-family: $montserrat;
                        }
                    }

                    .btn {
                        height: 53px;

                        a {
                            color: #fff;
                            font-weight: bold;
                        }

                        @media #{$mob-view} {
                            width: 50%;
                            height: 50px;
                        }
                    }
                }
            }
        }

        .reserve-contact-modal {
            &.complete {
                .vm--modal {
                    height: auto !important;
                }
            }
            .vm--modal {
                max-height: 700px;

                .modal-container {
                    color: $blue-darkest;

                    .reserve {
                        &__title {
                            font-weight: 600;
                            font-size: 18px;
                            margin-bottom: 20px;

                            span {
                                width: 60%;
                            }

                            img {
                                width: 24px;
                                height: 24px;
                                cursor: pointer;
                            }
                        }

                        &__tour-title {
                            font-weight: bold;
                            font-size: 18px;
                        }

                        &__company-date {
                            .date {
                                font-weight: 600;
                                font-size: 14px;
                                margin-left: 15px;
                            }
                        }
                    }
                }
            }

            .contact-form {
                border-top: 1px solid $gray-dark;
                padding-top: 15px;

                .v-text-field {
                    max-height: 78px;
                }

                .btn-actions {
                    margin: 0;

                    .btn {
                        margin: 0;
                    }
                }
            }

            .single-center {
                &.complete {
                    justify-content: center;
                }
            }

            .warn-img {
                width: 60px;
                height: 60px;
                margin: 0 auto;

                img {
                    width: 100%;
                    height: 100%;
                }
            }

            .warn-title {
                color: #1E2432;
                font-size: 14px;
                text-align: center;
                margin: 25px 0;
            }
        }

        .disabled {
            opacity: 0.5;
        }

        .mob.detail {
            color: $blue-darkest;
            border-bottom: 1px solid $gray-light;
            margin-bottom: 15px;

            .short-info .value {
                display: flex;
                text-transform: capitalize;

                span {
                    margin: 0;
                }
            }
        }

        .short-info {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            margin-bottom: 22px;

            &.comment {
                margin-bottom: 0;
            }

            .item {
                img {
                    width: 16px;
                    height: 19px;
                }

                span {
                    font-weight: 600;
                    margin-left: 16px;

                    &.reserve {
                        font-weight: 400;
                    }
                }
            }

            .value {
                text-align: right;
                max-height: 42px;
                overflow-y: hidden;

                img {
                    cursor: pointer;
                }

                span {
                    margin: 0 9px;
                }

                &.reserve {
                    font-weight: 600;
                }
            }

            .book-comment {
                .v-input__slot {
                    font-size: 13px;
                    min-height: 40px !important;

                    .v-label {
                        top: 11px;
                        font-size: 14px;
                    }
                }
            }
        }
    }
</style>