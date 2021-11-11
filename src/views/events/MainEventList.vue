<template>
	<div class="main-event-container">
		<PreLoader v-if="isLoading"/>
		<TopBlockMain/>
		<div class="main-all-tours">
			<div class="search">
				<form class="search__filter">
					<div class="search__form-field location">
						<img src="./../../assets/icons/marker-green.svg">
						<div class="label">
							<span>{{$t('mainPage.location')}}</span>
							<input type="text" :placeholder="$t('mainPage.startTyping')" v-model="searchTitle">
						</div>
					</div>
					<button class="btn green-main" @click.prevent="submitSearch">{{$t('button.search')}}</button>
				</form>
				<div class="hint web"><span>{{$t('mainPage.example')}}:</span><span>Flyjump</span></div>
			</div>

			<div class="tour-content">
				<div class="filter-sidebar web">
					<div class="filter-item">
						<span class="label">{{$t('filter.categories')}}</span>
						<div class="check-boxes">
							<label class="box" v-for="(item, i) in categoryList" :key="i" :for="i">
								<input :id="i" type="checkbox" @change="onSelectCategory($event, item)">
								<span>{{item}}</span>
							</label>
						</div>
					</div>
				</div>
				<div class="found-tours">
					<div class="sort-price-chip web">
						<v-select
							solo
							:label="$t('filter.sorting')"
							class="v-select-item border no-detail"
							:items="sortItems"
							item-text="title"
							item-value="type"
							@change="sortByPrice"
						/>
					</div>
					<div class="tour-items">
						<router-link
							:to="{name: 'eventDetail', params: {id: item.id}}"
							class="tour-item"
							v-for="item in eventList"
							:key="item.id"
						>
							<div class="tour-item__image">
								<img :src="item.data.images[0].image.url" v-if="item.data.images.length">
								<img src="./../../assets/images/no-image.png" v-else>
							</div>
							<div class="tour-item__info">
								<div class="tour-item__name">{{item.data.name}}</div>
								<div class="tour-item__right">
									<div class="tour-item__desc-block">
										<div class="tour-item__company">
											<img :src="item.data.logo.url">
											<span class="name">{{item.data.company}}</span>
										</div>
										<div class="tour-item__description d-flex align-center">
											<img src="../../assets/icons/marker-dark.png">
											<span class="name">{{item.data.location}}</span>
										</div>
									</div>
									<div>
										<div class="tour-item__date">
											<div class="format-date" v-for="time in item.data.days.slice(0,2)" :key="time.day">
												{{time.day}}, {{time.hour}}
											</div>
											<div class="format-date" v-if="item.data.days.length > 2">..</div>
										</div>
										<div class="tour-item__price-block">
                                            <span class="tour-item__price">{{item.data.price}}</span>
										</div>
									</div>
								</div>
							</div>
						</router-link>
					</div>
					<div class="single-center">
						<button class="btn green-main" @click="getMore" v-if="eventList.length < totalListCount">
							{{$t('button.showMore')}}
						</button>
						<h2 v-if="!eventList.length">{{$t('mainPage.notFound')}}</h2>
					</div>
				</div>
			</div>
		</div>

		<div class="banner">
			<img src="./../../assets/images/app-bg.png" class="bg">
			<div class="banner__text">
				<div class="banner__title">{{$t('mainPage.downloadApp')}} <br> {{$t('mainPage.forMobile')}}</div>
				<div class="app-icons web">
					<a href="https://apps.apple.com/us/app/demaloo/id1560957584">
						<img src="./../../assets/images/app-store.png">
					</a>
					<a href="https://play.google.com/store/apps/details?id=kg.demaloo">
						<img src="./../../assets/images/play-market.png">
					</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import {EventService} from '../../services/event.service';

