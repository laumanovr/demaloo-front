const user = JSON.parse(window.localStorage.getItem('demalooUser'));
export const authHeader = () => {
	const user = JSON.parse(window.localStorage.getItem('demalooUser'));
	if (user && user.token) {
		return {Authorization: `Bearer ${user.token}`};
	}
	return {};
};

export const userToken = user ? user.token : '';