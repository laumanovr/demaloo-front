<template>
	<div class="tour-reserve-payment wdt-1200">
		<PreLoader v-if="isLoading"/>
		<template v-if="hasTour">
		<div class="company-name">{{tourDetail.company.name}}</div>
		<div class="head-title">{{tourDetail.name.ru}}</div>

		<div class="tour-detail__about">
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
			<div class="item">
				<span class="info-label">Итого стоимость:</span>
				<span class="info-value">{{totalPrice}} сом</span>
			</div>
			<div class="item">
				<span class="info-label">Кол-во бронируемых мест:</span>
				<div class="info-value counter">
					<img src="../../assets/icons/circle-minus.svg" @click="addSubtractQuantity('minus')">
					<span>{{payOrReserve.count}}</span>
					<img src="../../assets/icons/circle-plus.svg" @click="addSubtractQuantity('add')">
				</div>
			</div>
		</div>

		<div class="cancel-rule">
			<span>Правила отмены</span>
			<div class="rule-desc">Если гость отменяет бронирование менее чем за 2 дня до начала тура, оплата не возвращается.</div>
		</div>

		<div class="btn-actions">
			<button
				class="btn indigo-blue"
				@click="makePaymentForTour"
			>
				Оплатить
			</button>
			<button
				class="btn blue-primary"
				:class="{'disabled': !isReservable}"
				@click="toggleReserveModal"
				:disabled="!isReservable"
			>
				Забронировать
			</button>
		</div>

		<!--RESERVE MODAL-->
		<modal name="reserve-modal" height="auto">
			<div class="modal-container">
				<template v-if="reserveMode == 'initial'">
					<div class="warn-img"><img src="../../assets/icons/warning-icon.svg"></div>
					<div class="warn-title">
						Пожалуйста, не забудьте оплатить. <br> По истечении 12 часов ваша бронь обнуляется.
					</div>
					<div class="single-center">
						<button class="btn indigo-blue" @click="reserveTour">Забронировать</button>
					</div>
				</template>
				<template v-else>
					<div class="reserve-complete">
					<div class="head-title">Успешно забронировано!</div>
					<img src="../../assets/icons/checked-icon.svg">
					</div>
				</template>
			</div>
		</modal>
		</template>
	</div>
</template>

<script>
import {TourService} from '@/services/tour.service';
import PreLoader from '@/components/general/PreLoader';

export default {
	components: {
		PreLoader
	},
	data() {
		return {
			isLoading: false,
			tourDetail: {},
			totalPrice: 0,
			reserveMode: 'initial',
			isReservable: true,
			payOrReserve: {
				count: 1,
				tourId: ''
			}
		};
	},
	computed: {
		hasTour() {
			return Object.values(this.tourDetail).length > 0;
		}
	},
	created() {
		this.isLoading = true;
		this.getSelectedTourDetail(this.$route.params.tourId);
		this.payOrReserve.tourId = this.$route.params.tourId;
	},
	methods: {
		async getSelectedTourDetail(tourId) {
			try {
				const res = await TourService.fetchClientTourDetail(tourId);
				this.tourDetail = res.data.tour;
				this.totalPrice = this.tourDetail.price;
				this.checkIsReservable();
				this.isLoading = false;
			} catch(err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		checkIsReservable() {
			const futureDate = new Date(this.tourDetail.date);
			const today = new Date();
			const dayNum = Math.round((futureDate - today) / (1000*60*60*24));
			this.isReservable = dayNum > 2;
		},

		addSubtractQuantity(type) {
			if (type === 'add') {
				this.payOrReserve.count += 1;
			} else if (type === 'minus' && this.payOrReserve.count > 1) {
				this.payOrReserve.count -= 1;
			}
			this.totalPrice = (this.tourDetail.price * this.payOrReserve.count);
		},

		async makePaymentForTour() {
			this.isLoading = true;
			try {
				const res = await TourService.paymentForTour(this.payOrReserve);
				window.location.href = res.data.response.pg_redirect_url;
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		toggleReserveModal() {
			this.$modal.toggle('reserve-modal');
		},

		async reserveTour() {
			this.isLoading = true;
			try {
				await TourService.reservationForTour(this.payOrReserve);
				this.reserveMode = 'complete';
				this.isLoading = false;
				setTimeout(() => {
					this.$router.push('/');
				}, 2500);
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.tour-reserve-payment {
	.company-name {
		font-size: 18px;
		color: $green-primary;
		margin-bottom: 15px;
	}
	.tour-detail__about {
		.item {
			margin-bottom: 15px;
			display: flex;
		}
		.info-label {
			font-size: 18px;
			font-weight: 700;
			min-width: 25%;
		}
		.info-value {
			font-size: 18px;
			font-weight: 500;
			&.counter {
				display: flex;
				align-items: center;
				img {
					cursor: pointer;
				}
				span {
					margin: 0 10px;
				}
			}
		}
	}
	.cancel-rule {
		margin-top: 30px;
		max-width: 370px;
		span {
			font-size: 15px;
			font-weight: 700;
		}
		.rule-desc {
			font-size: 14px;
		}
	}
	.btn-actions {
		max-width: 540px;
		margin: 50px 0 20px;
	}
	.warn-img {
		text-align: center;
	}
	.warn-title {
		justify-content: center;
		text-align: center;
		font-size: 20px;
	}
	.single-center {
		.btn {
			max-width: 300px;
		}
	}
	.reserve-complete {
		text-align: center;
		max-width: 350px;
		margin: 0 auto;
	}
	.disabled {
		opacity: 0.5;
	}
}
</style>