export const isCompany = (to, from, next) => hasRole(to, next, 'company');

export const isClient = (to, from, next) => hasRole(to, next, 'customer');

export const isSuperAdmin = (to, from, next) => hasRole(to, next, 'superAdmin');

const hasRole = (to, next, role) => {
	if (to.meta.requireAuth) {
		const user = JSON.parse(window.localStorage.getItem('demalooUser'));
		if (user && user.data.user.role.includes(role)) {
			return next();
		}
		return next('/');
	}
	return next();
};