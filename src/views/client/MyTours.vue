<template>
	<div class="my-tours-container">
		<PreLoader v-if="isLoading"/>
		<div class="mob-profile-head head-title mob">
			<img src="../../assets/icons/arrow-dark.svg" @click="$router.push('/mobile-profile')"/>
			<span>Поездки</span>
		</div>

		<div class="tour-tabs">
			<div class="tab" @click="activeTab='future'" :class="{'active': activeTab == 'future'}">
				Предстоящие
			</div>
			<div class="tab" @click="getPastBookings" :class="{'active': activeTab == 'past'}">
				Прошедшие
			</div>
		</div>

		<div class="my-future-tours" v-if="activeTab == 'future'">
			<template v-if="futureBookings.length">
				<router-link
					v-for="book in futureBookings" :key="book._id"
					:to="{name: 'bookingDetail', params: {tourId: book.tour._id, bookId: book._id}}"
					class="tour-item"
				>
					<div class="tour-item__image">
						<img :src="showTourPhoto(book.tour.images[0])" v-if="book.tour.images">
						<img src="../../assets/images/no-image.png" v-else>
					</div>
					<div class="tour-item__info">
						<div class="tour-item__name">{{book.tour.name.ru}}</div>
						<div class="tour-item__right">
							<div class="tour-item__desc-block">
								<div class="tour-item__company">
									<img :src="showCompanyPhoto(book.tour.company.logo)">
									{{book.tour.company.name}}
									<div class="rating">
										<img src="../../assets/icons/rating-icon.svg">
										<span>
										{{book.tour.company.rating}}
										<template v-if="book.tour.company.reviewCount">
											({{book.tour.company.reviewCount}})
										</template>
									</span>
									</div>
								</div>
								<div class="tour-item__description web">
									{{book.tour.description.ru}}
								</div>
								<div class="tour-item__status" v-if="book.stages.length">
									Статус:
									<span :class="getLastStage(book.stages).status">
									{{statuses[getLastStage(book.stages).status]}}
								</span>
								</div>
								<div class="tour-item__date">
									<span class="web">Дата тура:</span>
									<div class="format-date" v-html="formatDate(book.tour.date)"></div>
								</div>
							</div>
							<div class="tour-item__price-block">
								<span class="tour-item__price">{{book.tour.price}} сом</span>
							</div>
						</div>
					</div>
				</router-link>
			</template>
			<template v-else>
				<span class="no-result">Здесь пока пусто</span>
			</template>
		</div>

		<div class="my-past-tours" v-if="activeTab == 'past'">
			<template v-if="pastBookings.length">
				<div class="tour-items">
					<div class="tour-item" v-for="book in pastBookings" :key="book._id">
						<div class="tour-img"><img :src="showTourPhoto(book.tour.images[0])"></div>
						<div class="tour-item-info">
							<div class="tour-name">{{book.tour.name.ru}}</div>
							<div class="company-info flex align-center">
								<img :src="showCompanyPhoto(book.tour.company.logo)" class="company">
								<span class="company-name">{{book.tour.company.name}}</span>
								<div class="rating flex">
									<img src="../../assets/icons/rating-icon.svg">
									<span>{{book.tour.company.rating}} ({{book.tour.company.reviewCount}})</span>
								</div>
							</div>
							<div class="tour-desc web">
								{{book.tour.description.ru}}
							</div>
							<div class="date-price flex align-center justify-space-between">
								<div class="date" v-html="formatDate(book.tour.date)"></div>
								<span class="price">{{book.tour.price}} сом</span>
							</div>
							<button
								class="btn gray-primary"
								@click="toggleShowReviewModal(book)"
								v-if="book.reviews.length"
							>
								Посмотреть отзыв
							</button>
							<button class="btn gray-primary" @click="toggleReviewPastTourModal(book)" v-else>
								Написать отзыв
							</button>
						</div>
					</div>
				</div>
			</template>
			<template v-else>
				<span class="no-result">Здесь пока пусто</span>
			</template>
		</div>

		<!--REVIEW PAST TOUR MODAL-->
		<modal name="review-past-modal" height="380px" :adaptive="true">
			<div class="modal-container review-comment">
				<CloseIcon class="top-right" @click="toggleReviewPastTourModal"/>
				<div class="review-comment__head">
					<span>Оцените тур</span>
					<span>Поделитесь своим мнением</span>
				</div>
				<div class="review-comment__stars">
					<div class="default-star">
						<img src="../../assets/icons/unfilled-star.svg" v-for="i in 5" :key="i">
					</div>
					<div class="rating-star">
						<img
							src="../../assets/icons/rating-icon.svg"
							v-for="i in 5" :key="i"
							@click="reviewObj.rating = i"
							:class="{'selected': i <= reviewObj.rating}"
						>
					</div>
				</div>
				<v-textarea v-model="reviewObj.message" placeholder="Введите текст" rows="4" no-resize solo/>
				<button class="btn green-main" @click="writeReviewForPastTour">Сохранить</button>
			</div>
		</modal>

		<!--SHOW REVIEW MODAL-->
		<modal name="show-review-modal" height="180px" :adaptive="true">
			<div class="modal-container" v-if="selectedBook.reviews.length">
				<CloseIcon class="top-right" @click="toggleShowReviewModal"/>
				<div class="show-comment">
					<div v-for="(comment, i) in selectedBook.reviews[0].messages" :key="i" :class="comment.author">
						<template v-if="comment.author == 'company'">
							<span class="reply">Ответ оператора:</span>{{comment.message}}
						</template>
						<template v-else>
							<span class="reply">{{userProfile.name}}:</span>{{comment.message}}
						</template>
					</div>
				</div>
			</div>
		</modal>
	</div>
