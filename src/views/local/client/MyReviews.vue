<template>
	<div class="all-reviews-container">
		<PreLoader v-if="isLoading"/>
		<div class="mob-profile-head head-title mob">
			<img src="../../../assets/icons/arrow-dark.svg" @click="$router.push('/mobile-profile')"/>
			<span>{{$t('myReviews')}}</span>
		</div>
		<div class="reviews">
			<div class="review" v-for="review in allMyReviews" :key="review._id">
				<div class="review__tour-name">{{review.company.name}}</div>
				<div class="review__company">
					<img :src="showCompanyPhoto(review.company.logo)">
					<div class="right">
						<div class="name">{{review.tour.name.ru}}</div>
						<div class="date">{{formatDate(review.tour.date)}}</div>
					</div>
				</div>
				<div class="review__rating">
					<img src="../../../assets/icons/rating-icon.svg" v-for="i in review.rating" :key="i">
				</div>
				<div class="review__comment">
					<div v-for="(comment, i) in review.messages" :key="i" :class="comment.author">
						<template v-if="comment.author == 'company'">
							<span class="reply">{{review.company.name}}:</span>{{comment.message}}
						</template>
						<template v-else>
							<span class="reply">{{userProfile.name}}:</span>{{comment.message}}
						</template>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import {ReviewService} from '../../../services/review.service';
import PreLoader from '../../../components/general/PreLoader';
import {AWS_IMAGE_URL} from '../../../services/api.service';
import {format} from 'date-fns';

export default {
	components: {
		PreLoader
	},
	data() {
		return {
			isLoading: false,
			allMyReviews: []
		};
	},
	computed: {
		userProfile() {
			return this.$store.state.account.customer;
		}
	},
	created() {
		this.isLoading = true;
		this.getAllReviews();
	},
	methods: {
		async getAllReviews() {
			try {
				const res = await ReviewService.fetchAllClientReviews();
				this.allMyReviews = res.data.reviews;
				this.isLoading = false;
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		showCompanyPhoto(imgUrl) {
			return `${AWS_IMAGE_URL}/logos/` + imgUrl + '?w=100';
		},

		formatDate(date) {
			return format(new Date(date), "dd.MM.yyyy");
		},
	},

};
</script>

<style lang="scss" scoped>
	.all-reviews-container {
		.reviews {
			padding-top: 26px;
			.review {
				border: 1px solid #EDEDF0;
				box-sizing: border-box;
				border-radius: 7px;
				padding: 20px;
				margin-bottom: 25px;
				color: $blue-darkest;
				@media #{$mob-view} {
					margin: 0 10px 25px;
				}
				&__tour-name {
					font-weight: 600;
					font-size: 14px;
					max-height: 45px;
					overflow-y: hidden;
				}
				&__company {
					display: flex;
					align-items: center;
					margin: 6px 0 8px;
					img {
						width: 40px;
						height: 40px;
						object-fit: cover;
						margin-right: 15px;
						border-radius: 30px;
					}
					.right {
						.name {
							font-size: 14px;
						}
						.date {
							font-size: 12px;
							color: $gray-dark;
						}
					}
				}
				&__rating {
					display: flex;
					margin-bottom: 6px;
					img {
						margin-right: 5px;
					}
				}
				&__comment {
					font-size: 12px;
					.reply {
						color: $gray-dark;
						margin-right: 8px;
					}
					.company {
						padding-top: 10px;
					}
				}
			}
		}
	}
</style>