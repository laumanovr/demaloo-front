<template>
	<div class="favorite-tours-container">
		<PreLoader v-if="isLoading"/>
		<div class="mob-profile-head head-title mob">
			<img src="../../../assets/icons/arrow-dark.svg" @click="$router.push('/mobile-profile')"/>
			<span>{{$t('favoriteTours')}}</span>
		</div>
		<div class="tour-items" v-if="favoriteTours.length">
			<div
				class="tour-item"
				v-for="tour in favoriteTours" :key="tour._id"
				@click="openOrRemoveFavoriteTour($event, tour._id)"
			>
				<div class="tour-img">
					<img :src="showTourPhoto(tour.images[0])" class="main">
					<img src="../../../assets/icons/red-heart.svg" class="heart">
				</div>
				<div class="tour-item-info">
					<div class="tour-name">{{tour.name.ru}}</div>
					<div class="company-info d-flex align-center">
						<img :src="showCompanyPhoto(tour.company.logo)" class="company">
						<span class="company-name">{{tour.company.name}}</span>
						<div class="rating d-flex">
							<img src="../../../assets/icons/rating-icon.svg">
							<span>{{tour.company.rating}} ({{tour.company.reviewCount}})</span>
						</div>
					</div>
					<div class="tour-desc">
						{{tour.description.ru}}
					</div>
					<div class="free-place">
						<template v-if="tour.bookingCount > 0">
							{{$t('tourBooking.remainPlace')}}: {{tour.bookingCount}}
						</template>
					</div>
					<div class="date-price d-flex align-center justify-space-between">
						<div class="date" v-html="formatDate(tour.date)"></div>
						<span class="price">{{tour.price}} {{$t('tourBooking.som')}}</span>
					</div>
				</div>
			</div>
		</div>
		<div class="empty" v-else>{{$t('empty')}}</div>
	</div>
</template>

<script>
import {TourService} from '../../../services/tour.service';
import {AWS_IMAGE_URL} from '@/services/api.service';
import {mapState} from 'vuex';
import {format} from 'date-fns';
import {ru} from 'date-fns/locale';

export default {
	components: {
	},
	data() {
		return {
			isLoading: false
		};
	},
	computed: {
		...mapState('favorite', ['favoriteTours', 'onSuccess', 'onError']),
	},
	created() {
		this.isLoading = true;
		this.$store.dispatch('favorite/getAllFavoriteTours');
	},
	methods: {
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

		async openOrRemoveFavoriteTour(e, tourId) {
			if (e.target.className === 'heart') {
				try {
					this.isLoading = true;
					await TourService.deleteFavoriteTour(tourId);
					this.$store.dispatch('favorite/getAllFavoriteTours');
				} catch (err) {
					this.$toast.error(err);
					this.isLoading = false;
				}
			} else {
				this.$router.push({name: 'tourDetail', params: {tourId: tourId}});
			}
		},
	},
	watch: {
		onSuccess(msg) {
			if (msg) {
				this.$store.state.favorite.onSuccess = '';
				this.isLoading = false;
			}
		},
		onError(msg) {
			if (msg) {
				this.$toast.error(msg);
				this.isLoading = false;
				this.$store.state.favorite.onError = '';
			}
		}
	}
};
</script>

<style lang="scss" scoped>
	.favorite-tours-container {
		padding-top: 26px;
		@media #{$mob-view} {
			padding: 0;
		}
		.tour-items {
			display: flex;
			flex-wrap: wrap;
			@media #{$mob-view} {
				justify-content: space-evenly;
				padding-top: 25px;
				background: #f5f5f5;
			}
			.tour-item {
				color: $blue-darkest;
				max-width: 273px;
				margin-bottom: 25px;
				border-radius: 7px;
				cursor: pointer;
				margin-right: 25px;
				&:hover {
					transform: scale(1.01);
				}
				@media #{$mob-view} {
					background: #fff;
					margin-right: 0;
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
					position: relative;
					img.main {
						width: 100%;
						height: 100%;
						object-fit: cover;
						border-radius: 7px;
						@media #{$mob-view} {
							border-radius: 7px 7px 0 0;
						}
					}
					img.heart {
						position: absolute;
						top: 10px;
						right: 15px;
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
				.free-place {
					text-align: right;
					font-size: 14px;
					color: $red-primary;
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
				.btn {
					height: 45px;
					text-transform: none;
					@media #{$mob-view} {
						margin-top: 5px;
					}
				}
			}
		}
		.empty {
			text-align: center;
			color: $blue-darkest;
		}
	}
</style>