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
			name: 'Чат',
			route: '#',
			icon: 'message.svg',
		}
	],

	client: [
		{
			name: 'Профиль',
			route: '/profile-manage',
			icon: 'avatar.svg'
		},
		{
			name: 'Мои туры',
			route: '/profile-manage/my-tours',
			icon: 'map-marker.svg'
		},
		{
			name: 'Мои отзывы',
			route: '#',
			icon: 'review.svg'
		},
		{
			name: 'Сообщения',
			route: '#',
			icon: 'envelope.svg'
		},
		{
			name: 'Уведомления',
			route: '#',
			icon: 'bell.svg'
		}
	],

	superAdmin: []
};
