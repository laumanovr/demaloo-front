<template>
	<div class="my-tours-container">
		<PreLoader v-if="isLoading"/>
		<div class="tour-tabs">
			<div class="tab active">Предстоящие</div>
			<div class="tab">Прошедшие</div>
		</div>

		<div class="my-tours-content">
			<div class="tour-item" v-for="book in myTourBookings" :key="book._id">
				<div class="tour-item__image">
					<img :src="showImage(book.tour.images[0])">
				</div>
				<div class="tour-item__info">
					<div class="tour-item__date-block">
						<span class="date">{{formatDate(book.date)}}</span>
						<span class="status" :class="[getLastStage(book.stages).status]">
							{{statuses[getLastStage(book.stages).status]}}
						</span>
					</div>
					<div class="tour-item__company-price">
						<span class="company"><img :src="showImage(book.tour.company.logo)">{{book.tour.company.name}}</span>
						<span class="price">{{book.total}} сом</span>
					</div>
					<div class="tour-item__name">{{book.tour.name.ru}}</div>
					<!--<button type="button" class="btn indigo-blue">-->
						<!--&lt;!&ndash;<router-link to="/">&ndash;&gt;-->
							<!--Подробнее-->
						<!--&lt;!&ndash;</router-link>&ndash;&gt;-->
					<!--</button>-->
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import {TourService} from '@/services/tour.service';
import PreLoader from '@/components/general/PreLoader';
import {format} from 'date-fns';
import {API_BASE_URL} from '@/services/api.service';

export default {
	components: {
		PreLoader
	},
	data() {
		return {
			statuses: {
				RESERVED: 'Забронирован',
				PAID: 'Оплачено',
				CANCELLED: 'Отменен',
				ADDED: 'Добавлен'
			},
			isLoading: false,
			myTourBookings: [],
			todayDate: format(new Date(), 'yyyy-MM-dd')
		};
	},
	created() {
		this.getFutureBookings();
	},
	methods: {
		async getFutureBookings() {
			try {
				this.isLoading = true;
				const res = await TourService.fetchMyTourBookings(`&date[gte]=${this.todayDate}`);
				this.myTourBookings = res.data.bookings;
				this.isLoading = false;
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		showImage(imgUrl) {
			return `${API_BASE_URL}/images/` + imgUrl;
		},

		getLastStage(stages) {
			return stages[stages.length - 1];
		},

		formatDate(date) {
			return format(new Date(date), 'dd.MM.yyyy');
		}
	}
};
</script>

<style lang="scss" scoped>
	.my-tours-container {
		.tour-tabs {
			display: flex;
			align-items: center;
			.tab {
				font-size: 17px;
				color: $black-light;
				padding: 0 25px 15px;
				border-bottom: 3px solid $gray-light;
				cursor: pointer;
				&.active {
					border-bottom: 3px solid $indigo-blue;
					font-weight: bold;
					cursor: default;
				}
			}
		}
		.my-tours-content {
			display: flex;
			flex-wrap: wrap;
			margin-top: 50px;
			.tour-item {
				width: 100%;
				max-width: 350px;
				border-radius: 13px;
				margin: 0 50px 45px 0;
				box-shadow: 0 0 15px 0 rgba(0,0,0,0.3);
				&__image {
					width: 100%;
					max-width: 350px;
					height: 120px;
					img {
						width: 100%;
						height: 100%;
						object-fit: cover;
						border-radius: 13px 13px 0 0;
					}
				}
				&__info {
					padding: 13px;
				}
				&__date-block {
					display: flex;
					align-items: center;
					justify-content: space-between;
					.date {
						font-size: 12px;
						color: $indigo-blue;
						border: 2px solid $indigo-blue;
						border-radius: 5px;
						font-weight: 600;
						display: inline-block;
						padding: 3px 10px;
					}
					.status {
						font-size: 14px;
						font-weight: 600;
						&.RESERVED {
							color: $orange-primary;
						}
						&.PAID {
							color: $green-primary;
						}
						&.CANCELLED {
							color: $red-primary;
						}
					}
				}
				&__company-price {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin: 8px 0 5px;
					.company {
						font-size: 15px;
						width: 60%;
						white-space: nowrap;
						overflow-x: hidden;
						text-overflow: ellipsis;
						display: flex;
						img {
							width: 18px;
							height: 18px;
							object-fit: cover;
							margin-right: 5px;
							border: 1px solid $gray-light;
							border-radius: 4px;
						}
					}
					.price {
						font-size: 20px;
						font-weight: bold;
						color: $indigo-blue;
					}
				}
				&__name {
					font-size: 20px;
					height: 60px;
					overflow: hidden;
					margin-bottom: 15px;
				}
				.indigo-blue {
					font-size: 16px;
					height: 48px;
					border-radius: 10px;
				}
			}
		}
	}
</style>