<template>
	<div class="main-container">
		<PreLoader v-if="isLoading"/>
		<div class="main-top-bg web">
			<img src="https://sites.google.com/site/prirodanasevseegooglgfgf/_/rsrc/1463456237313/home/priroda_gory_nebo_ozero_oblaka_81150_1920x1080.jpg">
			<div class="bg-text">
				<div class="bg-text__block">
					<div class="bg-text__top">Начало незабываемого отдыха</div>
					<div class="bg-text__bottom">Найдите самый подходящий тур среди 1,200 туров.</div>
				</div>
			</div>
		</div>
		<div class="main-all-tours">
			<div class="search" :class="{'mob-search': showMobSearch}">
				<div class="search__filter">
					<div class="search__form-field location">
						<img src="../../assets/icons/marker-green.svg">
						<div class="label">
							<span>Локация</span>
							<input
								type="text"
								placeholder="Начинайте печатать..."
								v-model="searchObj.inputValue"
								@input="autoCompleteLocation"
							>
						</div>
						<div class="drop-down-result" v-if="searchLocations.length">
							<div
								class="found-item"
								v-for="(item, i) in searchLocations" :key="i"
								@click="onSelectFoundPlace(item)"
							>
								<span class="name">{{item.name}}</span>
								<span class="type">{{placeType[item.type]}}</span>
							</div>
						</div>
						<div class="not-found drop-down-result" v-if="noResult">Ничего не найдено</div>
					</div>
					<div class="search__form-field date">
						<img src="../../assets/icons/calendar-green.svg">
						<div class="label">
							<span>Дата</span>
								<v-menu
									v-model="showDatePicker"
									:close-on-content-click="true"
									:nudge-right="40"
									transition="scale-transition"
									offset-y
									min-width="290px"
								>
									<template v-slot:activator="{ on, attrs }">
										<input
											placeholder="Выберите дату"
											type="text"
											readonly
											v-model="searchObj.date"
											v-bind="attrs"
											v-on="on"
										>
									</template>
									<v-date-picker
										locale="ru-RU"
										v-model="pickerDate"
										:min="todayDate"
										@input="onChangeSearchDate"
									/>
								</v-menu>
						</div>
					</div>
					<button class="btn green-main" @click="submitSearchTours">Найти</button>
				</div>
				<div class="hint web"><span>Пример:</span><span>Каракол</span></div>
			</div>

			<div class="tour-content">
				<div class="filter-sidebar web">
					<div class="filter-item">
						<span class="label">Тур компания</span>
						<v-select
							solo
							label="Выбрать"
							class="border no-detail"
							:items="allCompanies"
							item-text="name"
							item-value="_id"
							v-model="sortCompany"
							@change="filterBySidebar"
						/>
					</div>
					<div class="filter-item">
						<span class="label">Длительность (дней)</span>
						<v-select
							solo
							label="Выбрать"
							class="border no-detail"
							:items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
							v-model="sortDuration"
							@change="filterBySidebar"
						/>
					</div>
					<div class="filter-item">
						<span class="label">Категории</span>
						<div class="check-boxes">
							<label class="box" v-for="(item, i) in categories" :key="i" :for="item.id">
								<input :id="item.id" type="checkbox" @change="selectCategory($event, item)">
								<span>{{item.ru}}</span>
							</label>
						</div>
					</div>
					<div class="filter-item">
						<span class="label">Цена (сом)</span>
						<div class="set-price">
							<v-text-field
								outlined
								label="От"
								class="no-detail from"
								type="number"
								v-model="sortPriceFrom"
								@input="selectPrice"
							/>
							<v-text-field
								outlined
								label="До"
								class="no-detail to"
								type="number"
								v-model="sortPriceTo"
								@input="selectPrice"
							/>
						</div>
					</div>
				</div>
				<div class="found-tours">
					<div class="sort-price-chip web">
						<div class="chips">
							<div class="chip" v-for="chip in sortCategories" :key="chip.id">{{chip.ru}}</div>
						</div>
						<v-select
							solo
							label="Сортировка"
							class="v-select-item border no-detail"
							:items="sortItems"
							item-text="title"
							item-value="type"
							@change="sortByPrice"
						/>
					</div>
					<div class="tour-items">
						<router-link
							:to="{name: 'tourDetail', params: {tourId: tour._id}}"
							v-for="tour in tourList"
							:key="tour._id"
							class="tour-item"
						>
							<div class="tour-item__image">
								<img :src="showPhoto(tour.images[0])" v-if="tour.images">
								<img src="../../assets/images/no-image.png" v-else>
							</div>
							<div class="tour-item__info">
								<div class="tour-item__name">{{tour.name.ru}}</div>

								<div class="tour-item__right">
									<div class="tour-item__desc-block">
										<div class="tour-item__company">
											<img :src="showPhoto(tour.company.logo)">
											{{tour.company.name}}
											<div class="rating">
												<img src="../../assets/icons/rating-icon.svg">
												<span>{{tour.company.rating}}</span>
											</div>
										</div>
										<div class="tour-item__description">
											{{tour.description.ru}}
										</div>
										<div class="tour-item__date">
											<span class="web">Дата тура:</span>
											<div class="format-date" v-html="formatDate(tour.date)"></div>
										</div>
									</div>
									<div class="tour-item__price-block">
										<div class="tour-item__free-place">
											<template v-if="tour.bookingCount > 0">
												Осталось мест: {{tour.bookingCount}}
											</template>
										</div>
										<span class="tour-item__price">{{tour.price}} сом</span>
									</div>
								</div>
							</div>
						</router-link>
					</div>
					<div class="single-center">
						<button class="btn green-main" v-if="tourList.length" @click="showMore">
							Показать еще
						</button>
						<h2 v-if="!tourList.length">Ничего не найдено</h2>
					</div>
				</div>
			</div>
		</div>

		<div class="banner">
			<img src="../../assets/images/app-bg.jpg" class="bg">
			<div class="banner__text">
				<div class="banner__title">Скачивайте приложение <br> для мобильных устройств</div>
				<div class="app-icons web">
					<img src="../../assets/images/app-store.png">
					<img src="../../assets/images/play-market.png">
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import {TourService} from '@/services/tour.service';
import {format} from 'date-fns';
import {ru} from 'date-fns/locale';
import PreLoader from '@/components/general/PreLoader';
import {API_BASE_URL} from '@/services/api.service';
import {CategoryService} from '@/services/category.service';
import {UserService} from '@/services/user.service';
import {LocationService} from '@/services/location.service';
import {CustomEventEmitter} from '@/utils/customEventEmitter';

