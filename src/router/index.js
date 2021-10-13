import Vue from 'vue';
import VueRouter from 'vue-router';
import ClientManage from '../views/ClientManage';
import {isCompany, isClient} from '../utils/checkPermission';

const localTourComponent = (path) => () => import(`@/views/local/${path}.vue`);
const loginComponent = (path) => () => import(`@/views/login/${path}.vue`);
const activityComponent = (path) => () => import(`@/views/activity/${path}.vue`);

Vue.use(VueRouter);

const routes = [
	// MAIN CLIENT SIDE
	{
		path: '/',
		component: ClientManage,
		beforeEnter: (to, from, next) => {
			isClient(to, from, next);
		},
		children: [
			// ACTIVITY PAGES
			{
				path: '',
				name: 'activityList',
				component: activityComponent('MainList'),
				meta: {
					requireAuth: false
				}
			},
			{
				path: 'activity-detail/:id',
				name: 'activityDetail',
				component: activityComponent('ActivityDetail'),
				meta: {
					requireAuth: false
				}
			},

			// LOCAL TOUR PAGES
			{
				path: 'tours',
				name: 'clientMain',
				component: localTourComponent('client/Main'),
				meta: {
					requireAuth: false
				}
			},
			{
				path: 'tour-detail/:tourId',
				name: 'tourDetail',
				component: localTourComponent('client/TourDetail'),
				meta: {
					requireAuth: false
				}
			},
			{
				path: 'contacts',
				name: 'contacts',
				component: localTourComponent('client/Contacts'),
				meta: {
					requireAuth: false
				}
			},
			{
				path: 'booking-detail/:tourId/:bookId',
				name: 'bookingDetail',
				component: localTourComponent('client/BookingDetail'),
				meta: {
					requireAuth: true
				}
			},
			{
				path: '/mobile-profile',
				name: 'mobileProfile',
				component: localTourComponent('client/MobileProfile'),
				meta: {
					requireAuth: true
				}
			},
			{
				path: 'company-info/:companyId',
				name: 'companyInfo',
				component: localTourComponent('client/CompanyInfo'),
				meta: {
					requireAuth: false
				}
			},
			{
				path: 'company-info-reviews/:companyId',
				name: 'companyInfoReviews',
				component: localTourComponent('client/CompanyInfoReviews'),
				meta: {
					requireAuth: false
				}
			},
			{
				path: '/profile-manage',
				component: localTourComponent('client/ProfileManage'),
				children: [
					{
						path: '',
						name: 'myTours',
						component: localTourComponent('client/MyTours'),
						meta: {
							requireAuth: true
						}
					},
					{
						path: 'info',
						name: 'personalInfo',
						component: localTourComponent('client/PersonalInfo'),
						meta: {
							requireAuth: true
						}
					},
					{
						path: 'notifications',
						name: 'notifications',
						component: localTourComponent('client/Notifications'),
						meta: {
							requireAuth: true
						}
					},
					{
						path: 'favorites',
						name: 'favorites',
						component: localTourComponent('client/MyFavorites'),
						meta: {
							requireAuth: true
						}
					},
					{
						path: 'reviews',
						name: 'reviews',
						component: localTourComponent('client/MyReviews'),
						meta: {
							requireAuth: true
						}
					},
					{
						path: 'messages',
						name: 'chat',
						component: localTourComponent('client/ClientChat'),
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
		component: loginComponent('CompanyLogin'),
		meta: {
			requireAuth: false
		}
	},

	// LOCAL TOUR COMPANY ADMIN
	{
		path: '/company-manage',
		component: localTourComponent('company/CompanyManage'),
		beforeEnter: (to, from, next) => {
			isCompany(to, from, next);
		},
		children: [
			{
				path: '',
				name: 'companyTours',
				component: localTourComponent('company/Tours'),
				meta: {
					requireAuth: true
				}
			},
			{
				path: 'tour-create',
				name: 'tourCreate',
				component: localTourComponent('company/TourCreate'),
				meta: {
					requireAuth: true
				}
			},
			{
				path: 'tour-show/:tourId',
				name: 'companyTourShow',
				component: localTourComponent('company/TourShow'),
				meta: {
					requireAuth: true
				}
			},
			{
				path: 'profile',
				name: 'companyProfile',
				component: localTourComponent('company/Profile'),
				meta: {
					requireAuth: true
				}
			},
			{
				path: 'notifications',
				name: 'companyNotifications',
				component: localTourComponent('company/Notification'),
				meta: {
					requireAuth: true
				}
			},
			{
				path: 'reviews',
				name: 'companyReviews',
				component: localTourComponent('company/Reviews'),
				meta: {
					requireAuth: true
				}
			},
			{
				path: 'review-show/:tourId',
				name: 'companyReviewShow',
				component: localTourComponent('company/ReviewShow'),
				meta: {
					requireAuth: true
				}
			},
			{
				path: 'team',
				name: 'companyTeam',
				component: localTourComponent('company/Team'),
				meta: {
					requireAuth: true
				}
			},
			{
				path: 'messages',
				name: 'message',
				component: localTourComponent('company/CompanyChat'),
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
