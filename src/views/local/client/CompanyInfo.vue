<template>
	<div class="client-company-info-container">
		<div class="client-company-info">
			<img src="../../../assets/icons/arrow-dark.svg" @click="$router.go(-1)" class="back"/>
			<PreLoader v-if="isLoading"/>
			<div class="company__description">
				<div class="flex top justify-space-between flex-wrap">
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
					<div class="right">
						<!--<div class="chat-btn flex align-center">-->
							<!--<img src="../../assets/icons/envelope-dark.png">-->
							<!--<span>Написать</span>-->
						<!--</div>-->
					</div>
				</div>
				<div class="flex bottom flex-wrap">
					<div class="desc">
						{{currentCompany.description}}
					</div>
					<div class="count">
						<div class="item"><span>{{$t('companyInfo.upcomingTours')}}:</span> <span>{{activeToursCount}}</span></div>
						<div class="item"><span>{{$t('companyInfo.pastTours')}}:</span> <span>{{pastToursCount}}</span></div>
					</div>
				</div>
			</div>

			<div class="company__review">
				<div class="review-title flex justify-space-between">
					<div class="flex align-center">
						<span class="top-title">{{$t('companyInfo.reviews')}} ({{currentCompany.reviewCount}})</span>
						<!--<div class="rating flex align-center">-->
							<!--<img src="../../assets/icons/rating-icon.svg">-->
							<!--<span>{{currentCompany.rating}}</span>-->
						<!--</div>-->
					</div>
					<router-link
						:to="{name: 'companyInfoReviews', params: {companyId: $route.params.companyId}}"
						class="see-all"
					>
						{{$t('companyInfo.showAll')}}
					</router-link>
				</div>
				<div class="reviews">
					<div class="review" v-for="review in allCompanyReviews" :key="review._id">
						<div class="review__company">
							<img
								:src="showCustomerPhoto(review.customer.photo)"
								@error="$event.target.src = require('@/assets/icons/profile-tab.svg')"
							>
							<div class="right">
								<div class="name">{{review.customer.name}}</div>
								<div class="date">{{formatDate(review.tour.date)}}</div>
							</div>
						</div>
						<div class="review__rating">
							<img src="../../../assets/icons/rating-icon.svg" v-for="i in review.rating" :key="i">
						</div>
						<div class="review__comment">
							{{review.messages[0].message}}
						</div>
					</div>
				</div>
			</div>

			<div class="other-tours">
				<div class="current-company-name">
					{{$t('companyInfo.allTours')}}
				</div>
				<div class="tour-items">
					<div class="tour-item" v-for="tour in companyTours" :key="tour._id" @click="openTourFromOther(tour._id)">
						<div class="tour-img"><img :src="showTourImage(tour.images[0])" v-if="tour.images"></div>
						<div class="tour-name">{{tour.name.ru}}</div>
						<div class="company-info flex align-center">
							<img :src="showCompanyImage(tour.company.logo)" class="company">
							<span class="company-name">{{tour.company.name}}</span>
							<div class="rating flex">
								<img src="../../../assets/icons/rating-icon.svg">
								<span>{{tour.company.rating}} ({{tour.company.reviewCount}})</span>
							</div>
						</div>
						<div class="tour-desc">
							{{tour.description.ru}}
						</div>
						<div class="date-price flex align-center justify-space-between">
							<div class="date" v-html="formatDate(tour.date)"></div>
							<span class="price">{{tour.price}} {{$t('tourBooking.som')}}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import {UserService} from '../../../services/user.service';
import {AWS_IMAGE_URL} from '../../../services/api.service';
import {ReviewService} from '../../../services/review.service';
import {TourService} from '../../../services/tour.service';
import {format} from 'date-fns';