</template>

<script>
import {TourService} from '@/services/tour.service';
import {ReviewService} from '../../services/review.service';
import PreLoader from '@/components/general/PreLoader';
import {format} from 'date-fns';
import {ru} from 'date-fns/locale';
import {AWS_IMAGE_URL} from '@/services/api.service';
import {mapState} from 'vuex';
import CloseIcon from '@/components/icons/CloseIcon';

export default {
	components: {
		PreLoader,
		CloseIcon
	},
	data() {
		return {
			statuses: {
				RESERVED: 'Забронирован',
				PAID: 'Оплачено',
				PENDING: 'В ожидании',
				CANCELLED: 'Отменен',
				ADDED: 'Добавлен'
			},
			isLoading: false,
			pastBookings: [],
			todayDate: format(new Date(), 'yyyy-MM-dd'),
			activeTab: 'future',
			selectedBook: {reviews: []},
			reviewObj: {
				message: '',
				rating: 0
			}
		};
	},
	computed: {
		...mapState('booking', ['onSuccess', 'onError']),
		userProfile() {
			return this.$store.state.account.customer;
		},
		futureBookings() {
			return this.$store.state.booking.userBookings;
		}
	},
	created() {
		this.isLoading = true;
		this.$store.dispatch('booking/getAllUserBookings');
	},
	methods: {
		async getPastBookings() {
			try {
				this.activeTab = 'past';
				this.isLoading = true;
				const res = await TourService.fetchMyTourBookings(`&date[lt]=${this.todayDate}`);
				this.pastBookings = res.data.bookings;
				this.isLoading = false;
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		showTourPhoto(imgUrl) {
			return `${AWS_IMAGE_URL}/images/` + imgUrl + '?w=300&q=100';
		},

		showCompanyPhoto(imgUrl) {
			return `${AWS_IMAGE_URL}/logos/` + imgUrl + '?w=24';
		},

		formatDate(date) {
			const dateNum = format(new Date(date), 'dd');
			const month = format(new Date(date), 'LLLL', {locale: ru});
			const weekD = format(new Date(date), 'eeeeee', {locale: ru});
			return `<span>${dateNum}</span><span style="margin: 0 6px">${month},</span><span>${weekD}</span>`;
		},

		getLastStage(stages) {
			return stages[stages.length - 1];
		},

		toggleReviewPastTourModal(book) {
			this.selectedBook = book;
			this.reviewObj = {rating: 0};
			this.$modal.toggle('review-past-modal');
		},

		async writeReviewForPastTour() {
			if (!this.reviewObj.message || !this.reviewObj.rating) {
				this.$toast.error('Введите текст и поставьте оценку!');
				return;
			}
			try {
				this.isLoading = true;
				await ReviewService.addClientReview(this.selectedBook._id, this.reviewObj);
				this.toggleReviewPastTourModal();
				this.isLoading = false;
				this.$toast.success('Отзыв успешно добавлен!');
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		toggleShowReviewModal(book) {
			this.selectedBook = book;
			this.$modal.toggle('show-review-modal');
		}
	},
	watch: {
		onSuccess(msg) {
			if (msg) {
				this.$store.state.booking.onSuccess = '';
				this.isLoading = false;
			}
		},
		onError(msg) {
			if (msg) {
				this.$toast.error(msg);
				this.isLoading = false;
				this.$store.state.booking.onError = '';
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.my-tours-container {
	padding-top: 52px;
	@media #{$mob-view} {
		padding: 0;
	}
	.tour-tabs {
		display: flex;
		align-items: center;
		width: 100%;
		border-bottom: 1px solid $gray-light;
		@media #{$mob-view} {
			justify-content: center;
			border: 0;
		}
		.tab {
			font-weight: 600;
			font-size: 14px;
			color: $blue-darkest;
			border-bottom: 2px solid transparent;
			cursor: pointer;
			padding-bottom: 10px;
			text-align: center;
			@media #{$mob-view} {
				color: $gray-dark;
				padding: 0 25px 10px;
			}
			&:first-child {
				margin-right: 25px;
			}
			&.active {
				color: $green-main;
				border-bottom: 2px solid $green-main;
				cursor: default;
			}
		}
	}
	.my-future-tours {
		margin-top: 25px;
		@media #{$mob-view} {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-evenly;
			background: #f5f5f5;
			margin: 0;
			padding: 20px;
		}
		.tour-item {
			display: flex;
			background: #fff;
			box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
			border-radius: 7px;
			margin-bottom: 25px;
			transition: transform 0.2s ease-out;
			@media #{$mob-view} {
				flex-wrap: wrap;
				justify-content: center;
				max-width: 336px;
			}
			&:hover {
				transition: transform 0.2s ease-in;
				transform: scale(1.01);
				box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.30);
			}
			&__image {
				width: 100%;
				max-width: 273px;
				height: 194px;
				img {
					width: 100%;
					height: 100%;
					object-fit: cover;
					border-radius: 7px 0 0 7px;
				}
				@media #{$mob-view} {
					max-width: 336px;
					height: 200px;
					img {
						border-radius: 7px 7px 0 0;
					}
				}
			}
			&__info {
				width: 100%;
				padding: 16px 25px 0;
				color: $blue-darkest;
				@media #{$mob-view} {
					padding: 16px;
				}
			}
			&__name {
				font-weight: bold;
				font-size: 18px;
				white-space: nowrap;
				overflow-x: hidden;
				text-overflow: ellipsis;
				max-width: 460px;
				font-family: $montserrat;
				@media #{$mob-view} {
					max-width: 304px;
					font-size: 16px;
				}
			}
			&__right {
				display: flex;
				justify-content: space-between;
				align-items: flex-end;
				@media #{$mob-view} {
					display: block;
					position: relative;
				}
			}
			&__desc-block {
				width: 75%;
				@media #{$mob-view} {
					width: auto;
				}
			}
			&__price-block {
				width: 25%;
				@media #{$mob-view} {
					width: auto;
					position: absolute;
					right: 0;
					bottom: 0;
				}
			}
			&__company {
				display: flex;
				align-items: center;
				font-weight: 600;
				font-size: 14px;
				margin: 5px 0 7px;
				img {
					width: 24px;
					height: 24px;
					object-fit: cover;
					margin-right: 6px;
				}
				.rating {
					display: flex;
					align-items: center;
					margin-left: 14px;
					img {
						width: 12px;
						height: 12px;
						margin-right: 3px;
					}
					span {
						font-size: 14px;
						font-weight: normal;
					}
				}
			}
			&__description {
				font-size: 12px;
				margin-bottom: 7px;
				height: 38px;
				overflow-y: hidden;
				@media #{$mob-view} {
					margin-bottom: 28px;
				}
			}
			&__status {
				font-size: 14px;
				color: $blue-darkest;
				margin-bottom: 5px;
				span {
					font-weight: 600;
					margin-left: 6px;
					&.RESERVED {
						color: $orange-primary;
					}
					&.PAID {
						color: $green-main;
					}
					&.CANCELLED {
						color: $red-primary;
					}
					&.PENDING {
						color: $orange-primary;
					}
				}
			}
			&__date {
				color: $blue-darkest;
				display: flex;
				align-items: center;
				span {
					font-size: 14px;
				}
				.format-date {
					display: flex;
					font-weight: 600;
					font-size: 16px;
					text-transform: capitalize;
					margin-left: 7px;
					@media #{$mob-view} {
						margin: 0;
					}
				}
			}
			&__free-place {
				font-size: 14px;
				color: $red-primary;
				text-align: right;
				margin-bottom: 5px;
				@media #{$mob-view} {
					margin-bottom: 0;
				}
			}
			&__price {
				font-weight: bold;
				font-size: 24px;
				display: block;
				text-align: right;
				font-family: $montserrat;
				@media #{$mob-view} {
					font-size: 18px;
				}
			}
		}
	}

	.my-past-tours {
		margin-top: 25px;
		@media #{$mob-view} {
			background: #f5f5f5;
			margin: 0;
			padding: 20px;
		}
		.tour-items {
			display: flex;
			flex-wrap: wrap;
			@media #{$mob-view} {
				justify-content: space-evenly;
			}
			.tour-item {
				color: $blue-darkest;
				max-width: 273px;
				margin-bottom: 25px;
				border-radius: 7px;
				@media #{$mob-view} {
					background: #fff;
					margin-right: 0;
				}
				&:not(:last-child) {
					margin-right: 25px;
				}
				.tour-item-info {
					@media #{$mob-view} {
						padding: 16px;
					}
				}
				.company-info {
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
						min-width: 50px;
						span {
							margin-left: 3px;
						}
					}
				}
				.tour-img {
					width: 273px;
					height: 155px;
					img {
						width: 100%;
						height: 100%;
						object-fit: cover;
						border-radius: 7px;
						@media #{$mob-view} {
							border-radius: 7px 7px 0 0;
						}
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
					color: $gray-dark;
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
				.btn {
					height: 45px;
					text-transform: none;
					@media #{$mob-view} {
						margin-top: 5px;
					}
				}
			}
		}
	}
	.no-result {
		display: block;
		text-align: center;
		color: $blue-darkest;
		padding: 25px 0;
	}
	.review-comment {
		max-width: 435px;
		margin: 0 auto;
		&__head {
			span {
				display: block;
				&:first-child {
					font-weight: 600;
					font-size: 14px;
					color: $blue-darkest;
					margin-bottom: 5px;
				}
				&:last-child {
					font-size: 12px;
					color: $gray-dark;
				}
			}
		}
		&__stars {
			margin: 15px 0 20px;
			position: relative;
			img {
				width: 16px;
				height: 16px;
			}
			.default-star {
				display: flex;
				justify-content: space-between;
			}
			.rating-star {
				display: flex;
				justify-content: space-between;
				position: absolute;
				top: 0;
				width: 100%;
				img {
					opacity: 0;
					cursor: pointer;
					&.selected {
						opacity: 1;
					}
				}
			}
		}
	}
	.show-comment {
		font-size: 12px;
		color: $blue-darkest;
		.reply {
			color: $gray-dark;
			margin-right: 8px;
		}
		.customer {
			border-bottom: 1px solid $gray-light;
			padding-bottom: 10px;
		}
		.company {
			padding-top: 10px;
		}
	}
}
</style>