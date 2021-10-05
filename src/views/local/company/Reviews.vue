<template>
	<div class="review-container">
		<PreLoader v-if="isLoading"/>
		<div class="head-title">Отзывы</div>

		<table class="admin-table">
			<thead>
			<tr>
				<th>№</th>
				<th class="notify">Тур</th>
				<th>Непрочитанные</th>
				<th>Общее кол-во</th>
				<th>-</th>
			</tr>
			</thead>
			<tbody>
			<tr v-for="(review, i) in allReviews" :key="i">
				<td>{{ i + 1 }}</td>
				<td class="notify">{{review.name.ru}}</td>
				<td>{{ review.unreadReviewsCount }}</td>
				<td>{{ review.totalReviewsCount }}</td>
				<td>
					<router-link :to="{name: 'companyReviewShow', params: {tourId: review._id}}">
						Открыть
					</router-link>
				</td>
			</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
import {ReviewService} from '@/services/review.service';

export default {
	components: {
	},
	data() {
		return {
			isLoading: false,
			allReviews: []
		};
	},
	created() {
		this.isLoading = true;
		this.getCompanyReviews();
	},
	methods: {
		async getCompanyReviews() {
			try {
				const res = await ReviewService.fetchCompanyAllReviewsWithStatus();
				this.allReviews = res.data.tours;
				this.isLoading = false;
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		}
	}
};

</script>