export default {
	components: {
		PreLoader
	},
	data() {
		return {
			isLoading: false,
			tourList: [],
			categories: [],
			allCompanies: [],
			sortItems: [
				{title: 'По цене', type: 'price'},
				{title: 'По дате', type: 'date'},
			],
			showDatePicker: false,
			pickerDate: '',
			todayDate: format(new Date(), 'yyyy-MM-dd'),
			searchObj: {
				inputValue: '',
				date: ''
			},
			placeType: {
				oblast: 'Область',
				region: 'Район',
				place: 'Место'
			},
			noResult: false,
			searchLocations: [],
			queryParam: '',
			sortCompany: '',
			sortDuration: '',
			categoriesQuery: '',
			sortCategories: [],
			sortPriceFrom: '',
			sortPriceTo: '',
			sortPage: 1,
			typingTimer: null,
			locationTimer: null,
			showMobSearch: false
		};
	},
	created() {
		this.isLoading = true;
		this.getAllCompanies();
		this.getAllTours();
		this.getAllCategories();
		this.onMobileSearch();
	},
	methods: {
		async autoCompleteLocation(e) {
			clearTimeout(this.locationTimer);
			this.locationTimer = setTimeout(() => {
				LocationService.searchPlace(e.target.value).then((res) => {
					this.searchLocations = res.data.locations;
					this.noResult = !this.searchLocations.length;
				}).catch((err) => {
					this.$toast.error(err);
				});
			}, 900);
		},
		onSelectFoundPlace(item) {
			this.searchObj.inputValue = item.name;
			this.searchLocations = [];
		},
		submitSearchTours() {
			this.sortCompany = '';
			this.sortDuration = '';
			this.sortCategories = [];
			const place = this.searchObj.inputValue ? `&search=${this.searchObj.inputValue}` : '';
			const date = this.pickerDate ? `&date[gte]=${this.pickerDate}` : '';
			this.queryParam = `${place || ''}${date || ''}`;
			this.getAllTours();
		},

		sortByPrice(sortType) {
			this.queryParam = `&sort=${sortType}`;
			this.searchObj.date = '';
			this.sortCompany = '';
			this.sortDuration = '';
			this.sortCategories = [];
			this.getAllTours();
		},

		filterBySidebar(isPaginate = false) {
			let company, duration, priceFrom, priceTo, page;
			company = this.sortCompany ? `&company=${this.sortCompany}` : '';
			duration = this.sortDuration ? `&duration=${this.sortDuration}` : '';
			priceFrom = this.sortPriceFrom ? `&price[gte]=${this.sortPriceFrom}` : '';
			priceTo = this.sortPriceTo ? `&price[lte]=${this.sortPriceTo}` : '';
			page = this.sortPage ? `&page=${this.sortPage}` : '';
			this.queryParam =
				`${company || ''}` + `${duration || ''}` + `${this.categoriesQuery || ''}` +
				`${priceFrom || ''}` + `${priceTo || ''}` + `${page || ''}`;
			this.getAllTours(isPaginate);
		},

		selectCategory(e, category) {
			this.categoriesQuery = '';
			if (e.currentTarget.checked) {
				this.sortCategories.push(category);
			} else {
				let index = this.sortCategories.findIndex((i) => i.id === category.id);
				this.sortCategories.splice(index, 1);
			}
			this.sortCategories.forEach((category) => {
				this.categoriesQuery += `&categories[]=${category.id}`;
			});
			this.filterBySidebar();
		},

		selectPrice() {
			clearTimeout(this.typingTimer);
			this.typingTimer = setTimeout(() => {
				this.filterBySidebar();
			}, 1000);
		},

		showMore() {
			this.sortPage += 1;
			this.filterBySidebar(true);
		},

		async getAllCompanies() {
			try {
				const res = await UserService.fetchAllCompanies();
				this.allCompanies = res.data.companies;
			} catch (err) {
				this.$toast.error(err);
			}
		},

		async getAllTours(isPaginate) {
			try {
				this.isLoading = true;
				const res = await TourService.fetchAllTours(this.queryParam);
				if (isPaginate) {
					this.tourList = [...this.tourList, ...res.data.tours];
				} else {
					this.tourList = res.data.tours;
				}
				this.isLoading = false;
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		async getAllCategories() {
			try {
				const res = await CategoryService.fetchAllCategories();
				this.categories = res.data.categories;
			} catch (err) {
				this.$toast.error(err);
			}
		},

		onChangeSearchDate() {
			this.searchObj.date = format(new Date(this.pickerDate), 'dd.MM.yyyy');
		},

		showPhoto(imgUrl) {
			return `${API_BASE_URL}/images/` + imgUrl;
		},

		formatDate(date) {
			const dateNum = format(new Date(date), 'dd');
			const month = format(new Date(date), 'LLLL', {locale: ru});
			const weekD = format(new Date(date), 'eeeeee', {locale: ru});
			return `<span>${dateNum}</span><span style="margin: 0 6px">${month},</span><span>${weekD}</span>`;
		},

		onMobileSearch() {
			CustomEventEmitter.$on('onShowSearch', () => {
				this.showMobSearch = !this.showMobSearch;
			});
		}
	},
};
</script>

<style lang="scss">
	.main-container {
		background: #e5e5e578;
		.main-top-bg {
			position: relative;
			height: 350px;
			img {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}
			.bg-text {
				color: #fff;
				position: absolute;
				top: 0;
				display: flex;
				align-items: center;
				justify-content: center;
				background: #00000080;
				height: 100%;
				width: 100%;
				&__block {
					text-align: center;
				}
				&__top {
					font-weight: bold;
					font-size: 48px;
				}
				&__bottom {
					font-weight: 500;
					font-size: 22px;
				}
			}
		}
		.main-all-tours {
			max-width: 1200px;
			margin: 0 auto;
			transform: translateY(-70px);
			@media #{$mob-view} {
				transform: translateY(0);
			}
			.search {
				background: #fff;
				border-radius: 8px;
				box-shadow: $btn-box-shadow;
				@media #{$mob-view} {
					padding: 0;
					border-radius: 0;
					box-shadow: 0 20px 22px 0 rgb(0 0 0 / 40%);
					max-height: 0;
					overflow: hidden;
					will-change: max-height;
					transition: max-height 0.3s ease-out;
					&.mob-search {
						padding: 0 20px 20px;
						max-height: 212px;
						transition: max-height 0.3s ease-in;
					}
				}
				&__filter {
					display: flex;
					align-items: center;
					justify-content: center;
					padding-top: 25px;
					.btn {
						max-width: 220px;
						height: 54px;
						box-shadow: none;
					}
					@media #{$mob-view} {
						display: block;
						padding-top: 20px;
						.btn {
							height: 46px;
							max-width: 100%;
						}
					}
				}
				&__form-field {
					display: flex;
					align-items: center;
					background: #fff;
					width: 100%;
					max-width: 435px;
					min-width: 140px;
					border: 1px solid #A6ACBB;
					border-radius: 8px;
					padding-left: 25px;
					@media #{$mob-view} {
						max-width: 100%;
					}
					&.date {
						margin: 0 25px;
						@media #{$mob-view} {
							margin: 15px 0;
						}
					}
					.label {
						margin-left: 13px;
						width: 100%;
						span {
							padding-left: 5px;
							font-size: 14px;
							color: $gray-dark;
						}
						input {
							display: block;
							width: 100%;
							height: 28px;
							color: $blue-darkest;
							@media #{$mob-view} {
								height: 22px;
							}
						}
					}
					&.location {
						position: relative;
						.drop-down-result {
							position: absolute;
							top: 60px;
							left: 0;
							z-index: 999;
							width: 100%;
							max-height: 230px;
							overflow-y: auto;
							border-radius: 4px;
							border: 1px solid #bdbdbd;
							box-shadow: 0 0 10px 0 rgb(0 0 0 / 20%);
							padding: 10px 0;
							background: #fff;
							@media #{$mob-view} {
								top: 55px;
							}
							.found-item {
								display: flex;
								align-items: center;
								justify-content: space-between;
								cursor: pointer;
								padding: 4px 10px;
								.name {
									max-width: 85%;
									overflow-x: hidden;
									white-space: nowrap;
									text-overflow: ellipsis;
								}
								.type {
									font-size: 13px;
									color: $gray-dark;
								}
								&:hover {
									background: $green-main;
									color: #fff;
									.type {
										color: #fff;
									}
								}
							}
						}
						.not-found {
							text-align: center;
						}
					}
				}
				.hint {
					margin-left: 32px;
					padding: 6px 0 15px 0;
					span {
						font-size: 13px;
						&:first-child {
							color: $gray-dark;
							margin-right: 5px;
						}
						&:last-child {
							color: $blue-darkest;
						}
					}
				}
			}
			.tour-content {
				display: flex;
				@media #{$mob-view} {
					margin-top: 15px;
				}
				.filter-sidebar {
					min-width: 270px;
					max-width: 270px;
					margin-right: 25px;
					padding-top: 100px;
					.filter-item {
						padding-bottom: 18px;
						margin-bottom: 18px;
						&:not(:last-child) {
							border-bottom: 1px solid $gray-blue;
						}
						.label {
							font-weight: 600;
							font-size: 15px;
							color: $blue-darkest;
							margin-bottom: 7px;
							padding-left: 5px;
							display: inline-block;
						}
						.check-boxes {
							.box {
								display: block;
								padding-left: 5px;
								margin-bottom: 6px;
								cursor: pointer;
								input {
									transform: scale(1.2);
								}
								span {
									margin-left: 8px;
									font-size: 15px;
									color: $blue-darkest;
								}
							}
						}
						.set-price {
							display: flex;
							align-items: center;
							margin-top: 8px;
							.v-text-field {
								max-width: 90px;
								&.from {
									margin-right: 30px;
								}
								&.from, &.to {
									.v-input__slot {
										min-height: 45px !important;
										.v-label {
											top: 13px;
										}
									}
								}
							}
						}
					}
				}
				.found-tours {
					width: 100%;
					.sort-price-chip {
						display: flex;
						align-items: center;
						justify-content: space-between;
						margin: 27px 0 20px;
						.chips {
							display: flex;
							align-items: center;
							.chip {
								background: #284B63;
								border-radius: 20px;
								color: #fff;
								padding: 3px 10px;
								margin-right: 15px;
								font-size: 14px;
							}
						}
					}
					.tour-items {
						@media #{$mob-view} {
							display: flex;
							flex-wrap: wrap;
							justify-content: space-evenly;
						}
					}
					.tour-item {
						display: flex;
						background: #fff;
						box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
						border-radius: 13px;
						margin-bottom: 25px;
						@media #{$mob-view} {
							flex-wrap: wrap;
							justify-content: center;
							max-width: 336px;
						}
						&:hover {
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
								border-radius: 13px 0 0 13px;
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
							padding: 18px 25px 25px;
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
							max-width: 580px;
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
							max-height: 54px;
							overflow-y: hidden;
							@media #{$mob-view} {
								margin-bottom: 28px;
							}
						}
						&__date {
							color: $blue-darkest;
							display: flex;
							align-items: center;
							span {
								font-size: 14px;
								margin-right: 10px;
							}
							.format-date {
								display: flex;
								font-weight: 600;
								font-size: 16px;
								text-transform: capitalize;
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
							@media #{$mob-view} {
								font-size: 18px;
							}
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
			margin: -45px auto 0;
			position: relative;
			@media #{$mob-view} {
				margin: 0 auto;
			}
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
				@media #{$mob-view} {
					font-size: 14px;
				}
			}
			.app-icons {
				display: flex;
				align-items: center;
				img {
					width: 175px;
					&:first-child {
						margin-right: 30px;
					}
				}
			}
		}

	}
</style>
