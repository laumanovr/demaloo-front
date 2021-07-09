<template>
	<div class="booking-detail-container">
		<div class="tour-detail__container">
			<PreLoader v-if="isLoading"/>
			<div class="tour-content" v-if="hasTour">
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
									<span>{{$t('date')}}:</span>
								</div>
								<div class="value" v-html="formatDate(tourDetail.date)"></div>
							</div>
							<div class="short-info">
								<div class="item flex align-center">
									<img src="../../assets/icons/duration-icon.svg">
									<span>{{$t('filter.duration')}}:</span>
								</div>
								<div class="value">{{tourDetail.duration}} {{$t('filter.days')}}</div>
							</div>
							<div class="short-info">
								<div class="item flex align-center">
									<img src="../../assets/icons/timer-icon.svg">
									<span>{{$t('tourBooking.meetingTime')}}:</span>
								</div>
								<div class="value">{{tourDetail.meetingTime}}</div>
							</div>
							<div class="short-info">
								<div class="item flex align-center">
									<img src="../../assets/icons/marker-dark.png">
									<span>{{$t('tourBooking.meetingPlace')}}:</span>
								</div>
								<div class="value">{{tourDetail.meetingPoint.ru}}</div>
							</div>
							<div class="short-info">
								<div class="item flex align-center">
									<img src="../../assets/icons/people-icon.svg">
									<span>{{$t('tourBooking.person')}}:</span>
								</div>
								<div class="value">{{payOrReserve.peopleCount}}</div>
							</div>
							<div class="short-info">
								<div class="item flex align-center">
									<img src="../../assets/icons/bank-card-icon.svg">
									<span>{{$t('tourBooking.total')}}:</span>
								</div>
								<div class="value">{{totalPayPrice}}</div>
							</div>
						</div>
						<!--Mobile end-->
						<div class="tour-detail__additional-block flex">
							<div class="includes">
								<div class="data-block">
									<div class="block-title flex">
										<img src="../../assets/icons/include-icon.svg">
										<span>{{$t('tourBooking.includes')}}</span>
									</div>
									<div class="block-item" v-for="(item, i) in tourDetail.includedInCost" :key="i">
										<span class="dot"></span>
										<span class="item-title">{{item.ru}}</span>
									</div>
								</div>
								<div class="data-block additional">
									<div class="block-title flex">
										<img src="../../assets/icons/additional-icon.svg">
										<span>{{$t('tourBooking.additional')}}</span>
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
										<span>{{$t('tourBooking.notIncludes')}}</span>
									</div>
									<div class="block-item" v-for="(item, i) in tourDetail.notIncludedInCost" :key="i">
										<span class="dot"></span>
										<span class="item-title">{{item.ru}}</span>
									</div>
								</div>
							</div>
						</div>
						<div class="tour-detail__transport-block">
							<div class="transport flex align-center">
								<div class="label flex align-center"><img
									src="../../assets/icons/transport-icon.svg">{{$t('tourBooking.transport')}}:
								</div>
								<span>{{tourDetail.transport.ru}}</span>
							</div>
							<div class="distance label flex align-center"><img
								src="../../assets/icons/double-marker.svg">{{$t('tourBooking.distance')}}
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
								<span>{{$t('tourBooking.program')}}</span>
							</div>

							<div class="program-item" v-for="program in tourDetail.program" :key="program.day">
								<div class="day flex align-center">
									<img src="../../assets/icons/calendar-green.svg">
									<span>{{$t('tourBooking.day')}} {{program.day}}</span>
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
						<div class="head-block flex align-center justify-space-between web">
							<div class="price">{{tourDetail.price}} {{$t('tourBooking.som')}}</div>
							<div class="date-place">
								<div class="date web" v-html="formatDate(tourDetail.date)"></div>
								<div class="place" v-if="tourDetail.bookingCount > 0">
									{{$t('tourBooking.remainPlace')}}: {{tourDetail.bookingCount}}
								</div>
							</div>
						</div>
						<div class="short-info web">
							<div class="item flex align-center">
								<img src="../../assets/icons/duration-icon.svg">
								<span>{{$t('filter.duration')}}:</span>
							</div>
							<div class="value">{{tourDetail.duration}} {{$t('filter.days')}}</div>
						</div>
						<div class="short-info web">
							<div class="item flex align-center">
								<img src="../../assets/icons/timer-icon.svg">
								<span>{{$t('tourBooking.meetingTime')}}:</span>
							</div>
							<div class="value">{{tourDetail.meetingTime}}</div>
						</div>
						<div class="short-info web">
							<div class="item flex align-center">
								<img src="../../assets/icons/marker-dark.png">
								<span>{{$t('tourBooking.meetingPlace')}}:</span>
							</div>
							<div class="value">{{tourDetail.meetingPoint.ru}}</div>
						</div>
						<div class="short-info web">
							<div class="item">
								<span>{{$t('tourBooking.person')}}:</span>
							</div>
							<div class="value flex align-center" v-if="checkIsTourBooked()">
								<img src="../../assets/icons/circle-minus.svg" @click="addSubtractQuantity('minus')">
								<span>{{payOrReserve.peopleCount}}</span>
								<img src="../../assets/icons/circle-plus.svg" @click="addSubtractQuantity('add')">
							</div>
							<div class="value flex align-center" v-else>
								<span>{{payOrReserve.peopleCount}}</span>
							</div>
						</div>
						<div class="total flex align-center justify-space-between web">
							<span>{{$t('tourBooking.total')}}:</span>
							<span>{{totalPayPrice}} {{$t('tourBooking.som')}}</span>
						</div>
						<div class="agreement web">
							Забронировав тур, я соглашаюсь с <span>Условиями предоставления услуг.</span>
						</div>
						<div class="pay-btn-block">
							<button
								class="btn green-main"
								v-if="checkIsTourBooked()"
								@click="purchaseReservedTour"
							>
								{{$t('button.pay')}}
							</button>
							<button class="btn white-color-red cancel" @click="cancelTourBooking(true)">
								{{$t('button.cancel')}}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!--CANCEL BOOKING MODAL-->
		<modal name="cancel-book-modal" :width="isMobileWindow ? '85%' : '370px'" height="200px">
			<div class="modal-container">
				<CloseIcon class="top-right" @click="$modal.hide('cancel-book-modal')"/>
				<h3>{{$t('tourBooking.cancelBooking')}}?</h3>
				<div class="btn-actions">
					<button class="btn red-primary cancel-btn" @click="cancelTourBooking(false)">{{$t('tourBooking.yesCancelBook')}}</button>
				</div>
			</div>
		</modal>
	</div>
