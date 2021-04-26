<template>
	<div class="client-notifications">
		<PreLoader v-if="isLoading"/>
		<div class="mob-profile-head head-title mob">
			<img src="../../assets/icons/arrow-dark.svg" @click="$router.push('/mobile-profile')"/>
			<span>Уведомления</span>
		</div>
		<div class="notify__content">
			<div class="notify__item" v-for="notify in notifications" :key="notify._id" :class="{'new': !notify.isRead}">
				<div class="notify__title">{{notify.title}}</div>
				<div class="notify__text">{{notify.body}}</div>
				<div class="notify__date">{{formatDate(notify.createdAt)}}</div>
			</div>
		</div>
	</div>
</template>

<script>
import {NotificationService} from '../../services/notification.service';
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
		this.getClientNotifications();
	},
	methods: {
		async getClientNotifications() {
			try {
				this.isLoading = true;
				const res = await NotificationService.fetchClientAll();
				this.notifications = res.data.notifications;
				this.isLoading = false;
				this.makeAllNotificationsRead();
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		async makeAllNotificationsRead() {
			try {
				await NotificationService.makeClientAllRead();
			} catch (err) {
				this.$toast.error(err);
			}
		},

		formatDate(date) {
			return format(new Date(date), "dd.MM.yyyy HH:mm");
		},
	}
};
</script>

<style lang="scss">
	.client-notifications {
		padding-top: 25px;
		@media #{$mob-view} {
			padding: 0;
		}
		.notify {
			&__item {
				border: 1px solid $gray-light;
				border-radius: 7px;
				padding: 0 20px;
				margin-bottom: 15px;
				@media #{$mob-view} {
					border-left: 0;
					border-right: 0;
					border-bottom: 0;
					padding: 0;
					margin: 0 20px 15px;
					border-radius: 0;
				}
				&.new {
					background: #02d0aa1a;
				}
			}
			&__title {
				font-size: 14px;
				color: $blue-darkest;
				padding: 10px 0 4px;
				font-weight: bold;
			}
			&__text {
				color: $blue-darkest;
				font-weight: 600;
				font-size: 13px;
				padding-bottom: 6px;
			}
			&__date {
				font-size: 12px;
				color: $gray-dark;
				padding-bottom: 8px;
			}
		}
	}
</style>