export default {
	components: {
	},
	data() {
		return {
			isLoading: false,
			currentCompany: {},
			allCompanyReviews: [],
			companyTours: [],
			activeToursCount: 0,
			pastToursCount: 0,
			todayDate: format(new Date(), 'yyyy-MM-dd')
		};
	},
	async created() {
		this.isLoading = true;
		await this.getCompanyInfo(this.$route.params.companyId);
		await this.getCompanyAllReviews();
		await this.getCompanyTours();
	},
	methods: {
		async getCompanyInfo(companyId) {
			try {
				const res = await UserService.fetchCompanyById(companyId);
				this.currentCompany = res.data.company;
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		async getCompanyAllReviews() {
			try {
				const res = await ReviewService.fetchCompanyReviews(this.$route.params.companyId, 4);
				this.allCompanyReviews = res.data.reviews;
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		async getCompanyTours() {
			try {
				const query = `&company=${this.$route.params.companyId}&date[gt]=${this.todayDate}`;
				const res = await TourService.fetchAllTours(query);
				this.companyTours = res.data.tours;
				this.activeToursCount = res.results;
				const pastQuery = `&company=${this.$route.params.companyId}&date[lt]=${this.todayDate}`;
				const pastRes = await TourService.fetchAllTours(pastQuery);
				this.pastToursCount = pastRes.results;
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

		openTourFromOther(tourId) {
			this.$router.push({name: 'tourDetail', params: {tourId: tourId}});
		},

		showTourImage(imageLink) {
			return `${AWS_IMAGE_URL}/images/` + imageLink + '?w=800';
		},

		showCompanyImage(imageLink) {
			if (imageLink) {
				return `${AWS_IMAGE_URL}/logos/` + imageLink;
			}
		},
	}

};
</script>

<style lang="scss" scoped>
	.client-company-info-container {
		background: #f5f5f5;
		padding-bottom: 20px;
		.client-company-info {
			max-width: 1200px;
			margin: 0 auto;
			padding-top: 25px;
			.back {
				cursor: pointer;
				padding: 0 0 20px 20px;
			}
			.company {
				&__description {
					background: #fff;
					padding: 25px;
					color: $blue-darkest;
					border-radius: 7px;
					.top {
						border-bottom: 1px solid $gray-light;
						padding-bottom: 15px;
					}
					.company-info {
						@media #{$mob-view} {
							width: 95%;
						}
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
					.right {
						@media #{$mob-view} {
							margin-top: 15px;
						}
						img {
							width: 18px;
							height: 15px;
							margin-right: 10px;
						}
						span {
							font-size: 14px;
							color: $blue-darkest;
						}
					}
					.bottom {
						padding-top: 18px;
						.desc {
							width: 65%;
							font-size: 14px;
							min-width: 300px;
						}
						.count {
							width: 35%;
							padding-left: 50px;
							@media #{$mob-view} {
								padding: 10px 0 0 0;
								margin-top: 10px;
								border-top: 1px solid $gray-light;
								width: 100%;
							}
							.item {
								font-size: 14px;
								display: flex;
								span {
									display: inline-block;
									white-space: nowrap;
									&:first-child {
										padding-right: 10px;
										width: 50%;
									}
									&:last-child {
										font-weight: 600;
										text-align: left;
										padding-left: 10px;
										width: 40%;
									}
									@media #{$mob-view} {
										width: auto !important;
									}
								}
							}
						}
					}
				}

				&__review {
					color: $blue-darkest;
					background: #fff;
					border-radius: 7px;
					margin-top: 25px;
					padding: 25px;
					.review-title {
						.top-title {
							font-weight: bold;
							font-size: 18px;
							font-family: $montserrat;
							margin-right: 10px;
						}
						.see-all {
							font-weight: 600;
							font-size: 14px;
						}
						.rating {
							img {
								margin-right: 5px;
							}
						}
					}
					.reviews {
						display: flex;
						flex-wrap: wrap;
						@media #{$mob-view} {
							max-height: 150px;
							overflow-y: hidden;
						}
						.review {
							max-width: 260px;
							width: 100%;
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
								max-height: 90px;
								overflow-y: hidden;
							}
						}
					}

				}
			}
		}
		.other-tours {
			background: #fff;
			margin-top: 25px;
			border-radius: 7px;
			.current-company-name {
				font-weight: bold;
				font-size: 18px;
				color: $blue-darkest;
				padding: 15px 25px;
			}
			.tour-items {
				display: flex;
				flex-wrap: wrap;
				padding: 0 25px;
				@media #{$mob-view} {
					justify-content: space-evenly;
				}
				.tour-item {
					color: $blue-darkest;
					max-width: 260px;
					margin-bottom: 25px;
					border-radius: 7px;
					cursor: pointer;
					&:not(:last-child) {
						margin-right: 25px;
					}
					@media #{$mob-view} {
						margin: 0 0 30px 0 !important;
						box-shadow: 0 0 24px 0 rgb(0 0 0 / 20%);
						padding: 10px;
						max-width: 280px;
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
					.company-info {
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
						}
						.rating {
							font-weight: normal;
							margin-left: 10px;
							span {
								margin-left: 3px;
							}
						}
					}
				}
			}
		}
	}
</style>


