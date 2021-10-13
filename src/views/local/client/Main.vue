<template>
	<div class="main-container">
		<PreLoader v-if="isLoading"/>
		<TopBlockMain tourColor="#02D0AA" activityColor="#102542" :isTour="true" :isActivity="false"/>
		<div class="main-all-tours">
			<div class="search" :class="{'mob-search': showMobSearch}">
				<div class="search__filter">
					<div class="search__form-field location">
						<img src="../../../assets/icons/marker-green.svg">
						<div class="label">
							<span>{{$t('mainPage.location')}}</span>
							<input
								type="text"
								:placeholder="$t('mainPage.startTyping')"
								v-model="searchObj.inputValue"
								@input="autoCompleteLocation"
								v-on:blur="onBlurInput"
							>
						</div>
						<SmallLoader class="small-load" v-if="isSmallLoader"/>
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
						<div class="not-found drop-down-result" v-if="noResult">{{$t('mainPage.notFound')}}</div>
					</div>
					<div class="search__form-field date">
						<img src="../../../assets/icons/calendar-green.svg">
						<div class="label">
							<span>{{$t('date')}}</span>
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
										:placeholder="$t('filter.chooseDate')+'...'"
										type="text"
										readonly
										v-model="pickerDate"
										v-bind="attrs"
										v-on="on"
									>
								</template>
								<v-date-picker
									locale="ru-RU"
									v-model="searchObj.date"
									:min="todayDate"
									@input="onChangeSearchDate"
									class="search-date"
									color="#02D0AA"
									:show-week="false"
									:year-format="showPickerTitle"
								/>
							</v-menu>
						</div>
					</div>
					<button class="btn green-main" @click="submitSearchTours">{{$t('button.search')}}</button>
				</div>
				<div class="hint web"><span>{{$t('mainPage.example')}}:</span><span>Каракол</span></div>
			</div>

			<div class="tour-content">
				<div class="filter-sidebar web">
					<div class="filter-item">
						<span class="label">{{$t('filter.tourCompany')}}</span>
						<v-select
							solo
							label="Выбрать"
							class="border no-detail"
							:items="allCompanies"
							item-text="name"
							item-value="_id"
							v-model="sortCompany"
							@change="selectFilterCompany"
						/>
					</div>
					<div class="filter-item">
						<span class="label">{{$t('filter.duration')}} ({{$t('filter.days')}})</span>
						<v-select
							solo
							label="Выбрать"
							class="border no-detail"
							:items="allDurations"
							item-text="name"
							item-value="val"
							v-model="sortDuration"
							@change="filterBySidebar"
						/>
					</div>
					<div class="filter-item">
						<span class="label">{{$t('filter.categories')}}</span>
						<div class="check-boxes">
							<label class="box" v-for="(item, i) in categories" :key="i" :for="item.id" ref="boxes">
								<input :id="item.id" type="checkbox" @change="selectCategory($event, item)">
								<span>{{item[currentLang]}}</span>
							</label>
						</div>
					</div>
					<div class="filter-item">
						<span class="label">{{$t('filter.price')}} ({{$t('tourBooking.som')}})</span>
						<div class="set-price">
							<v-text-field
								outlined
								:label="$t('filter.from')"
								class="no-detail from"
								type="number"
								v-model="sortPriceFrom"
								@input="selectPrice"
							/>
							<v-text-field
								outlined
								:label="$t('filter.to')"
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
							<div class="chip" v-for="chip in sortCategories" :key="chip.id">
								{{chip[currentLang]}}
								<PlusIcon @click="selectCategory({currentTarget: {}}, chip)"/>
							</div>
						</div>
						<v-select
							solo
							:label="$t('filter.sorting')"
							class="v-select-item border no-detail"
							:items="sortItems"
							item-text="title"
							item-value="type"
							v-model="datePriceSort"
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
								<img :src="showTourPhoto(tour.images[0])" v-if="tour.images">
								<img src="../../../assets/images/no-image.png" v-else>
							</div>
							<div class="tour-item__info">
								<div class="tour-item__right">
									<div class="tour-item__desc-block">
										<div class="tour-item__name">{{tour.name.ru}}</div>
										<div class="tour-item__company">
											<img :src="showCompanyPhoto(tour.company.logo)">
											{{tour.company.name}}
											<div class="rating">
												<img src="../../../assets/icons/rating-icon.svg">
												<span>
													{{tour.company.rating}}
													<template v-if="tour.company.reviewCount">
														({{tour.company.reviewCount}})
													</template>
												</span>
											</div>
										</div>
										<div class="tour-item__description">
											{{tour.description.ru}}
										</div>
										<div class="tour-item__location" v-if="tour.locations">
											{{$t('mainPage.location')}}: <span>{{tour.locations.length && tour.locations[0].place}}</span>
										</div>
										<div class="tour-item__date">
											<span class="web">{{$t('tourDate')}}:</span>
											<div class="format-date" v-html="formatDate(tour.date)"></div>
										</div>
									</div>
									<div class="tour-item__price-block">
										<div class="tour-item__free-place">
											<template v-if="tour.bookingCount > 0">
												{{$t('tourBooking.remainPlace')}}: {{tour.bookingCount}}
											</template>
										</div>
										<span class="tour-item__price">{{tour.price}} {{$t('tourBooking.som')}}</span>
									</div>
								</div>
							</div>
						</router-link>
					</div>
					<div class="single-center">
						<button class="btn green-main" @click="showMore" v-if="tourList.length < totalToursCount">
							{{$t('button.showMore')}}
						</button>
						<h2 v-if="!tourList.length">{{$t('mainPage.notFound')}}</h2>
					</div>
				</div>
			</div>
		</div>

		<div class="banner">
			<img src="../../../assets/images/app-bg.png" class="bg">
			<div class="banner__text">
				<div class="banner__title">{{$t('mainPage.downloadApp')}} <br> {{$t('mainPage.forMobile')}}</div>
				<div class="app-icons web">
					<a href="https://apps.apple.com/us/app/demaloo/id1560957584">
						<img src="../../../assets/images/app-store.png">
					</a>
					<a href="https://play.google.com/store/apps/details?id=kg.demaloo">
						<img src="../../../assets/images/play-market.png">
					</a>
				</div>
			</div>
		</div>

		<!--MOBILE FILTER MODAL-->
		<MobileTourFilter
			ref="mobileFilter"
			:sortItems="sortItems"
			:allCompanies="allCompanies"
			:allDurations="allDurations"
			:categories="categories"
			@onSubmit="onSubmitMobFilter"
		/>
	</div>
