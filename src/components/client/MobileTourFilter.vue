<template>
	<modal
		name="filter-modal"
		class="mobile-filter-container"
		height="95%" :adaptive="true"
		:shiftY="1" @before-open="setSomeData"
	>
		<div class="modal-container">
			<div class="head d-flex align-center justify-space-between">
				<span class="clear" @click="clearFilter">{{$t('button.clear')}}</span>
				<span class="title">{{$t('filter.filters')}}</span>
				<CloseIcon class="close" @click="toggleFilterModal"/>
			</div>
			<div class="filters">
                <template v-if="$route.name === 'tours'">
				<div class="filter-item">
					<v-select
						outlined
						:label="$t('filter.tourCompany')"
						class="no-detail"
						:items="allCompanies"
						item-text="name"
						item-value="_id"
						v-model="filter.sortCompany"
					/>
				</div>
				<div class="filter-item">
					<v-select
						outlined
						:label="$t('filter.duration')+$t('filter.days')"
						class="no-detail"
						:items="allDurations"
						item-text="name"
						item-value="val"
						v-model="filter.sortDuration"
					/>
				</div>
				<div class="filter-item d-flex align-center justify-space-between">
					<v-text-field
						outlined
						:label="$t('filter.from')"
						class="no-detail from"
						type="number"
						v-model="filter.sortPriceFrom"
					/>
					<v-text-field
						outlined
						:label="$t('filter.to')"
						class="no-detail to"
						type="number"
						v-model="filter.sortPriceTo"
					/>
				</div>
				<div class="filter-item category">
					<span class="label">{{$t('filter.categories')}}</span>
					<div class="check-boxes">
						<label class="box" v-for="(item, i) in allCategories" :key="i" :for="item.id+'-box'">
							<input type="checkbox" v-model="item.checked" @change="chooseCategory($event, item)" :id="item.id+'-box'">
							<span>{{item[currentLang]}}</span>
						</label>
					</div>
				</div>
                </template>
                <template v-else>
                    <div class="filter-item category">
                        <span class="label">{{$t('filter.categories')}}</span>
                        <div class="check-boxes">
                            <label class="box" v-for="(item, i) in allCategories" :key="i" :for="item+'-box'">
                                <input type="checkbox" @change="$emit('onSelectCat', $event, item, false)" :id="item+'-box'">
                                <span>{{item}}</span>
                            </label>
                        </div>
                    </div>
                </template>
			</div>
			<div class="d-flex justify-center submit-btn">
				<button class="btn green-main" @click="submitFilter">{{$t('button.submit')}}</button>
			</div>
		</div>
	</modal>
</template>

<script>
import CloseIcon from '@/components/icons/CloseIcon';

export default {
	props: {
		sortItems: Array,
		allCompanies: Array,
		allDurations: Array,
		categories: Array
	},
	components: {
		CloseIcon
	},
	data() {
		return {
			filter: {
				sortCompany: '',
				sortDuration: '',
				sortPriceFrom: '',
				sortPriceTo: '',
				categoriesQuery: '',
				sortPage: 1
			},
			sortCategories: [],
			allCategories: []
		};
	},
	computed: {
		currentLang() {
			return this.$root.$i18n.locale;
		}
	},
	methods: {
		setSomeData() {
			if (!this.allCategories.length) {
				this.allCategories = JSON.parse(JSON.stringify(this.categories));
			}
		},

		toggleFilterModal() {
			this.$modal.toggle('filter-modal');
		},

		chooseCategory(e, category) {
			this.filter.categoriesQuery = '';
			if (e.currentTarget.checked) {
				this.sortCategories.push(category);
			} else {
				let index = this.sortCategories.findIndex((i) => i.id === category.id);
				this.sortCategories.splice(index, 1);
			}
			this.sortCategories.forEach((category) => {
				this.filter.categoriesQuery += `&categories[]=${category.id}`;
			});
		},

		clearFilter() {
			this.filter = {
				sortCompany: '',
				sortDuration: '',
				sortPriceFrom: '',
				sortPriceTo: '',
				categoriesQuery: ''
			};
			this.sortCategories = [];
			this.allCategories = this.allCategories.map((item) => ({...item, checked: false}));
		},

		submitFilter() {
			this.filter.sortPage = 1;
			this.$emit('onSubmit', this.filter);
		}
	}
};
</script>

<style lang="scss">
	.mobile-filter-container {
		.vm--modal {
			border-radius: 8px 8px 0 0;
			color: $blue-darkest;
		}
		.head {
			margin-bottom: 16px;
			.clear {
				font-size: 14px;
				color: $green-main;
				font-weight: 600;
			}
			.title {
				font-size: 16px;
				font-weight: 700;
				font-family: $montserrat;
			}
		}
		.filters {
			.filter-item {
				margin-bottom: 12px;
				&.category {
					.label {
						font-size: 16px;
						font-weight: 600;
					}
					.box {
						display: block;
						font-size: 16px;
						font-weight: 400;
						margin-top: 8px;
						span {
							margin-left: 14px;
						}
					}
				}
				.no-detail.from {
					margin-right: 15px;
				}
			}
		}
		.submit-btn {
			padding: 10px 0;
		}
	}
</style>