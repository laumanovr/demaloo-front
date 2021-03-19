<template>
	<div class="main-container">
		<PreLoader v-if="isLoading"/>
		<div class="main-all-tours">
			<div class="search">
				<div class="search__title">Найди свой тур</div>
				<div class="search__filter">
					<div class="search__form-field location">
						<div class="label">
							<img src="../../assets/icons/compass-icon.svg">
							<span>Локация</span>
						</div>
						<input type="text" placeholder="Начинайте печатать...">
					</div>
					<div class="search__form-field">
						<div class="label">
							<img src="../../assets/icons/calendar.svg">
							<span>Дата</span>
						</div>
						<input type="text" placeholder="Выберите дату">
					</div>
					<div class="search__form-field">
						<div class="label">
							<img src="../../assets/icons/dollar-icon.svg">
							<span>Цена от (сом)</span>
						</div>
						<input type="text" placeholder="Пример: 750">
					</div>
					<div class="search__form-field last">
						<div class="label">
							<img src="../../assets/icons/dollar-icon.svg">
							<span>Цена до (сом)</span>
						</div>
						<input type="text" placeholder="Пример: 3500">
					</div>
					<button type="button" class="search__search-btn">Поиск</button>
				</div>
			</div>

			<div class="tour-content">
				<div class="tour-sort">
					<div class="price-sort-block">
						<span class="sort-item show">Фильтровать</span>
						<span class="sort-item">Самые дешевые</span>
						<span class="sort-item">Самые дорогие</span>
					</div>
					<div class="company-sort-block"></div>
				</div>
				<div class="found-tours">
					<div class="tour-items">
					<div class="tour-item" v-for="tour in tourList" :key="tour._id">
						<div class="tour-item__image">
							<img :src="showPhoto(tour.images[0])">
						</div>
						<div class="tour-item__info">
							<div class="tour-item__date">{{formatDate(tour.date)}}</div>
							<div class="tour-item__company-price">
								<span class="company"><img :src="showPhoto(tour.company.logo)">{{tour.company.name}}</span>
								<span class="price">{{tour.price}} сом</span>
							</div>
							<div class="tour-item__name">{{tour.name.ru}}</div>
							<div class="tour-item__free-place">
								<template v-if="tour.bookingCount > 0">
									Осталось мест: {{tour.bookingCount}}
								</template>
								<template v-else>-</template>
							</div>
							<button class="btn indigo-blue">
								<router-link :to="{name: 'tourDetail', params: {tourId: tour._id}}">
									Подробнее
								</router-link>
							</button>
						</div>
					</div>
					</div>
					<div class="single-center">
						<button class="btn indigo-blue">Показать еще</button>
					</div>
				</div>
			</div>
		</div>

		<div class="banner">
			<img src="../../assets/images/app-bg.png" class="bg">
			<div class="banner__text">
				<div class="banner__title">Скачивайте <br> приложение для <br> большего удобства</div>
				<div class="app-icons">
					<img src="../../assets/images/app-store.svg">
					<img src="../../assets/images/play-market.svg">
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import {TourService} from '@/services/tour.service';
import {format} from 'date-fns';
import PreLoader from '@/components/general/PreLoader';
import {API_BASE_URL} from '@/services/api.service';

export default {
	components: {
		PreLoader
	},
	data() {
		return {
			tourList: [],
			isLoading: false
		};
	},
	created() {
		this.isLoading = true;
		this.getAllTours();
	},
	methods: {
		async getAllTours() {
			try {
				const res = await TourService.fetchAllTours();
				this.tourList = res.data.tours;
				this.isLoading = false;
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},
		showPhoto(imgUrl) {
			return `${API_BASE_URL}/images/` + imgUrl;
		},
		formatDate(date) {
			return format(new Date(date), 'dd.MM.yyyy');
		}
	},
};
</script>

<style lang="scss" scoped>
	.main-container {
		.main-all-tours {
			max-width: 1200px;
			margin: 70px auto;
			.search {
				background: $indigo-blue;
				border-radius: 8px;
				padding: 30px 40px 38px;
				&__title {
					font-size: 14px;
					margin-bottom: 12px;
					color: #fff;
				}
				&__filter {
					display: flex;
					align-items: center;
					justify-content: center;
				}
				&__form-field {
					background: #fff;
					width: 100%;
					max-width: 220px;
					min-width: 140px;
					&:not(:last-child) {
						border-right: 1px solid $gray-dark;
					}
					&.location {
						border-radius: 5px 0 0 5px;
					}
					&.last {
						border-radius: 0 5px 5px 0;
					}
					.label {
						display: flex;
						align-items: center;
						margin: 5px 0 2px;
						img {
							margin: 0 12px;
						}
						span {
							font-size: 12px;
							color: $gray-dark;
						}
					}
					input {
						height: 30px;
						font-size: 14px;
						width: 100%;
						padding-left: 18px;
					}
				}
				&__search-btn {
					background: #fff;
					height: 60px;
					width: 100%;
					max-width: 200px;
					min-width: 100px;
					border-radius: 8px;
					outline: none;
					margin-left: 25px;
				}
			}
			.tour-content {
				display: flex;
				margin-top: 26px;
				.tour-sort {
					min-width: 270px;
					margin-right: 30px;
					.price-sort-block {
						box-shadow: 0 5px 6px #EAEAEA;
						padding: 22px 28px;
						span {
							display: block;
							padding: 10px 0;
							font-size: 16px;
							color: $gray-dark;
							&.show {
								font-size: 14px;
								color: $black-light;
								font-weight: bold;
								text-transform: uppercase;
							}
						}
					}
				}
				.found-tours {
					width: 100%;
					.tour-items {
						display: flex;
						flex-wrap: wrap;
						justify-content: space-between;
						&:after {
							content: '';
							width: 270px;
							display: block;
						}
					}
					.tour-item {
						width: 100%;
						max-width: 270px;
						box-shadow: 0 5px 10.125px rgba(206, 193, 193, 0.4);
						border-radius: 13px;
						margin-bottom: 45px;
						&__image {
							width: 100%;
							max-width: 270px;
							height: 177px;
							img {
								width: 100%;
								height: 100%;
								object-fit: fill;
								border-radius: 13px 13px 0 0;
							}
						}
						&__info {
							padding: 13px;
						}
						&__date {
							font-size: 12px;
							color: $indigo-blue;
							border: 2px solid $indigo-blue;
							border-radius: 5px;
							font-weight: 600;
							display: inline-block;
							padding: 3px 10px;
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
						}
						&__free-place {
							font-size: 16px;
							color: $red-primary;
							text-align: center;
							margin: 8px 0;
						}
						.indigo-blue {
							font-size: 16px;
							height: 48px;
							border-radius: 10px;
						}
					}
					.single-center {
						button {
							height: 48px;
							max-width: 270px;
						}
					}
				}
			}
		}

		.banner {
			max-width: 2000px;
			margin: 0 auto;
			position: relative;
			img.bg {
				width: 100%;
				height: 100%;
			}
			&__text {
				position: absolute;
				top: 50%;
				left: 50px;
				transform: translateY(-50%);
			}
			&__title {
				font-weight: bold;
				font-size: 45px;
				color: #fff;
				margin-bottom: 50px;
			}
			.app-icons {
				display: flex;
				align-items: center;
				img:first-child {
					margin-right: 30px;
				}
			}
		}

	}
</style>
