<template>
    <div class="main-activity-container">
        <PreLoader v-if="isLoading"/>
        <div class="main-top-bg web">
            <img src="./../../assets/images/main-page-bg.png">
            <div class="bg-text">
                <div class="bg-text__block">
                    <div class="bg-text__top">{{$t('mainPage.bannerTopTitle')}}</div>
                    <div class="bg-text__bottom">{{$t('mainPage.bannerBottomTitle')}}.</div>
                    <div class="d-flex justify-center switchers">
                        <router-link to="/" class="d-flex align-center switcher">
                            <img src="./../../assets/icons/local-tour.svg">
                            Туры
                        </router-link>
                        <router-link to="/activities" class="d-flex align-center switcher active">
                            <img src="./../../assets/icons/activity.svg">
                            Развлечения
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
        <div class="switchers mob">
            <router-link to="/" class="d-flex align-center switcher">
                <img src="./../../assets/icons/local-tour.svg">
                Туры
            </router-link>
            <router-link to="/activities" class="d-flex align-center switcher active">
                <img src="./../../assets/icons/activity.svg">
                Развлечения
            </router-link>
        </div>
        <div class="main-all-tours">
            <div class="search">
                <div class="search__filter">
                    <div class="search__form-field location">
                        <img src="./../../assets/icons/marker-green.svg">
                        <div class="label">
                            <span>{{$t('mainPage.location')}}</span>
                            <input type="text" :placeholder="$t('mainPage.startTyping')" v-model="searchTitle">
                        </div>
                    </div>
                    <button class="btn green-main" @click="submitSearch">{{$t('button.search')}}</button>
                </div>
                <div class="hint web"><span>{{$t('mainPage.example')}}:</span><span>Flyjump</span></div>
            </div>

            <div class="tour-content">
                <div class="filter-sidebar web">
                    <!--left sidebar-->
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
                            :to="{name: 'activityDetail', params: {id: item.id}}"
                            class="tour-item"
                            v-for="item in activityList"
                            :key="item.id"
                        >
                            <div class="tour-item__image">
                                <img :src="item.data.images[0].image.url">
                            </div>
                            <div class="tour-item__info">
                                <div class="tour-item__name">{{item.data.title}}</div>

                                <div class="tour-item__right">
                                    <div class="tour-item__desc-block">
                                        <div class="tour-item__company">
                                            <img :src="item.data.logo.url">
                                            {{item.data.company}}
<!--                                            <div class="rating">-->
<!--                                                <img src="./../../assets/icons/rating-icon.svg">-->
<!--                                                <span>4.5</span>-->
<!--                                            </div>-->
                                        </div>
                                        <div class="tour-item__description">
                                            {{item.data.description}}
                                        </div>
                                        <div class="tour-item__date">
                                            <div class="format-date">{{item.data.hours}}, {{item.data.days}}</div>
                                        </div>
                                    </div>
                                    <div class="tour-item__price-block">
                                        <span class="tour-item__price">{{item.data.price}} {{$t('tourBooking.som')}}</span>
                                    </div>
                                </div>
                            </div>
                        </router-link>
                    </div>
                    <div class="single-center">
                        <!--<button class="btn green-main">-->
                        <!--{{$t('button.showMore')}}-->
                        <!--</button>-->
                        <h2 v-if="!activityList.length">{{$t('mainPage.notFound')}}</h2>
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
import PreLoader from '@/components/general/PreLoader';
import {ActivityService} from '../../services/activity.service';

export default {
	components: {
		PreLoader,
	},
	data() {
		return {
			isLoading: false,
			sortItems: [
				{title: 'Цена по возрастанию', type: 'priceAsc'},
				{title: 'Цена по убыванию', type: 'priceDesc'},
			],
			activityList: [],
			page: 1,
			searchTitle: ''
		};
	},
	computed: {
		currentLang() {
			return this.$root.$i18n.locale;
		}
	},
	created() {
		this.getActivityList();
	},
	methods: {
		async getActivityList() {
			try {
				this.isLoading = true;
				this.activityList = await ActivityService.fetchAllActivities(this.page);
				this.isLoading = false;
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		sortByPrice(type) {
			const Asc = type === 'priceAsc';
			this.activityList = this.activityList.sort((a, b) => Asc ? a.data.price - b.data.price : b.data.price - a.data.price);
		},

		async submitSearch() {
			if (this.searchTitle) {
				try {
					this.isLoading = true;
					this.activityList = await ActivityService.searchByText(this.searchTitle);
					this.isLoading = false;
				} catch (err) {
					this.$toast.error(err);
					this.isLoading = false;
				}
			}
		}

	},
};
</script>

<style lang="scss">
    .main-activity-container {
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
                img {
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
                                border-radius: 7px 0 0 7px;
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
