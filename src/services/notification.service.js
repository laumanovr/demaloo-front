import {API_BASE_URL, sendGetRequest, sendPatchRequest} from './api.service';

export class NotificationService {
	constructor() {}
// ---------------------------COMPANY-----------------------------------------------
	static fetchAll() {
		const url = `${API_BASE_URL}/companies/notifications`;
		return sendGetRequest(url);
	}

	static makeAllRead() {
		const url = `${API_BASE_URL}/companies/notifications/read`;
		return sendPatchRequest(url);
	}

	// ---------------------------CLIENT-----------------------------------------------
	static fetchClientAll() {
		const url = `${API_BASE_URL}/customers/notifications`;
		return sendGetRequest(url);
	}

	static makeClientAllRead() {
		const url = `${API_BASE_URL}/customers/notifications/read`;
		return sendPatchRequest(url, {});
	}
}