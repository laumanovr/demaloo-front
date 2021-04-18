<template>
	<div class="show-tour-container">
		<div class="tour-detail__container">
			<PreLoader v-if="isLoading"/>
			<template v-if="hasTour">
				<div class="tour-content">
					<div class="tour-detail__left">
						<div class="tour-detail__image">
							<carousel
								:perPage="1"
								:navigationEnabled="true"
								:paginationEnabled="false"
								@page-change="changeImage"
							>
								<slide v-for="imageUrl in slideImages" :key="imageUrl">
									<img class="main-img" :src="imageUrl">
								</slide>
							</carousel>
							<div class="arrows">
								<img src="../../assets/icons/circle-arrow-left.svg">
								<img src="../../assets/icons/circle-arrow-right.svg">
							</div>
							<div class="image-count" v-if="tourDetail.images">
								{{imgIndex}}/{{tourDetail.images.length}}
							</div>
						</div>
						<div class="tour-detail__info">
							<div class="top-title flex align-center justify-space-between">
								<span class="tour-detail__name">{{tourDetail.name.ru}}</span>
								<span class="tour-detail__favorite flex align-center web">
								<img src="../../assets/icons/heart-blue.svg">
								Сохранить
							</span>
							</div>
							<div class="tour-detail__company-info flex align-center">
								<img :src="showCompanyImage(tourDetail.company.logo)" class="company">
								{{tourDetail.company.name}}
								<div class="rating flex">
									<img src="../../assets/icons/rating-icon.svg">
									<span>{{tourDetail.company.rating}}</span>
								</div>
							</div>
							<div class="tour-detail__description">
								{{tourDetail.description.ru}}
							</div>
							<!--Mobile-->
							<div class="mob detail">
								<div class="short-info">
									<div class="item flex align-center">
										<img src="../../assets/icons/calendar-blue.svg">
										<span>Дата:</span>
									</div>
									<div class="value" v-html="formatDate(tourDetail.date)"></div>
								</div>
								<div class="short-info">
									<div class="item flex align-center">
										<img src="../../assets/icons/duration-icon.svg">
										<span>Длительность:</span>
									</div>
									<div class="value">{{tourDetail.duration}} дней</div>
								</div>
								<div class="short-info">
									<div class="item flex align-center">
										<img src="../../assets/icons/timer-icon.svg">
										<span>Время сбора:</span>
									</div>
									<div class="value">{{tourDetail.meetingTime}}</div>
								</div>
								<div class="short-info">
									<div class="item flex align-center">
										<img src="../../assets/icons/marker-dark.png">
										<span>Место сбора:</span>
									</div>
									<div class="value">{{tourDetail.meetingPoint.ru}}</div>
								</div>
							</div>
							<!--Mobile end-->
							<div class="tour-detail__additional-block flex">
								<div class="includes">
									<div class="data-block">
										<div class="block-title flex">
											<img src="../../assets/icons/include-icon.svg">
											<span>Включено</span>
										</div>
										<div class="block-item" v-for="(item, i) in tourDetail.includedInCost" :key="i">
											<span class="dot"></span>
											<span class="item-title">{{item.ru}}</span>
										</div>
									</div>
									<div class="data-block additional">
										<div class="block-title flex">
											<img src="../../assets/icons/additional-icon.svg">
											<span>Дополнительно</span>
										</div>
										<div class="block-item" v-for="(item, i) in tourDetail.additional" :key="i">
											<span class="dot"></span>
											<span class="item-title">{{item.ru}}</span>
										</div>
									</div>
								</div>
								<div class="not-include">
									<div class="data-block">
										<div class="block-title flex">
											<img src="../../assets/icons/not-include-icon.svg">
											<span>Взять с собой</span>
										</div>
										<div class="block-item" v-for="(item, i) in tourDetail.notIncludedInCost"
											 :key="i">
											<span class="dot"></span>
											<span class="item-title">{{item.ru}}</span>
										</div>
									</div>
								</div>
							</div>
							<div class="tour-detail__transport-block">
								<div class="transport flex align-center">
									<div class="label flex align-center"><img
										src="../../assets/icons/transport-icon.svg">Транспорт:
									</div>
									<span>{{tourDetail.transport.ru}}</span>
								</div>
								<div class="distance label flex align-center"><img
									src="../../assets/icons/double-marker.svg">Дистанция
								</div>
								<div class="kilometer">
									<img src="../../assets/images/distance-image.png">
									<div class="avto-foot flex justify-space-between">
										<span>{{tourDetail.distance.transportDistance}} км</span>
										<span>{{tourDetail.distance.walkDistance}} км</span>
									</div>
								</div>
							</div>
							<div class="tour-detail__program-block">
								<div class="program-title flex align-center">
									<img src="../../assets/icons/program-icon.svg">
									<span>Программа</span>
								</div>

								<div class="program-item" v-for="program in tourDetail.program" :key="program.day">
									<div class="day flex align-center">
										<img src="../../assets/icons/calendar-green.svg">
										<span>День {{program.day}}</span>
									</div>
									<div class="text">
										{{program.description.ru}}
									</div>
								</div>
							</div>
						</div>
					</div>

					<div class="tour-detail__right">
						<div class="reserve-block">
							<div class="head-block flex align-center justify-space-between">
								<div class="price">{{tourDetail.price}} сом</div>
								<div class="date-place">
									<div class="date web" v-html="formatDate(tourDetail.date)"></div>
									<div class="place" v-if="tourDetail.bookingCount > 0">
										Осталось мест: {{tourDetail.bookingCount}}
									</div>
								</div>
							</div>
							<div class="short-info web">
								<div class="item flex align-center">
									<img src="../../assets/icons/duration-icon.svg">
									<span>Длительность:</span>
								</div>
								<div class="value">{{tourDetail.duration}} дней</div>
							</div>
							<div class="short-info web">
								<div class="item flex align-center">
									<img src="../../assets/icons/timer-icon.svg">
									<span>Время сбора:</span>
								</div>
								<div class="value">{{tourDetail.meetingTime}}</div>
							</div>
							<div class="short-info web">
								<div class="item flex align-center">
									<img src="../../assets/icons/marker-dark.png">
									<span>Место сбора:</span>
								</div>
								<div class="value">{{tourDetail.meetingPoint.ru}}</div>
							</div>
							<div class="short-info web">
								<div class="item">
									<span>Человек:</span>
								</div>
								<div class="value flex align-center">
									<img src="../../assets/icons/circle-minus.svg"
										 @click="addSubtractQuantity('minus')">
									<span>{{payOrReserve.count}}</span>
									<img src="../../assets/icons/circle-plus.svg" @click="addSubtractQuantity('add')">
								</div>
							</div>
							<div class="total flex align-center justify-space-between web">
								<span>Итого:</span>
								<span>{{totalPayPrice}} сом</span>
							</div>
							<div class="agreement web">
								Забронировав тур, я соглашаюсь с <span>Условиями предоставления услуг.</span>
							</div>
							<button class="btn green-main" @click="toggleReserveModal">Забронировать</button>
						</div>
					</div>
				</div>
			</template>

			<div class="other-tours web" v-if="hasTour && otherTours.length">
				<div class="company-name"><span>Другие туры:</span><span>{{tourDetail.company.name}}</span></div>
				<div class="tour-items">
					<div class="tour-item" v-for="tour in otherTours" :key="tour._id"
						 @click="openTourFromOther(tour._id)">
						<div class="tour-img"><img :src="showTourImage(tour.images[0])" v-if="tour.images"></div>
						<div class="tour-name">{{tour.name.ru}}</div>
						<div class="tour-detail__company-info flex align-center">
							<img :src="showCompanyImage(tour.company.logo)" class="company">
							{{tour.company.name}}
							<div class="rating flex">
								<img src="../../assets/icons/rating-icon.svg">
								<span>{{tour.company.rating}} ({{tour.company.reviewCount}})</span>
							</div>
						</div>
						<div class="tour-desc">
							{{tour.description.ru}}
						</div>
						<div class="date-price flex align-center justify-space-between">
							<div class="date" v-html="formatDate(tour.date)"></div>
							<span class="price">{{tour.price}} сом</span>
						</div>
					</div>
				</div>
			</div>

			<!--RESERVE AND PAY MODAL-->
			<modal
				name="reserve-modal"
				class="reserve-modal"
				:width="isMobileWindow ? '100%' : '390px'" height="90%"
				:clickToClose="false"
				v-if="hasTour"
			>
				<div class="modal-container">
					<div class="reserve__title flex align-center justify-end">
						<span>Детали брони</span>
						<img src="../../assets/icons/close.svg" @click="toggleReserveModal">
					</div>
					<div class="reserve__tour-title">{{tourDetail.name.ru}}</div>
					<div class="reserve__company-date flex align-center justify-space-between">
						<div class="tour-detail__company-info flex align-center">
							<img :src="showCompanyImage(tourDetail.company.logo)" class="company">
							{{tourDetail.company.name}}
							<div class="rating flex">
								<img src="../../assets/icons/rating-icon.svg">
								<span>{{tourDetail.company.rating}}</span>
							</div>
						</div>
						<div class="date flex text-capitalize" v-html="formatDate(tourDetail.date)"></div>
					</div>
					<div class="reserve__free-cancel flex align-center">
						<img src="../../assets/icons/calendar-green.svg">
						<div>
							<div class="free-text">Бесплатная отмена брони до</div>
							<div class="free-date">{{showFreeCancelDate()}}</div>
						</div>
					</div>
					<div class="short-info">
						<div class="item flex align-center">
							<img src="../../assets/icons/duration-icon.svg">
							<span class="reserve">Длительность:</span>
						</div>
						<div class="value reserve">{{tourDetail.duration}} дней</div>
					</div>
					<div class="short-info">
						<div class="item flex align-center">
							<img src="../../assets/icons/timer-icon.svg">
							<span class="reserve">Время сбора:</span>
						</div>
						<div class="value reserve">{{tourDetail.meetingTime}}</div>
					</div>
					<div class="short-info">
						<div class="item flex align-center">
							<img src="../../assets/icons/marker-dark.png">
							<span class="reserve">Место сбора:</span>
						</div>
						<div class="value reserve">{{tourDetail.meetingPoint.ru}}</div>
					</div>
					<div class="short-info">
						<div class="item flex align-center">
							<img src="../../assets/icons/person-icon.svg">
							<span class="reserve">Гость:</span>
						</div>
						<div class="value reserve">{{userProfile.surname + ' ' + userProfile.name}}</div>
					</div>
					<div class="short-info web">
						<div class="item flex align-center">
							<img src="../../assets/icons/people-icon.svg">
							<span class="reserve">Количество мест:</span>
						</div>
						<div class="value reserve">{{payOrReserve.count}}</div>
					</div>
					<!--mobile-->
					<div class="short-info mob">
						<div class="item">
							<span>Человек:</span>
						</div>
						<div class="value flex align-center">
							<img src="../../assets/icons/circle-minus.svg" @click="addSubtractQuantity('minus')">
							<span>{{payOrReserve.count}}</span>
							<img src="../../assets/icons/circle-plus.svg" @click="addSubtractQuantity('add')">
						</div>
					</div>
					<!--mobile-->
					<div class="short-info">
						<div class="item flex align-center">
							<img src="../../assets/icons/bank-card-icon.svg">
							<span class="reserve">Итого:</span>
						</div>
						<div class="value reserve">{{totalPayPrice}} сом</div>
					</div>
					<div class="agreement mob">
						Забронировав тур, я соглашаюсь с <span>Условиями предоставления услуг.</span>
					</div>
					<div class="single-center">
						<button
							class="btn green-main"
							@click="makePaymentForTour"
						>
							Оплатить
						</button>
						<button
							class="btn white-color-green"
							:class="{'disabled': !isReservable()}"
							@click="makeReservation"
							:disabled="!isReservable()"
						>
							Забронировать
						</button>
					</div>
				</div>
			</modal>

			<!--COMPLETE RESERVE MODAL-->
			<modal name="complete-reserve-modal" width="380px" height="auto">
				<div class="modal-container">
					<div class="warn-img"><img src="../../assets/icons/warning-icon.svg"></div>
					<div class="warn-title">
						Тур забронирован. <br>
						Пожалуйста, не забудьте оплатить. <br> По истечении 12 часов ваша бронь обнуляется.
					</div>
					<div class="single-center complete">
						<button class="btn green-main" @click="toggleCompleteModal">Готово</button>
					</div>
				</div>
			</modal>
		</div>
	</div>
