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
			name: 'Чат',
			route: '#',
			icon: 'message.svg',
		}
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
			name: 'Мои отзывы',
			route: '#',
			icon: 'review-tab.svg',
			className: 'single'
		},
		{
			name: 'Уведомления',
			route: '#',
			icon: 'notification-tab.svg',
			className: 'multi'
		},
		{
			name: 'Сохраненные туры',
			route: '#',
			icon: 'favorite-tab.svg',
			className: 'multi'
		},
		{
			name: 'Сообщения',
			route: '#',
			icon: 'message-tab.svg',
			className: 'multi'
		}
	],

	superAdmin: []
};
