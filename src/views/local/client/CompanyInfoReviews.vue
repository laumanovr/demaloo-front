<template>
	<div class="company-info-reviews-container">
		<PreLoader v-if="isLoading"/>
		<div class="back">
			<img src="../../../assets/icons/arrow-dark.svg" @click="$router.go(-1)"/>
		</div>
		<div class="company-info-review-content">
			<div class="company-info flex align-center">
				<img :src="showCompanyImage(currentCompany.logo)" class="company">
				<div>
					<div class="company-name flex align-center">
						<span>{{currentCompany.name}}</span>
						<img src="../../../assets/icons/rating-icon.svg" class="star">
						<span class="rating">{{currentCompany.rating}}</span>
					</div>
					<div class="created-date">{{$t('companyInfo.inDemalooFrom')}} {{formatDate(currentCompany.createdAt)}}</div>
				</div>
			</div>
			<div class="reviews">
				<div class="review" v-for="review in allCompanyReviews" :key="review._id">
					<div class="review__company">
						<img :src="showCustomerPhoto(review.customer.photo)">
						<div class="right">
							<div class="name">{{review.customer.name}}</div>
							<div class="review__tour-name">{{review.tour.name.ru}}</div>
						</div>
					</div>
					<div class="review__rating">
						<img src="../../../assets/icons/rating-icon.svg" v-for="i in review.rating" :key="i">
					</div>
					<div class="review__comment">
						<div v-for="(comment, i) in review.messages" :key="i" :class="comment.author">
							<template v-if="comment.author == 'company'">
								<div class="review__company">
									<img :src="showCompanyImage(review.company.logo)">
									<div class="right">
										<div class="name">{{review.company.name}}</div>
									</div>
								</div>
								{{comment.message}}
								<div class="date">{{formatDate(comment.createdAt)}}</div>
							</template>
							<template v-else>
								{{comment.message}}
								<div class="date">{{formatDate(comment.createdAt)}}</div>
							</template>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import {ReviewService} from '../../../services/review.service';
import {UserService} from '../../../services/user.service';
import {AWS_IMAGE_URL} from '../../../services/api.service';
import PreLoader from '@/components/general/PreLoader';
import {format} from 'date-fns';

export default {
	components: {
		PreLoader
	},
	data() {
		return {
			isLoading: false,
			currentCompany: {},
			allCompanyReviews: []
		};
	},
	computed: {
		userProfile() {
			return this.$store.state.account.customer;
		}
	},
	beforeCreate() {
		this.isLoading = true;
	},
	async created() {
		this.isLoading = true;
		await this.getCompanyInfo();
		await this.getCompanyAllReviews();
	},
	methods: {
		async getCompanyInfo() {
			try {
				const res = await UserService.fetchCompanyById(this.$route.params.companyId);
				this.currentCompany = res.data.company;
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		async getCompanyAllReviews() {
			try {
				const res = await ReviewService.fetchCompanyReviews(this.$route.params.companyId);
				this.allCompanyReviews = res.data.reviews;
				this.isLoading = false;
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		showCustomerPhoto(imgUrl) {
			return `${AWS_IMAGE_URL}/photos/` + imgUrl + '?w=50';
		},

		formatDate(date) {
			if (date) {
				return format(new Date(date), 'dd.MM.yyyy');
			}
		},

		showCompanyImage(imageLink) {
			if (imageLink) {
				return `${AWS_IMAGE_URL}/logos/` + imageLink;
			}
		},
	}
};
</script>

<style lang="scss">
	.company-info-reviews-container {
		background: #f5f5f5;
		padding-bottom: 20px;
		.back {
			cursor: pointer;
			padding: 15px 0 20px 20px;
			max-width: 1200px;
			margin: 0 auto;
		}
		.company-info-review-content {
			max-width: 1200px;
			margin: 0 auto;
			background: #fff;
			border-radius: 7px;
			padding: 25px;
			.company-info {
				border-bottom: 1px solid $gray-light;
				padding-bottom: 15px;
			}
			img.company {
				width: 72px;
				height: 72px;
				object-fit: cover;
				border-radius: 40px;
				@media #{$mob-view} {
					width: 40px;
					height: 40px;
				}
			}
			.company-name {
				font-weight: bold;
				font-size: 20px;
				margin: 0 10px;
				font-family: $montserrat;
				@media #{$mob-view} {
					font-size: 14px;
				}
				.star {
					margin: 0 5px 0 10px;
				}
				.rating {
					font-weight: 400;
					font-size: 14px;
				}
			}
			.created-date {
				font-size: 12px;
				color: $gray-dark;
				padding-left: 10px;
			}
			.reviews {
				padding-top: 26px;
				.review {
					padding: 20px;
					color: $blue-darkest;
					border-bottom: 1px solid $gray-light;
					@media #{$mob-view} {
						margin: 0 10px;
					}
					&__tour-name {
						font-size: 12px;
						color: $green-main;
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
						.company {
							padding-left: 25px;
						}
					}
					.date {
						font-size: 12px;
						color: $gray-dark;
					}
				}
			}
		}
	}
</style>