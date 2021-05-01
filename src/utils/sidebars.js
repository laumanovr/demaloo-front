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
		// {
		// 	name: 'Чат',
		// 	route: '#',
		// 	icon: 'message.svg',
		// }
	],

	client: [
		{
			name: 'Поездки',
			route: '/profile-manage',
			icon: 'compass-tab.svg',
			className: 'single'
		},
		{
			name: 'Профиль',
			route: '/profile-manage/info',
			icon: 'profile-tab.svg',
			className: 'single'
		},
		{
			name: 'Уведомления',
			route: '/profile-manage/notifications',
			icon: 'notification-tab.svg',
			className: 'multi'
		},
		{
			name: 'Мои отзывы',
			route: '/profile-manage/reviews',
			icon: 'review-tab.svg',
			className: 'single'
		},
		{
			name: 'Сохраненные туры',
			route: '/profile-manage/favorites',
			icon: 'favorite-tab.svg',
			className: 'multi'
		},
		// {
		// 	name: 'Сообщения',
		// 	route: '#',
		// 	icon: 'message-tab.svg',
		// 	className: 'multi'
		// }
	],
};
