<template>
	<div class="tour-detail__container">
		<PreLoader v-if="isLoading"/>
		<template v-if="hasTour">
		<h3 class="tour-detail__title">{{tourDetail.name.ru}}</h3>
		<div class="tour-detail__images">
			<div class="selected-image"><img :src="mainImgUrl"></div>
			<div class="preview-images">
				<span v-for="(image, i) in tourDetail.images" :key="i" @click="changeImage(image)">
					<img :src="showImage(image)">
				</span>
			</div>
		</div>

		<div class="tour-detail__content">
			<div class="tour-detail__info">
				<div class="tour-detail__company-name">{{tourDetail.company.name}}</div>
				<div class="tour-detail__description">{{tourDetail.description.ru}}</div>

				<div class="tour-detail__about">
					<div class="head-title detail">О туре</div>
					<div class="item">
						<span class="info-label">Дата:</span>
						<span class="info-value">{{tourDetail.date}}</span>
					</div>
					<div class="item">
						<span class="info-label">Длительность:</span>
						<span class="info-value">{{tourDetail.duration}} дней</span>
					</div>
					<div class="item">
						<span class="info-label">Количество участников:</span>
						<span class="info-value">{{tourDetail.peopleCount}} человек</span>
					</div>
					<div class="item">
						<span class="info-label">Дистанция:</span>
						<span class="info-value">{{tourDetail.distance}} км</span>
					</div>
					<div class="item">
						<span class="info-label">Место сбора:</span>
						<span class="info-value">{{tourDetail.meetingPoint.ru}}</span>
					</div>
					<div class="item">
						<span class="info-label">Время сбора:</span>
						<span class="info-value">{{tourDetail.meetingTime}}</span>
					</div>
				</div>

				<div class="tour-detail__include-add">
					<div class="head-title detail">Включено</div>
					<div class="item" v-for="(item, i) in tourDetail.includedInCost" :key="i">
						<img src="../../assets/icons/flag-icon.svg">
						<span>{{ item.ru }}</span>
					</div>
				</div>

				<div class="tour-detail__include-add">
					<div class="head-title detail">Взять с собой</div>
					<div class="item" v-for="(item, i) in tourDetail.notIncludedInCost" :key="i">
						<img src="../../assets/icons/flag-icon.svg">
						<span>{{ item.ru }}</span>
					</div>
				</div>

				<div class="tour-detail__include-add">
					<div class="head-title detail">Дополнительно</div>
					<div class="item" v-for="(item, i) in tourDetail.additional" :key="i">
						<img src="../../assets/icons/flag-icon.svg">
						<span>{{ item.ru }}</span>
					</div>
				</div>
			</div>
			<div class="tour-detail__right">
			<div class="tour-detail__price">
				<div class="price-person">
					<span class="price">{{tourDetail.price}} сом</span>
					<span class="person"> / за человека</span>
				</div>
				<div class="date-rest">
					<span class="tour-date">{{tourDetail.date}}</span>
					<span class="rest-days">До тура дней: {{countRestDays()}}</span>
				</div>
				<div class="rest-place">
					<template v-if="tourDetail.bookingCount > 0">Осталось мест: {{tourDetail.bookingCount}}</template>
					<template v-else>-</template>
				</div>
				<button
					class="btn indigo-blue reserve"
					@click="goToReservePage"
				>
					Бронировать
				</button>
			</div>
			</div>
		</div>
		</template>
	</div>
</template>

<script>
import {TourService} from '@/services/tour.service';
import PreLoader from '@/components/general/PreLoader';
import {API_BASE_URL} from '@/services/api.service';

export default {
	components: {
		PreLoader
	},
	data() {
		return {
			isLoading: false,
			mainImgUrl: '',
			tourDetail: {}
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
				this.mainImgUrl = this.showImage(this.tourDetail.images[0]);
				this.isLoading = false;
			} catch(err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		showImage(imageLink) {
			return `${API_BASE_URL}/images/` + imageLink;
		},

		countRestDays() {
			const futureDate = new Date(this.tourDetail.date);
			const today = new Date();
			return Math.round((futureDate - today) / (1000*60*60*24));
		},

		changeImage(imageUrl) {
			this.mainImgUrl = this.showImage(imageUrl);
		},

		goToReservePage() {
			if (this.userLogged) {
				this.$router.push({name: 'tourReservePayment', params: {tourId: this.tourDetail._id}});
			} else {
				this.$router.push('/login');
			}
		}
	}
};
</script>

<style lang="scss">
.tour-detail {
	&__container {
		padding: 50px 0 20px;
		max-width: 1200px;
		margin: 0 auto;
		.head-title.detail {
			font-weight: 700;
			margin: 40px 0 15px;
		}
	}
	&__title {
		font-size: 36px;
		font-weight: 700;
		color: $black-light;
		margin-bottom: 50px;
	}
	&__images {
		max-width: 750px;
		.selected-image {
			width: 750px;
			height: 400px;
			margin-bottom: 15px;
			border: 1px solid $gray-light;
			border-radius: 4px;
			img {
				width: 100%;
				height: 100%;
				border-radius: 4px;
				object-fit: fill;
			}
		}
		.preview-images {
			display: flex;
			align-items: center;
			span {
				width: 70px;
				height: 70px;
				border: 1px solid $gray-light;
				border-radius: 4px;
				margin-right: 10px;
				cursor: pointer;
				img {
					width: 100%;
					height: 100%;
					border-radius: 4px;
					object-fit: contain;
				}
			}
		}
	}

	&__content {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-top: 100px;
	}
	&__info {
		width: 100%;
		max-width: 670px;
	}
	&__company-name {
		font-size: 18px;
		color: $green-primary;
		margin-bottom: 15px;
	}
	&__description {
		font-size: 18px;
		color: $black-light;
	}
	&__about {
		margin-top: 45px;
		.item {
			margin-bottom: 15px;
			display: flex;
		}
		.info-label {
			font-size: 18px;
			font-weight: 700;
			min-width: 40%;
		}
		.info-value {
			font-size: 18px;
			font-weight: 500;
		}
	}
	&__include-add {
		.item {
			display: flex;
			align-items: center;
			margin-bottom: 10px;
			img {
				margin-right: 15px;
			}
			span {
				font-size: 18px;
				font-weight: 500;
			}
		}
	}

	&__right {
		position: relative;
		width: 100%;
		max-width: 330px;
		min-height: 66vw;
	}
	&__price {
		box-shadow: 0 3px 6px rgba(206, 193, 193, 0.4);
		border: 1px solid $gray-light;
		border-radius: 4px;
		padding: 25px;
		position: sticky;
		top: 0;
		.price-person {
			margin-bottom: 22px;
			.price {
				font-size: 24px;
				font-weight: 700;
			}
			.person {
				font-size: 18px;
			}
		}
		.date-rest {
			display: flex;
			align-items: center;
			justify-content: space-between;
			.tour-date {
				font-size: 18px;
				font-weight: 600;
				color: $indigo-blue;
			}
			.rest-days {
				font-size: 12px;
				color: $black-light;
			}
		}
		.rest-place {
			font-size: 12px;
			font-weight: 700;
			color: $red-primary;
		}
		.reserve {
			height: 44px;
			margin-top: 25px;
		}
	}

}
</style>