export default {
	components: {
		TopBlockMain: () => import('@/components/client/TopBlockMain')
	},
	data() {
		return {
			isLoading: false,
			sortItems: [
				{title: 'Цена по возрастанию', type: 'priceAsc'},
				{title: 'Цена по убыванию', type: 'priceDesc'},
			],
			eventList: [],
			page: 1,
			searchTitle: '',
			totalListCount: 0,
			categoryList: [
				'Концерты', 'Исскуство', 'Для детей', 'Спорт', 'Бизнес', 'Выставки', 'Стендап', 'Митап'
			],
			selectedCategories: []
		};
	},
	computed: {
		currentLang() {
			return this.$root.$i18n.locale;
		}
	},
	created() {
		this.getEventList();
	},
	methods: {
		async getEventList() {
			try {
				this.isLoading = true;
				const res = await EventService.fetchAllEvents(this.page);
				this.eventList = [...this.eventList, ...res.results];
				this.totalListCount = res.total_results_size;
				this.isLoading = false;
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		sortByPrice(type) {
			const Asc = type === 'priceAsc';
			this.eventList = this.eventList.sort((a, b) => Asc ? a.data.price - b.data.price : b.data.price - a.data.price);
		},

		getMore() {
			this.page += 1;
			this.getEventList();
		},

		async submitSearch() {
			if (this.searchTitle) {
				try {
					this.isLoading = true;
					const res = await EventService.searchByText(this.searchTitle);
					this.eventList = res.results;
					this.totalListCount = res.total_results_size;
					this.isLoading = false;
				} catch (err) {
					this.$toast.error(err);
					this.isLoading = false;
				}
			}
		},

		onSelectCategory(e, selectedCat) {
			const isSelected = e.currentTarget.checked;
			if (isSelected) {
				this.selectedCategories.push(selectedCat);
				this.submitFilterCategory();
				return;
			}
			const i = this.selectedCategories.indexOf(selectedCat);
			this.selectedCategories.splice(i, 1);
			this.submitFilterCategory();
		},

		async submitFilterCategory() {
			try {
				this.isLoading = true;
				const res = await EventService.filterByCategories(JSON.stringify(this.selectedCategories));
				this.eventList = res.results;
				this.totalListCount = res.total_results_size;
				this.isLoading = false;
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		}

	},
};
</script>

<style lang="scss">
.main-event-container {
	background: #f5f5f5;

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
					margin-left: 20px;
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
				width: 75%;
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
					justify-content: flex-end;
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
							max-width: 336px;
							height: 280px;
							img {
								border-radius: 7px 7px 0 0;
                                object-fit: contain;
							}
						}
					}

					&__info {
						width: 100%;
						padding: 12px 25px 5px;
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
						display: block;
						@media #{$mob-view} {
							display: flex;
							justify-content: space-between;
							align-items: center;
							position: relative;
							margin-top: 10px;
						}
					}

					&__desc-block {
						width: 75%;
						@media #{$mob-view} {
							width: auto;
						}
					}

					&__price-block {
						transform: translateY(7px);
						@media #{$mob-view} {
							transform: translateY(3px);
						}
					}

					&__company {
						display: flex;
						align-items: center;
						font-weight: 600;
						font-size: 14px;
						margin: 5px 0 7px;
						@media #{$mob-view} {
							margin: 0 0 9px 0;
						}

						.name {
							max-width: 165px;
							white-space: nowrap;
							overflow-x: hidden;
							text-overflow: ellipsis;
						}

						img {
							width: 24px;
							height: 24px;
							object-fit: cover;
							margin-right: 6px;
							border-radius: 30px;
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
						@media #{$mob-view} {
							margin: 0;
							height: auto;
							.name {
								white-space: nowrap;
								max-width: 170px;
								overflow-x: hidden;
								text-overflow: ellipsis;
							}
						}

						img {
							width: 16px;
							height: 20px;
							margin-right: 5px;
						}
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
						margin-bottom: 4px;
                        @media #{$mob-view} {
                            justify-content: flex-end;
                        }
						span {
							font-size: 14px;
						}

						.format-date {
							display: flex;
							font-weight: 600;
							font-size: 14px;
							background: #E9EAEE;
							padding: 3px 8px;
							border-radius: 7px;
							margin-right: 8px;
							@media #{$mob-view} {
								font-size: 13px;
                                margin-right: 0;
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
						font-family: $montserrat;
						color: $green-main;
						@media #{$mob-view} {
							font-size: 18px;
                            text-align: right;
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
</style>