</template>

<script>
import {TourService} from '@/services/tour.service';
import {format} from 'date-fns';
import {ru} from 'date-fns/locale';
import {AWS_IMAGE_URL} from '@/services/api.service';
import {CategoryService} from '@/services/category.service';
import {UserService} from '@/services/user.service';
import {LocationService} from '@/services/location.service';
import {CustomEventEmitter} from '@/utils/customEventEmitter';

export default {
	components: {
		PlusIcon: () => import('@/components/icons/PlusIcon'),
		SmallLoader: () => import('@/components/general/SmallLoader'),
		MobileTourFilter: () => import('@/components/client/MobileTourFilter'),
		TopBlockMain: () => import('@/components/client/TopBlockMain')
	},
	data() {
		return {
			isLoading: false,
			isSmallLoader: false,
			tourList: [],
			categories: [],
			allCompanies: [],
			allDurations: [
				{name: this.$t('button.choose'), val: ''}, {name: 1, val: 1}, {name: 2, val: 2},
				{name: 3, val: 3}, {name: 4, val: 4}, {name: 5, val: 5}
			],
			sortItems: [
				{title: this.$t('filter.byPrice'), type: 'price'},
				{title: this.$t('filter.byDate'), type: 'date'},
			],
			showDatePicker: false,
			pickerDate: '',
			todayDate: format(new Date(), 'yyyy-MM-dd'),
			searchObj: {
				queryValue: '',
				inputValue: '',
				date: ''
			},
			placeType: {
				region: 'Область',
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
			datePriceSort: '',
			typingTimer: null,
			locationTimer: null,
			showMobSearch: false,
			totalToursCount: 0
		};
	},
	computed: {
		currentLang() {
			return this.$root.$i18n.locale;
		}
	},
	created() {
		this.isLoading = true;
		this.getAllCompanies();
		this.getAllTours();
		this.getAllCategories();
		this.onMobileSearch();
		this.onMobileFilter();
	},
	methods: {
		showPickerTitle() {
			return 'Выберите дату начиная с ...';
		},

		async autoCompleteLocation(e) {
			if (!e.target.value.length) {
				this.searchLocations = [];
				return;
			}
			this.isSmallLoader = true;
			clearTimeout(this.locationTimer);
			this.locationTimer = setTimeout(() => {
				LocationService.searchPlace(e.target.value).then((res) => {
					this.searchLocations = res.data.locations;
					this.noResult = !this.searchLocations.length;
					this.isSmallLoader = false;
				}).catch((err) => {
					this.$toast.error(err);
					this.isSmallLoader = false;
				});
			}, 900);
		},

		onSelectFoundPlace(item) {
			this.searchObj.inputValue = item.name;
			this.searchObj.queryValue = `&${item.type}=${item.code || item.name}`;
			this.searchLocations = [];
		},

		onBlurInput() {
			this.$nextTick(() => {
				setTimeout(() => {
					this.searchLocations = [];
					this.noResult = false;
				}, 300);
			});
		},

		submitSearchTours() {
			this.sortPage = 1;
			this.filterBySidebar();
		},

		sortByPrice(sortType) {
			this.sortPage = 1;
			this.datePriceSort = sortType;
			this.filterBySidebar();
		},

		selectFilterCompany() {
			this.sortPage = 1;
			this.filterBySidebar();
		},

		filterBySidebar(isPaginate = '') {
			let company, duration, priceFrom, priceTo, date, sortPriceDate, page;
			company = this.sortCompany ? `&company=${this.sortCompany}` : '';
			duration = this.sortDuration ? `&duration=${this.sortDuration}` : '';
			priceFrom = this.sortPriceFrom ? `&price[gte]=${this.sortPriceFrom}` : '';
			priceTo = this.sortPriceTo ? `&price[lte]=${this.sortPriceTo}` : '';
			date = this.searchObj.date ? `&date[gte]=${this.searchObj.date}` : '';
			sortPriceDate = this.datePriceSort ? `&sort=${this.datePriceSort}` : '';
			page = this.sortPage ? `&page=${this.sortPage}` : '';
			this.queryParam =
				`${company || ''}` + `${duration || ''}` + `${this.categoriesQuery || ''}` +
				`${priceFrom || ''}` + `${priceTo || ''}` + `${this.searchObj.queryValue || ''}` + `${date || ''}` +
				`${sortPriceDate || ''}` + `${page || ''}`;
			this.getAllTours(isPaginate === 'paginate');
		},

		selectCategory(e, category) {
			this.sortPage = 1;
			this.categoriesQuery = '';
			if (e.currentTarget.checked) {
				this.sortCategories.push(category);
			} else {
				let index = this.sortCategories.findIndex((i) => i.id === category.id);
				this.sortCategories.splice(index, 1);
				let box = this.$refs.boxes.find((i) => i.innerText === category[this.currentLang]);
				box.querySelector('input').checked = false;
			}
			this.sortCategories.forEach((category) => {
				this.categoriesQuery += `&categories[]=${category.id}`;
			});
			this.filterBySidebar();
		},

		selectPrice() {
			this.sortPage = 1;
			clearTimeout(this.typingTimer);
			this.typingTimer = setTimeout(() => {
				this.filterBySidebar();
			}, 1000);
		},

		showMore() {
			this.sortPage += 1;
			this.filterBySidebar('paginate');
		},

		async getAllCompanies() {
			try {
				const res = await UserService.fetchAllCompanies();
				this.allCompanies = res.data.companies;
				this.allCompanies.unshift({_id: '', name: this.$t('button.choose')});
			} catch (err) {
				this.$toast.error(err);
			}
		},

		async getAllTours(isPaginate) {
			try {
				this.isLoading = true;
				const res = await TourService.fetchAllTours(this.queryParam);
				this.totalToursCount = res.results;
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
			this.pickerDate = format(new Date(this.searchObj.date), 'dd.MM.yyyy');
		},

		showTourPhoto(imgUrl) {
			return `${AWS_IMAGE_URL}/images/` + imgUrl + '?w=900&q=100';
		},

		showCompanyPhoto(imgUrl) {
			return `${AWS_IMAGE_URL}/logos/` + imgUrl + '?w=100&q=100';
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
		},

		onMobileFilter() {
			CustomEventEmitter.$on('onOpenFilter', () => {
				this.$refs.mobileFilter.toggleFilterModal();
			});
		},

		onSubmitMobFilter(filterObj) {
			for (let key in filterObj) {
				if (Object.prototype.hasOwnProperty.call(filterObj, key)) {
					this[key] = filterObj[key];
				}
			}
			this.filterBySidebar();
			this.$refs.mobileFilter.toggleFilterModal();
		}
	},
};
</script>

<style lang="scss">
	.main-container {
		background: #f5f5f5;
		.switchers {
			transform: translateY(25px);
			@media #{$mob-view} {
				transform: translateY(0);
				display: flex;
				align-items: center;
				justify-content: center;
			}
			.switcher {
				color: $blue-darkest;
				padding: 15px 30px;
				border-radius: 7px;
				background: #fff;
				font-size: 14px;
				font-weight: 600;
				cursor: pointer;
				&:first-child {
					margin-right: 20px;
					@media #{$mob-view} {
						margin: 0;
						border-right: 1px solid $gray-light;
					}
				}
				svg {
					margin-right: 8px;
				}
				&.active {
					color: $green-main;
				}
				@media #{$mob-view} {
					padding: 17px 0;
					border-radius: 0;
					width: 50%;
					justify-content: center;
				}
			}
		}
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
					transform: translateY(-20px);
				}
				&__top {
					font-weight: bold;
					font-size: 48px;
					font-family: $montserrat;
				}
				&__bottom {
					font-weight: 500;
					font-size: 22px;
					font-family: $montserrat;
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
				border-radius: 7px;
				box-shadow: $btn-box-shadow;
				@media #{$mob-view} {
					padding: 0 20px;
					border-radius: 0;
					box-shadow: 0 20px 22px 0 rgb(0 0 0 / 40%);
					max-height: 0;
					overflow: hidden;
					will-change: max-height;
					transition: max-height 0.3s ease-out;
					&.mob-search {
						max-height: 212px;
						transition: max-height 0.3s ease-in;
						padding: 0 20px 20px;
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
						font-size: 16px;
						font-weight: bold;
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
					border-radius: 7px;
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
								max-height: 136px;
								font-size: 13px;
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
					padding-top: 97px;
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
							flex-wrap: wrap;
							max-width: 73%;
							.chip {
								display: flex;
								align-items: center;
								background: #284B63;
								border-radius: 20px;
								color: #fff;
								padding: 2px 10px 4px;
								margin: 0 15px 8px 0;
								font-size: 14px;
								white-space: nowrap;
								.plus-icon {
									margin: 0;
									height: 24px;
									transform: translateY(1px);
									img {
										background: none;
										transform: rotate(45deg);
									}
								}
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
						border-radius: 7px;
						margin-bottom: 25px;
						transition: transform 0.2s ease-out;
						@media #{$mob-view} {
							flex-wrap: wrap;
							justify-content: center;
							max-width: 336px;
						}
						&:hover {
							transition: transform 0.2s ease-in;
							transform: scale(1.005);
							box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.15);
						}
						&__image {
							width: 100%;
							max-width: 273px;
							height: 194px;
							img {
								width: 100%;
								height: 100%;
								object-fit: cover;
								border-radius: 7px 0 0 7px;
							}
							@media #{$mob-view} {
								position: relative;
								max-width: 336px;
								height: 200px;
								img {
									border-radius: 7px 7px 0 0;
								}
							}
						}
						&__info {
							width: 100%;
							padding: 18px 25px 5px;
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
							max-width: 460px;
							font-family: $montserrat;
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
							margin-bottom: 5px;
							height: 38px;
							overflow-y: hidden;
						}
						&__location {
							font-size: 14px;
							color: $blue-darkest;
							margin-bottom: 5px;
							span {
								font-weight: 600;
							}
						}
						&__date {
							color: $blue-darkest;
							display: flex;
							align-items: center;
							span {
								font-size: 14px;
							}
							.format-date {
								display: flex;
								font-weight: 600;
								font-size: 16px;
								text-transform: capitalize;
								margin-left: 6px;
								@media #{$mob-view} {
									margin: 0;
								}
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
							font-family: $montserrat;
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
				@media #{$mob-view} {
					left: 14px;
				}
			}
			&__title {
				font-weight: bold;
				font-size: 44px;
				color: #fff;
				margin-bottom: 50px;
				@media #{$mob-view} {
					font-size: 13px;
					margin-bottom: 30px;
				}
			}
			.app-icons {
				display: flex;
				align-items: center;
				a:first-child {
					margin-right: 30px;
				}
				img {
					width: 175px;
				}
			}
		}
	}
	.search-date {
		.v-picker__title {
			background: $green-main !important;
		}
		.v-date-picker-title__year {
			color: #fff !important;
			opacity: 1 !important;
			pointer-events: none !important;
		}
	}
</style>
