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
									<img class="main-img" :src="imageUrl" @click="openFullSizeModal">
								</slide>
							</carousel>
							<div class="arrows">
								<img src="../../../assets/icons/circle-arrow-left.svg">
								<img src="../../../assets/icons/circle-arrow-right.svg">
							</div>
							<div class="image-count" v-if="tourDetail.images">
								{{imgIndex}}/{{tourDetail.images.length}}
							</div>
						</div>
						<div class="tour-detail__info">
							<div class="top-title d-flex align-center justify-space-between">
								<span class="tour-detail__name">{{tourDetail.name.ru}}</span>
								<div
									class="tour-detail__favorite d-flex align-center"
									@click="addToFavorite"
									v-if="userLogged"
								>
									<inline-svg
										:src="require('../../../assets/icons/heart-blue.svg')"
										:class="{'saved': checkIsAlreadyFavorite()}"
									/>
									<span class="web">{{checkIsAlreadyFavorite() ? $t('button.favorited') : $t('button.save')}}</span>
								</div>
							</div>
							<router-link
								:to="{name: 'companyInfo', params: {companyId: tourDetail.company._id}}"
								class="tour-detail__company-info link d-flex align-center"
							>
								<img :src="showCompanyImage(tourDetail.company.logo)" class="company">
								{{tourDetail.company.name}}
								<div class="rating d-flex">
									<img src="../../../assets/icons/rating-icon.svg">
									<span>{{tourDetail.company.rating}}</span>
								</div>
							</router-link>
							<div class="tour-detail__description">
								{{tourDetail.description.ru}}
							</div>
							<!--Mobile-->
							<div class="mob detail">
								<div class="short-info">
									<div class="item d-flex align-center">
										<img src="../../../assets/icons/calendar-blue.svg">
										<span>{{$t('date')}}:</span>
									</div>
									<div class="value" v-html="formatDate(tourDetail.date)"></div>
								</div>
								<div class="short-info">
									<div class="item d-flex align-center">
										<img src="../../../assets/icons/duration-icon.svg">
										<span>{{$t('filter.duration')}}:</span>
									</div>
									<div class="value">{{tourDetail.duration}} {{showDayTitle()}}</div>
								</div>
								<div class="short-info">
									<div class="item d-flex align-center">
										<img src="../../../assets/icons/timer-icon.svg">
										<span>{{$t('tourBooking.meetingTime')}}:</span>
									</div>
									<div class="value">{{tourDetail.meetingTime}}</div>
								</div>
								<div class="short-info">
									<div class="item d-flex align-center">
										<img src="../../../assets/icons/marker-dark.png">
										<span>{{$t('tourBooking.meetingPlace')}}:</span>
									</div>
									<div class="value">{{tourDetail.meetingPoint.ru}}</div>
								</div>
							</div>
							<!--Mobile end-->
							<div class="tour-detail__additional-block d-flex">
								<div class="includes">
									<div class="data-block">
										<div class="block-title d-flex">
											<img src="../../../assets/icons/include-icon.svg">
											<span>{{$t('tourBooking.includes')}}</span>
										</div>
										<div class="block-item" v-for="(item, i) in tourDetail.includedInCost" :key="i">
											<span class="dot"></span>
											<span class="item-title">{{item.ru}}</span>
										</div>
									</div>
									<div class="data-block additional">
										<div class="block-title d-flex">
											<img src="../../../assets/icons/additional-icon.svg">
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
										<div class="block-title d-flex">
											<img src="../../../assets/icons/not-include-icon.svg">
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
								<div class="transport d-flex align-center">
									<div class="label d-flex align-center"><img
										src="../../../assets/icons/transport-icon.svg">{{$t('tourBooking.transport')}}:
									</div>
									<span>{{tourDetail.transport.ru}}</span>
								</div>
								<div class="distance label d-flex align-center"><img
									src="../../../assets/icons/double-marker.svg">{{$t('tourBooking.distance')}}
								</div>
								<div class="kilometer">
									<img src="../../../assets/images/distance-image.png">
									<div class="avto-foot d-flex justify-space-between">
										<span>{{tourDetail.distance.transportDistance}} км</span>
										<span>{{tourDetail.distance.walkDistance}} км</span>
									</div>
								</div>
							</div>
							<div class="tour-detail__program-block">
								<div class="program-title d-flex align-center">
									<img src="../../../assets/icons/program-icon.svg">
									<span>{{$t('tourBooking.program')}}</span>
								</div>

								<div class="program-item" v-for="program in tourDetail.program" :key="program.day">
									<div class="day d-flex align-center">
										<img src="../../../assets/icons/calendar-green.svg">
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
							<div class="head-block d-flex align-center justify-space-between">
								<div class="price">{{tourDetail.price}} {{$t('tourBooking.som')}}</div>
								<div class="date-place">
									<div class="date web" v-html="formatDate(tourDetail.date)"></div>
									<div class="place" v-if="tourDetail.bookingCount > -1">
										{{$t('tourBooking.remainPlace')}}: {{tourDetail.bookingCount}}
									</div>
								</div>
							</div>
							<div class="short-info web">
								<div class="item d-flex align-center">
									<img src="../../../assets/icons/duration-icon.svg">
									<span>{{$t('filter.duration')}}:</span>
								</div>
								<div class="value">{{tourDetail.duration}} {{showDayTitle()}}</div>
							</div>
							<div class="short-info web">
								<div class="item d-flex align-center">
									<img src="../../../assets/icons/timer-icon.svg">
									<span>{{$t('tourBooking.meetingTime')}}:</span>
								</div>
								<div class="value">{{tourDetail.meetingTime}}</div>
							</div>
							<div class="short-info web">
								<div class="item d-flex align-center">
									<img src="../../../assets/icons/marker-dark.png">
									<span>{{$t('tourBooking.meetingPlace')}}:</span>
								</div>
								<div class="value">{{tourDetail.meetingPoint.ru}}</div>
							</div>
							<div class="short-info web">
								<div class="item">
									<span>{{$t('tourBooking.person')}}:</span>
								</div>
								<div class="value d-flex align-center">
									<img src="../../../assets/icons/circle-minus.svg" @click="addSubtractQuantity('minus')">
									<span>{{payOrReserve.count}}</span>
									<img src="../../../assets/icons/circle-plus.svg" @click="addSubtractQuantity('add')">
								</div>
							</div>
							<div class="total align-center justify-space-between web">
								<span>{{$t('tourBooking.total')}}:</span>
								<span>{{totalPayPrice}} {{$t('tourBooking.som')}}</span>
							</div>
							<div class="agreement web">
								{{$t('tourBooking.bookTermFirst')}}
								<a href="/docs/condition.pdf" target="_blank">{{$t('tourBooking.bookTermLast')}}.</a>
							</div>
							<button
								disabled
								class="btn gray-primary disabled"
								v-if="checkIsAlreadyBooked() && userLogged"
							>
								{{$t('tourBooking.alreadyBooked')}}
							</button>
							<button
								class="btn green-main"
								@click="toggleReserveModal"
								v-else
							>
								{{$t('button.book')}}
							</button>
						</div>
					</div>
				</div>
			</template>

			<div class="other-tours web" v-if="hasTour && otherTours.length">
				<div class="current-company-name">
					<span>{{$t('otherTours')}}:</span>
					<router-link :to="{name: 'companyInfo', params: {companyId: tourDetail.company._id}}">
						{{tourDetail.company.name}}
					</router-link>
				</div>
				<div class="tour-items">
					<div class="tour-item" v-for="tour in otherTours" :key="tour._id" @click="openTourFromOther(tour._id)">
						<div class="tour-img"><img :src="showTourImage(tour.images[0])" v-if="tour.images"></div>
						<div class="tour-name">{{tour.name.ru}}</div>
						<div class="tour-detail__company-info d-flex align-center">
							<img :src="showCompanyImage(tour.company.logo)" class="company">
							<span class="company-name">{{tour.company.name}}</span>
							<div class="rating d-flex">
								<img src="../../../assets/icons/rating-icon.svg">
								<span>{{tour.company.rating}} ({{tour.company.reviewCount}})</span>
							</div>
						</div>
						<div class="tour-desc">
							{{tour.description.ru}}
						</div>
						<div class="date-price d-flex align-center justify-space-between">
							<div class="date" v-html="formatDate(tour.date)"></div>
							<span class="price">{{tour.price}} {{$t('tourBooking.som')}}</span>
						</div>
					</div>
				</div>
			</div>

			<!--RESERVE AND PAY MODAL-->
			<modal
				name="reserve-modal"
				class="reserve-modal"
				:width="isMobileWindow ? '100%' : '390px'"
				height="97%"
				:clickToClose="false"
				v-if="hasTour"
			>
				<div class="modal-container">
					<div class="reserve__title d-flex align-center justify-end">
						<span>{{$t('tourBooking.bookDetail')}}</span>
						<img src="../../../assets/icons/close.svg" @click="toggleReserveModal">
					</div>
					<div class="reserve__tour-title">{{tourDetail.name.ru}}</div>
					<div class="reserve__company-date d-flex align-center justify-space-between">
						<div class="tour-detail__company-info d-flex align-center">
							<img :src="showCompanyImage(tourDetail.company.logo)" class="company">
							{{tourDetail.company.name}}
							<div class="rating d-flex">
								<img src="../../../assets/icons/rating-icon.svg">
								<span>{{tourDetail.company.rating}}</span>
							</div>
						</div>
						<div class="date d-flex text-capitalize" v-html="formatDate(tourDetail.date)"></div>
					</div>
					<div class="reserve__free-cancel d-flex align-center">
						<img src="../../../assets/icons/calendar-green.svg">
						<div>
							<div class="free-text">{{$t('tourBooking.freeBookCancelTill')}}</div>
							<div class="free-date">{{showFreeCancelDate()}}</div>
						</div>
					</div>
					<div class="short-info">
						<div class="item d-flex align-center">
							<img src="../../../assets/icons/duration-icon.svg">
							<span class="reserve">{{$t('filter.duration')}}:</span>
						</div>
						<div class="value reserve">{{tourDetail.duration}} {{showDayTitle()}}</div>
					</div>
					<div class="short-info">
						<div class="item d-flex align-center">
							<img src="../../../assets/icons/timer-icon.svg">
							<span class="reserve">{{$t('tourBooking.meetingTime')}}:</span>
						</div>
						<div class="value reserve">{{tourDetail.meetingTime}}</div>
					</div>
					<div class="short-info">
						<div class="item d-flex align-center">
							<img src="../../../assets/icons/marker-dark.png">
							<span class="reserve">{{$t('tourBooking.meetingPlace')}}:</span>
						</div>
						<div class="value reserve">{{tourDetail.meetingPoint.ru}}</div>
					</div>
					<div class="short-info">
						<div class="item d-flex align-center">
							<img src="../../../assets/icons/person-icon.svg">
							<span class="reserve">{{$t('tourBooking.guest')}}:</span>
						</div>
						<div class="value reserve">{{userProfile.surname + ' ' + userProfile.name}}</div>
					</div>
					<div class="short-info web">
						<div class="item d-flex align-center">
							<img src="../../../assets/icons/people-icon.svg">
							<span class="reserve">{{$t('tourBooking.placeCount')}}:</span>
						</div>
						<div class="value reserve">{{payOrReserve.count}}</div>
					</div>
					<div class="short-info">
						<div class="item d-flex align-center">
							<img src="../../../assets/icons/bank-card-icon.svg">
							<span class="reserve">{{$t('tourBooking.total')}}:</span>
						</div>
						<div class="value reserve">{{totalPayPrice}} {{$t('tourBooking.som')}}</div>
					</div>
					<!--mobile-->
					<div class="short-info mob">
						<div class="item">
							<span>{{$t('tourBooking.person')}}:</span>
						</div>
						<div class="value d-flex align-center">
							<img src="../../../assets/icons/circle-minus.svg" @click="addSubtractQuantity('minus')">
							<span>{{payOrReserve.count}}</span>
							<img src="../../../assets/icons/circle-plus.svg" @click="addSubtractQuantity('add')">
						</div>
					</div>
					<!--mobile-->
					<div class="short-info comment">
						<v-text-field
							outlined
							class="book-comment no-detail"
							:label="$t('tourBooking.commentForOperator')+'...'"
							v-model="payOrReserve.comment"
						/>
					</div>
					<div class="agreement mob">
						Забронировав тур, я соглашаюсь с
						<a href="/docs/condition.pdf" target="_blank">Условиями предоставления услуг.</a>
					</div>
					<div class="single-center">
						<button
							class="btn green-main"
							@click="makePaymentForTour"
						>
							{{$t('button.pay')}}
						</button>
						<button
							class="btn white-color-green"
							:class="{'disabled': !isReservable()}"
							@click="makeReservation"
							:disabled="!isReservable()"
						>
							{{$t('button.book')}}
						</button>
					</div>
				</div>
			</modal>

			<!--COMPLETE RESERVE MODAL-->
			<modal name="complete-reserve-modal" width="380px" height="auto">
				<div class="modal-container">
					<div class="warn-img"><img src="../../../assets/icons/checked-icon.svg"></div>
					<div class="warn-title">
						{{$t('tourBooking.bookPayReminder')}}
					</div>
					<div class="single-center complete">
						<button class="btn green-main" @click="toggleCompleteModal">{{$t('button.ready')}}</button>
					</div>
				</div>
			</modal>
		</div>
		<!--FOR MOBILE FULL SIZE VIEW IMAGES-->
		<FullSizeSliderModal
			:imgIndex="imgIndex"
			:slideImages="slideImages"
			:tourImagesCount="tourDetail.images && tourDetail.images.length"
		/>
	</div>
