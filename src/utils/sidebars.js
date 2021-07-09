export default {
	company: [
		{
			name: 'Туры',
			route: '/company-manage',
			icon: 'dashboard.svg',
		},
		// {
		// 	name: 'Клиенты',
		// 	route: '',
		// 	icon: 'people.svg',
		// },
		{
			name: 'Отзывы',
			route: '/company-manage/reviews',
			icon: 'assignment.svg',
		},
		{
			name: 'Уведомления',
			route: '/company-manage/notifications',
			icon: 'notifications.svg',
		},
		{
			name: 'Команда',
			route: '/company-manage/team',
			icon: 'people.svg'
		},
		{
			name: 'Сообщения',
			route: '/company-manage/messages',
			icon: 'message.svg',
		}
	],

	client: [
		{
			name: 'myTour.trips',
			route: '/profile-manage',
			icon: 'compass-tab.svg',
			className: 'single'
		},
		{
			name: 'profile.profile',
			route: '/profile-manage/info',
			icon: 'profile-tab.svg',
			className: 'single'
		},
		{
			name: 'notifications',
			route: '/profile-manage/notifications',
			icon: 'notification-tab.svg',
			className: 'multi'
		},
		{
			name: 'myReviews',
			route: '/profile-manage/reviews',
			icon: 'review-tab.svg',
			className: 'single'
		},
		{
			name: 'favoriteTours',
			route: '/profile-manage/favorites',
			icon: 'favorite-tab.svg',
			className: 'multi'
		},
		{
			name: 'messages',
			route: '/profile-manage/messages',
			icon: 'message-tab.svg',
			className: 'multi'
		}
	],
};
