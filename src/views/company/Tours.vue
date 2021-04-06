<template>
    <div class="company-tours-container">
        <PreLoader v-if="isLoading"/>
        <div class="create-tour">
            <div class="head-title">Туры</div>
            <button class="btn blue-primary">
                <router-link :to="{name: 'tourCreate'}" class="white--text">Создать тур</router-link>
            </button>
        </div>
        <div class="filter-search-block">
            <div class="filter">
                <div
                    class="filter__item"
                    :class="{active: filterType == 'present'}"
                    @click.prevent="filterTours('present')"
                >
                    <div class="count">{{ presentToursCount }}</div>
                    <div class="tours present">Активные туры</div>
                </div>
                <div
                    class="filter__item"
                    :class="{active: filterType == 'past'}"
                    @click.prevent="filterTours('past')"
                >
                    <div class="count">{{ pastToursCount }}</div>
                    <div class="tours past">Прошедшие туры</div>
                </div>
            </div>
            <form class="search">
                <input type="text" placeholder="Найти..." v-model="searchQuery"/>
                <button class="btn green-primary" @click.prevent="searchTour">Поиск</button>
            </form>
        </div>
        <div class="tours-list">
            <table class="admin-table">
                <thead>
                <tr>
                    <th>№</th>
                    <th>Туры</th>
                    <th>Дата</th>
                    <th>Цена</th>
                    <th>Кол-во брони</th>
                    <th>Гид</th>
                    <th>Водитель</th>
                    <th>Статус</th>
                    <th>-</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="tour in tourList" :key="tour.num" class="edit-tour" @click="openTour($event, tour)">
                    <td>{{ tour.num }}</td>
                    <td class="tour-name">{{ tour.name.ru }}</td>
                    <td>{{ formatDate(tour.date) }}</td>
                    <td>{{ tour.price }} сом</td>
                    <td>{{ tour.bookingCount + " / " + tour.peopleCount }}</td>
                    <td>{{ tour.guides && tour.guides[0].fullName }}</td>
                    <td>{{ tour.drivers && tour.drivers[0].fullName }}</td>
                    <td>{{ checkStatus(tour) }}</td>
                    <td class="update"><RefreshIcon/></td>
                </tr>
                </tbody>
            </table>
            <div class="btn-actions pagination">
                <button
                    class="btn white-color-blue"
                    @click="showMoreTours"
                    v-if="tourList.length > 9"
                >
                    Показать еще
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import {TourService} from '@/services/tour.service';
//import EditIcon from '@/components/icons/EditIcon';
import RefreshIcon from '@/components/icons/RefreshIcon';
import PreLoader from '@/components/general/PreLoader';
import moment from 'moment';

export default {
	components: {
		//		EditIcon,
		RefreshIcon,
		PreLoader
	},
	data() {
		return {
			isLoading: false,
			todayDate: moment().format('YYYY-MM-DD'),
			filterType: 'present',
			presentToursCount: 0,
			pastToursCount: '-',
			tourList: [],
			searchQuery: '',
			page: 1
		};
	},
	created() {
		this.filterTours('present');
		this.getPastTours(false);
	},
	methods: {
		filterTours(type) {
			this.page = 1;
			this.filterType = type;
			if (type === 'present') {
				this.getPresentTours();
			} else {
				this.getPastTours();
			}
		},

		async getPresentTours() {
			try {
				this.isLoading = true;
				const res = await TourService.fetchCompanyTours(`&date[gte]=${this.todayDate}`);
				this.presentToursCount = res.results;
				this.tourList = res.data.tours.map((i, num) => ({...i, num: num + 1}));
				this.isLoading = false;
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		async getPastTours(bool = true) {
			try {
				this.isLoading = true;
				const res = await TourService.fetchCompanyTours(`&date[lt]=${this.todayDate}`);
				this.pastToursCount = res.results;
				this.isLoading = false;
				if (bool) {
					this.tourList = res.data.tours.map((i, num) => ({...i, num: num + 1}));
				}
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		async searchTour() {
			this.filterType = '';
			try {
				this.isLoading = true;
				const res = await TourService.fetchCompanyTours(`&search=${this.searchQuery}`);
				this.tourList = res.data.tours;
				this.isLoading = false;
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		openTour(e, tour) {
			if (e.target.className === 'update' || e.target.src) {
				this.$router.push({name: 'tourCreate', params: {tourId: tour._id}});
			} else {
				this.$router.push({name: 'companyTourShow', params: {tourId: tour._id}});
			}
		},

		async showMoreTours() {
			this.searchQuery = '';
			this.page += 1;
			const presentDates = `&date[gte]=${this.todayDate}`;
			const pastDates = `&date[lt]=${this.todayDate}`;
			const paginateDate = this.filterType === 'present' ? presentDates : pastDates;
			const query = `${paginateDate}&page=${this.page}`;
			try {
				this.isLoading = true;
				const res = await TourService.fetchCompanyTours(query);
				if (res.data.tours.length) {
					this.tourList = [...this.tourList, ...res.data.tours].map((i, num) => ({...i, num: num + 1}));
				}
				this.isLoading = false;
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		checkStatus(tour) {
			if (tour.cancelled) {
				return 'Отменненный';
			}
			if (tour.date >= this.todayDate) {
				return 'Активный';
			}
			return 'Прошедший';
		},

		formatDate(data) {
			return moment(data, 'YYYY-MM-DD').format('DD.MM.YYYY');
		},
	},
};
</script>

<style lang="scss" scoped>
    .company-tours-container {
        .create-tour {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid $gray-light;
            padding-bottom: 30px;
        }
        .btn {
            text-transform: uppercase;
            max-width: 206px;
            height: 36px;
            box-shadow: $btn-box-shadow;
        }
        .filter-search-block {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 32px 0;
            .filter {
                display: flex;
                align-items: center;
                width: 32%;
                &__item {
                    background: #fff;
                    width: 100%;
                    height: 68px;
                    margin-right: 16px;
                    border: 1px solid $blue-primary;
                    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 3px 4px rgba(0, 0, 0, 0.12),
                    0 2px 4px rgba(0, 0, 0, 0.14);
                    border-radius: 4px;
                    text-align: center;
                    cursor: pointer;
                    .count {
                        font-size: 24px;
                        color: $blue-primary;
                        margin-top: 2px;
                    }
                    .tours {
                        color: rgba(0, 0, 0, 0.3);
                        font-size: 12px;
                        white-space: nowrap;
                    }
                    &.active {
                        background: $blue-primary;
                        .count,
                        .tours {
                            color: #fff;
                        }
                    }
                }
            }
            .search {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                width: 68%;
                input {
                    border: 1px solid $green-primary;
                    width: 66%;
                    height: 36px;
                    margin-right: 15px;
                    background: #fff;
                    font-size: 15px;
                }
            }
        }

        .tours-list {
            table {
                .update {
                    &:hover {
                        background: #00f1da1f;
                    }
                    .edit-icon {
                        margin-right: 10px;
                    }
                }
                .tour-name {
                    max-width: 300px;
                }
                .edit-tour {
                    cursor: pointer;
                    &:hover {
                        background: #008fff26;
                    }
                }
            }
        }
    }
</style>