</template>

<script>
import {TourService} from '@/services/tour.service';
import FullSizeSliderModal from '@/components/client/FullSizeSliderModal';
import {AWS_IMAGE_URL} from '@/services/api.service';
import {Carousel, Slide} from 'vue-carousel';
import {format} from 'date-fns';
import {ru} from 'date-fns/locale';

export default {
	components: {
		Carousel,
		Slide,
		FullSizeSliderModal
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
				tourId: '',
				comment: ''
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
		},
		userBookings() {
			return this.$store.state.booking.userBookings;
		},
		favoriteTours() {
			return this.$store.state.favorite.favoriteTours;
		}
	},
	created() {
		this.isLoading = true;
		this.getSelectedTourDetail(this.$route.params.tourId);
	},
	beforeDestroy() {
		this.isLoading = false;
	},
	methods: {
		async getSelectedTourDetail(tourId) {
			try {
				const res = await TourService.fetchClientTourDetail(tourId);
				this.tourDetail = res.data.tour;
				this.totalPayPrice = this.tourDetail.price;
				this.payOrReserve.tourId = tourId;
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

		checkIsAlreadyBooked() {
			const book = this.userBookings.find((book) => book.tour._id === this.$route.params.tourId);
			if (book) {
				return book.stages[book.stages.length - 1].status === 'RESERVED';
			}
		},

		checkIsAlreadyFavorite() {
			const favTour = this.favoriteTours.find((tour) => tour._id === this.$route.params.tourId);
			return favTour ? favTour : '';
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

		async addToFavorite() {
			try {
				this.isLoading = true;
				if (this.checkIsAlreadyFavorite()) {
					await TourService.deleteFavoriteTour(this.$route.params.tourId);
				} else {
					await TourService.addFavoriteTour(this.$route.params.tourId);
				}
				this.$store.dispatch('favorite/getAllFavoriteTours');
				this.isLoading = false;
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		openTourFromOther(tourId) {
			this.$router.push('/0#');
			setTimeout(() => {
				this.$router.push({name: 'tourDetail', params: {tourId: tourId}});
			}, 2);
		},

		showTourImage(imageLink) {
			return `${AWS_IMAGE_URL}/images/` + imageLink + '?w=1000&h=500&q=100';
		},

		showCompanyImage(imageLink) {
			return `${AWS_IMAGE_URL}/logos/` + imageLink;
		},

		showDayTitle() {
			if (this.tourDetail.duration === 1) {
				return 'день';
			}
			if (this.tourDetail.duration >= 5) {
				return 'дней';
			}
			return 'дня';
		},

		addSubtractQuantity(type) {
			if (type === 'add') {
				if (this.tourDetail.bookingCount === -1 || this.payOrReserve.count < this.tourDetail.bookingCount) {
					this.payOrReserve.count += 1;
				}
			} else if (type === 'minus' && this.payOrReserve.count > 1) {
				this.payOrReserve.count -= 1;
			}
			this.totalPayPrice = (this.tourDetail.price * this.payOrReserve.count);
		},

		changeImage(slidePage) {
			this.imgIndex = slidePage + 1;
		},

		openFullSizeModal() {
			if (this.isMobileWindow) {
				this.$modal.show('big-slider-modal');
			}
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
				setTimeout(() => {
					this.$router.push('/profile-manage');
				}, 2000);
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		async makePaymentForTour() {
			try {
				this.isLoading = true;
				const res = await TourService.paymentForTour(this.payOrReserve);
				this.toggleReserveModal();
				window.location.href = res.data.redirectUrl;
				setTimeout(() => {
					this.isLoading = false;
				}, 5000);
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
		@media #{$mob-view} {
			max-width: 85%;
		}
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
		&.link {
			text-decoration: underline;
		}
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
            img {
                width: 100%;
            }
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
                display: flex;
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
	a {
		color: $green-main !important;
		text-decoration: underline;
		&:hover {
			text-decoration: none;
		}
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
</style>