</template>

<script>
import {TourService} from '@/services/tour.service';
import PreLoader from '@/components/general/PreLoader';
import CloseIcon from '@/components/icons/CloseIcon';
import {AWS_IMAGE_URL} from '@/services/api.service';
import {Carousel, Slide} from 'vue-carousel';
import {format} from 'date-fns';
import {ru} from 'date-fns/locale';

export default {
	components: {
		PreLoader,
		Carousel,
		Slide,
		CloseIcon
	},
	data() {
		return {
			isLoading: false,
			tourDetail: {},
			bookingDetail: {},
			totalPayPrice: 0,
			payOrReserve: {
				peopleCount: 1
			},
			slideImages: [],
			imgIndex: 1
		};
	},
	computed: {
		userProfile() {
			return this.$store.state.account.customer;
		},
		hasTour() {
			return Object.values(this.tourDetail).length > 0;
		},
		isMobileWindow() {
			return window.innerWidth < 1024;
		}
	},
	mounted() {
		this.isLoading = true;
		this.getSelectedTour(this.$route.params.tourId);
	},
	methods: {
		async getSelectedTour(tourId) {
			try {
				const res = await TourService.fetchClientTourDetail(tourId);
				this.tourDetail = res.data.tour;
				if (this.tourDetail.images) {
					this.tourDetail.images.forEach((image) => {
						this.slideImages.push(this.showTourImage(image));
					});
				}
				setTimeout(() => {
					this.getSelectedBooking(this.$route.params.bookId);
				}, 100);
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		async getSelectedBooking(bookId) {
			try {
				const res = await TourService.fetchBookingById(bookId);
				this.bookingDetail = res.data.booking;
				this.payOrReserve.peopleCount = this.bookingDetail.peopleCount;
				this.totalPayPrice = this.bookingDetail.total;
				this.isLoading = false;
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		checkIsTourBooked() {
			if (this.bookingDetail.stages) {
				const status = this.bookingDetail.stages[this.bookingDetail.stages.length - 1].status;
				return status === 'RESERVED';
			}
		},

		showTourImage(imageLink) {
			return `${AWS_IMAGE_URL}/images/` + imageLink + '?w=800';
		},

		showCompanyImage(imageLink) {
			return `${AWS_IMAGE_URL}/logos/` + imageLink;
		},

		addSubtractQuantity(type) {
			if (type === 'add') {
				this.payOrReserve.peopleCount += 1;
			} else if (type === 'minus' && this.payOrReserve.peopleCount > 1) {
				this.payOrReserve.peopleCount -= 1;
			}
			this.totalPayPrice = (this.tourDetail.price * this.payOrReserve.peopleCount);
		},

		changeImage(slidePage) {
			this.imgIndex = slidePage + 1;
		},

		formatDate(date) {
			const dateNum = format(new Date(date), 'dd');
			const month = format(new Date(date), 'LLLL', {locale: ru});
			const weekD = format(new Date(date), 'eeeeee', {locale: ru});
			return `<span>${dateNum}</span><span style="margin: 0 5px">${month},</span><span>${weekD}</span>`;
		},

		async purchaseReservedTour() {
			try {
				this.isLoading = true;
				const res = await TourService.purchaseReservation(this.$route.params.bookId, this.payOrReserve);
				window.location.href = res.data.redirectUrl;
				setTimeout(() => {
					this.isLoading = false;
				}, 5000);
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		async cancelTourBooking(confirm) {
			if (confirm) {
				this.$modal.show('cancel-book-modal');
			} else {
				try {
					this.isLoading = true;
					await TourService.cancelBooking(this.$route.params.bookId);
					this.$router.push('/profile-manage');
					this.$toast.success('Бронь успешно отменена!');
				} catch (err) {
					this.$toast.error(err);
					this.isLoading = false;
				}
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.booking-detail-container {
	background: #f5f5f5;
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
	.reserve-block {
		.pay-btn-block {
			@media #{$mob-view} {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: row-reverse;
			}
		}
		.btn.cancel {
			margin-top: 15px;
			@media #{$mob-view} {
				margin: 0 10px 0 0;
			}
		}
	}
	.cancel-btn {
		max-width: 180px;
		height: 50px;
	}
}
</style>