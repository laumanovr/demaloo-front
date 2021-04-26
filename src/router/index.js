import Vue from 'vue';
import VueRouter from 'vue-router';
import {isCompany, isClient} from '../utils/checkPermission';

const loadComponent = (path) => () => import(`@/views/${path}.vue`);

Vue.use(VueRouter);

const routes = [
	// CLIENT SIDE
	{
		path: '/',
		component: loadComponent('client/ClientManage'),
		beforeEnter: (to, from, next) => {
			isClient(to, from, next);
		},
		children: [
			{
				path: '',
				name: 'clientMain',
				component: loadComponent('client/Main'),
				meta: {
					requireAuth: false
				}
			},
			{
				path: 'tour-detail/:tourId',
				name: 'tourDetail',
				component: loadComponent('client/TourDetail'),
				meta: {
					requireAuth: false
				}
			},
			{
				path: 'booking-detail/:tourId/:bookId',
				name: 'bookingDetail',
				component: loadComponent('client/BookingDetail'),
				meta: {
					requireAuth: true
				}
			},
			{
				path: '/mobile-profile',
				name: 'mobileProfile',
				component: loadComponent('client/MobileProfile'),
				meta: {
					requireAuth: true
				}
			},
			{
				path: '/profile-manage',
				component: loadComponent('client/ProfileManage'),
				children: [
					{
						path: '',
						name: 'myTours',
						component: loadComponent('client/MyTours'),
						meta: {
							requireAuth: true
						}
					},
					{
						path: 'info',
						name: 'personalInfo',
						component: loadComponent('client/PersonalInfo'),
						meta: {
							requireAuth: true
						}
					},
					{
						path: 'notifications',
						name: 'notifications',
						component: loadComponent('client/Notifications'),
						meta: {
							requireAuth: true
						}
					},
					{
						path: 'favorites',
						name: 'favorites',
						component: loadComponent('client/MyFavorites'),
						meta: {
							requireAuth: true
						}
					}
				]
			}
		]
	},

	// COMPANY LOGIN AND SIGNUP
	{
		path: '/company-login',
		name: 'companyLogin',
		component: loadComponent('login/CompanyLogin'),
		meta: {
			requireAuth: false
		}
	},
	// COMPANY
	{
		path: '/company-manage',
		component: loadComponent('company/CompanyManage'),
		beforeEnter: (to, from, next) => {
			isCompany(to, from, next);
		},
		children: [
			{
				path: '',
				name: 'companyTours',
				component: loadComponent('company/Tours'),
				meta: {
					requireAuth: true
				}
			},
			{
				path: 'tour-create',
				name: 'tourCreate',
				component: loadComponent('company/TourCreate'),
				meta: {
					requireAuth: true
				}
			},
			{
				path: 'tour-show/:tourId',
				name: 'companyTourShow',
				component: loadComponent('company/TourShow'),
				meta: {
					requireAuth: true
				}
			},
			{
				path: 'profile',
				name: 'companyProfile',
				component: loadComponent('company/Profile'),
				meta: {
					requireAuth: true
				}
			},
			{
				path: 'notifications',
				name: 'companyNotifications',
				component: loadComponent('company/Notification'),
				meta: {
					requireAuth: true
				}
			},
			{
				path: 'reviews',
				name: 'companyReviews',
				component: loadComponent('company/Reviews'),
				meta: {
					requireAuth: true
				}
			},
			{
				path: 'review-show/:tourId',
				name: 'companyReviewShow',
				component: loadComponent('company/ReviewShow'),
				meta: {
					requireAuth: true
				}
			},
			{
				path: 'team',
				name: 'companyTeam',
				component: loadComponent('company/Team'),
				meta: {
					requireAuth: true
				}
			}
		],
	},
];

const router = new VueRouter({
	mode: 'history',
	routes
});

router.afterEach(() => {
	Vue.nextTick(() => {
		window.scrollTo(0, 0);
	});
});

export default router;