</template>

<script>
import {TourService} from '@/services/tour.service';
import PreLoader from '@/components/general/PreLoader';
import {AWS_IMAGE_URL} from '@/services/api.service';
import {Carousel, Slide} from 'vue-carousel';
import {format} from 'date-fns';
import {ru} from 'date-fns/locale';

export default {
	components: {
		PreLoader,
		Carousel,
		Slide
	},
	data() {
		return {
			isLoading: false,
			tourDetail: {},
			imgIndex: 1,
			otherTours: [],
			totalPayPrice: 0,
			payOrReserve: {
				count: 1,
				tourId: ''
			},
			slideImages: []
		};
	},
	computed: {
		userProfile() {
			return this.$store.state.account.customer;
		},
		userLogged() {
			return Object.values(this.userProfile).length > 0;
		},
		hasTour() {
			return Object.values(this.tourDetail).length > 0;
		},
		isMobileWindow() {
			return window.innerWidth < 1024;
		}
	},
	created() {
		this.isLoading = true;
		this.getSelectedTourDetail(this.$route.params.tourId);
	},
	methods: {
		async getSelectedTourDetail(tourId) {
			try {
				const res = await TourService.fetchClientTourDetail(tourId);
				this.tourDetail = res.data.tour;
				this.totalPayPrice = this.tourDetail.price;
				this.payOrReserve.tourId = this.$route.params.tourId;
				this.isLoading = false;
				this.getOtherTours(this.tourDetail.company._id);
				if (this.tourDetail.images) {
					this.tourDetail.images.forEach((image) => {
						this.slideImages.push(this.showTourImage(image));
					});
				}
			} catch(err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		async getOtherTours(companyId) {
			try {
				const query = `&company=${companyId}`;
				const res = await TourService.fetchAllTours(query);
				this.otherTours = res.data.tours.filter((i) => i._id !== this.$route.params.tourId).slice(0, 8);
			} catch (err) {
				this.$toast.error(err);
			}
		},

		openTourFromOther(tourId) {
			this.$router.push('/0#');
			setTimeout(() => {
				this.$router.push({name: 'tourDetail', params: {tourId: tourId}});
			}, 2);
		},

		showTourImage(imageLink) {
			return `${AWS_IMAGE_URL}/images/` + imageLink + '?w=800';
		},

		showCompanyImage(imageLink) {
			return `${AWS_IMAGE_URL}/logos/` + imageLink;
		},

		addSubtractQuantity(type) {
			if (type === 'add') {
				this.payOrReserve.count += 1;
			} else if (type === 'minus' && this.payOrReserve.count > 1) {
				this.payOrReserve.count -= 1;
			}
			this.totalPayPrice = (this.tourDetail.price * this.payOrReserve.count);
		},

		changeImage(slidePage) {
			this.imgIndex = slidePage + 1;
		},

		showFreeCancelDate() {
			this.cancelTourDate = new Date(this.tourDetail.date);
			this.cancelTourDate.setDate(this.cancelTourDate.getDate() - 2);
			return format(this.cancelTourDate, 'dd.MM.yyyy');
		},

		isReservable() {
			return format(this.cancelTourDate, 'yyyy-MM-dd') > format(new Date(), 'yyyy-MM-dd');
		},

		formatDate(date) {
			const dateNum = format(new Date(date), 'dd');
			const month = format(new Date(date), 'LLLL', {locale: ru});
			const weekD = format(new Date(date), 'eeeeee', {locale: ru});
			return `<span>${dateNum}</span><span style="margin: 0 5px">${month},</span><span>${weekD}</span>`;
		},

		toggleReserveModal() {
			if (this.userLogged) {
				if (this.userProfile.name) {
					return this.$modal.toggle('reserve-modal');
				}
				return this.$router.push('/profile-manage/info');
			}
			this.$modal.show('login-modal');
		},

		toggleCompleteModal() {
			this.$modal.toggle('complete-reserve-modal');
		},

		async makeReservation() {
			if (this.payOrReserve.count > 4) {
				this.$toast.info('Больше 4 мест бронировать нельзя!');
				return;
			}
			try {
				this.isLoading = true;
				await TourService.reservationForTour(this.payOrReserve);
				this.isLoading = false;
				this.payOrReserve.count = 1;
				this.totalPayPrice = this.tourDetail.price;
				this.toggleReserveModal();
				this.toggleCompleteModal();
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		async makePaymentForTour() {
			try {
				this.isLoading = true;
				const res = await TourService.paymentForTour(this.payOrReserve);
				window.location.href = res.data.redirectUrl;
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

	}
};
</script>

<style lang="scss">
.show-tour-container {
	background: #f5f5f5;
}
.tour-detail {
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
		.short-info {
			display: flex;
			justify-content: space-between;
			font-size: 14px;
			margin-bottom: 22px;
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
		}
		.single-center {
			justify-content: space-between;
			&.complete {
				justify-content: center;
			}
			.btn {
				max-width: 165px;
				height: 40px;
				&:first-child {
					margin-right: 10px;
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
			.company-name {
				margin: 0 0 20px 26px;
				padding-top: 18px;
				span {
					font-family: $montserrat;
					&:first-child {
						font-weight: bold;
						font-size: 18px;
						color: $blue-darkest;
						margin-right: 10px;
					}
					&:last-child {
						font-weight: 500;
						font-size: 18px;
						color: $green-main;
					}
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
			object-fit: cover;
			@media #{$mob-view} {
				height: 220px;
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
		img {
			margin-right: 4px;
		}
	}
	&__company-info {
		font-weight: 600;
		font-size: 14px;
		color: $blue-darkest;
		margin: 10px 0;
		img.company {
			width: 24px;
			height: 24px;
			margin-right: 7px;
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
				@media #{$mob-view} {
					width: 50%;
					height: 50px;
				}
			}
		}
	}
}

.agreement {
	font-size: 12px;
	text-align: center;
	margin-bottom: 20px;
	span {
		color: $green-main;
	}
}

.reserve-modal {
	.vm--modal {
		max-height: 650px;
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
				&__free-cancel {
					font-size: 14px;
					border-top: 1px solid $gray-light;
					border-bottom: 1px solid $gray-light;
					margin: 10px 0 20px;
					padding: 12px 0;
					img {
						margin-right: 12px;
					}
					.free-date {
						font-weight: 600;
					}
				}
			}
		}
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

.fade-enter-active,
.fade-leave-active {
	transition: all 0.8s ease;
	overflow: hidden;
	visibility: visible;
	position: absolute;
	left: 0;
	width: 100%;
	opacity: 1;
	@media #{$mob-view} {
		padding: 0 20px;
	}
}
.fade-enter,
.fade-leave-to {
	visibility: hidden;
	width: 100%;
	opacity: 0;
}
</style>