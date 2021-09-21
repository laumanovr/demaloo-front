<template>
	<div class="notification-container">
		<PreLoader v-if="isLoading"/>
		<div class="head-title">Уведомления</div>

		<table class="admin-table">
			<thead>
			<tr>
				<th class="notify">Уведомление</th>
				<th>Дата/Время</th>
				<th>-</th>
			</tr>
			</thead>
			<tbody>
			<tr v-for="notify in notifications" :key="notify._id" :class="{'new': !notify.isRead}">
				<td class="notify">{{ notify.body }}</td>
				<td>{{ formatDate(notify.createdAt) }}</td>
				<td>
					<router-link
						:to="{name: 'companyReviewShow', params: {tourId: notify.tour}}"
						class="blue-light"
						v-if="notify.type == 'new_tour_review'"
					>
						Перейти
					</router-link>
					<router-link
						:to="{name: 'companyTourShow', params: {tourId: notify.tour}}"
						class="blue-light"
						v-else
					>
						Перейти
					</router-link>
				</td>
			</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
import {NotificationService} from '@/services/notification.service';
import PreLoader from '@/components/general/PreLoader';
import {format} from 'date-fns';

export default {
	components: {
		PreLoader
	},
	data() {
		return {
			isLoading: false,
			notifications: []
		};
	},
	created() {
		this.isLoading = true;
		this.getNotifications();
	},
	methods: {
		async getNotifications() {
			try {
				const res = await NotificationService.fetchAll();
				this.notifications = res.data.notifications;
				this.isLoading = false;
				this.makeAllNotifiesRead();
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		formatDate(date) {
			return format(new Date(date), "dd.MM.yyyy HH:mm");
		},

		async makeAllNotifiesRead() {
			try {
				await NotificationService.makeAllRead();
				this.$store.dispatch('notification/checkCompanyNotifies');
			} catch (err) {
				this.$toast.error(err);
			}
		}

	}
};
</script>

<style lang="scss" scoped>
.notification-container {
	.admin-table {
		.notify {
			text-align: left;
		}
		.new {
			background: #ffa5c459;
		}
	}
}
</style>