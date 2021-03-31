<template>
	<div class="review-show-container">
		<PreLoader v-if="isLoading"/>
		<div class="info-block">
			<div class="title-block">
				<span class="head-title" v-if="selectedTour.name">{{ selectedTour.name.ru }}</span>
				<span></span>
			</div>
			<div class="tour-info">
				<div class="info-fields left">
					<div>
						<label>Дата:</label>
						<span>{{ formatDate(selectedTour.date) }}</span>
					</div>
					<div>
						<label>Длительность:</label>
						<span>{{ selectedTour.duration }} дней</span>
					</div>
					<div>
						<label>Цена:</label>
						<span>{{ selectedTour.price }} сом</span>
					</div>
					<div>
						<label>Кол-во мест:</label>
						<span>{{selectedTour.bookingCount}} / {{ selectedTour.peopleCount }}</span>
					</div>
				</div>
			</div>
		</div>

		<div class="reviews">
			<div class="review-item" v-for="review in tourReviews" :key="review._id">
				<div class="comments">
					<div class="name">
						<div class="rating">
							<img src="../../assets/icons/unfilled-star.svg" v-for="star in 5" :key="star">
						</div>
						<div class="rating">
							<img src="../../assets/icons/rating-icon.svg" v-for="star in review.rating" :key="star">
						</div>
						<span>{{review.customer.name}}</span>
					</div>
					<div
						class="comment"
						v-for="(comment, i) in review.messages"
						:key="i"
						:class="{'reply-msg': i > 0}"
					>
						<div class="name">
							{{ showAuthorName(comment.author, review) }}
						</div>
						<div class="date">{{ formatCommentDate(comment.createdAt) }}</div>
						<div class="message">{{ comment.message }}</div>
					</div>
				</div>
				<div class="reply">
					<v-textarea v-model="review.comment" solo/>
					<button class="btn blue-primary" @click="submitReplyComment(review)">Написать</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import {ReviewService} from '@/services/review.service';
import {TourService} from '@/services/tour.service';
import moment from 'moment';
import {formatDate} from '@/utils/dateFormatter';
import PreLoader from '@/components/general/PreLoader';

export default {
	components: {
		PreLoader
	},
	data() {
		return {
			isLoading: false,
			tourReviews: {},
			selectedTour: {}
		};
	},
	computed: {
		userProfile() {
			return this.$store.state.account.company;
		}
	},
	created() {
		this.isLoading = true;
		this.getSelectedTourInfo(this.$route.params.tourId);
		this.getSelectedTourReviews(this.$route.params.tourId);
		this.makeAllCommentsRead(this.$route.params.tourId);
	},
	methods: {
		formatDate: formatDate,

		async getSelectedTourInfo(tourId) {
			try {
				const res = await TourService.fetchTourById(tourId);
				this.selectedTour = res.data.tour;
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		async getSelectedTourReviews(tourId) {
			try {
				const res = await ReviewService.fetchCompanyTourReviews(tourId);
				this.tourReviews = res.data.reviews;
				this.isLoading = false;
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		async makeAllCommentsRead(tourId) {
			try {
				await ReviewService.makeAllRead(tourId);
			} catch (err) {
				this.$toast.error(err);
			}
		},

		showAuthorName(author, review) {
			if (author === 'company') {
				return this.userProfile.name;
			}
			return review[author].name;
		},

		formatCommentDate(date) {
			return moment(date).format('DD.MM.YYYY HH:mm');
		},

		async submitReplyComment(review) {
			if (review.comment) {
				const body = {message: review.comment};
				this.isLoading = true;
				try {
					const res = await ReviewService.companyReply(review._id, body);
					review.messages = res.data.review.messages;
					review.comment = '';
					this.isLoading = false;
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
	.review-show-container {
		.info-block {
			background: #fff;
			padding: 24px;
			border: 1px solid $gray-light;
			border-radius: 4px;
			.title-block {
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: 1px solid $gray-light;
				.btn {
					max-width: 214px;
				}
			}
			.tour-info {
				display: flex;
				margin-top: 24px;
				.info-fields {
					label {
						word-break: break-all;
						font-size: 18px;
						color: $gray-dark;
						display: inline-block;
						width: calc(50% - 5px);
						margin-right: 5px;
					}
					&.left {
						min-width: 40%;
						border-right: 1px solid $gray-light;
						& > div {
							margin-bottom: 10px;
							span {
								font-size: 18px;
								display: inline-block;
								width: 50%;
							}
						}
					}
				}
			}
		}

		.reviews {
			margin-top: 20px;
			.review-item {
				background: #fff;
				margin-bottom: 15px;
				border: 1px solid $gray-light;
				border-radius: 4px;
				padding: 15px 20px 30px;
				.comments {
					.name {
						font-weight: 500;
						font-size: 14px;
						.rating {
							display: flex;
							position: absolute;
						}
						img {
							margin-left: 5px;
						}
						span {
							padding-top: 18px;
							display: inline-block;
						}
					}
					.comment {
						border: 1px solid $gray-light;
						border-radius: 4px;
						margin-bottom: 10px;
						padding: 10px;
						&.reply-msg {
							margin-left: 20px;
						}
						.date {
							font-size: 12px;
							color: $gray-dark;
							margin: 4px 0;
						}
						.message {
							font-size: 14px;
							color: $black-light;
						}
					}
				}
				.reply {
					margin-top: 15px;
					text-align: right;
					.btn {
						max-width: 220px;
					}
				}
			}
		}
	}
</style>