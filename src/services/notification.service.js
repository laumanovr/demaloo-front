import {API_BASE_URL, sendGetRequest, sendPatchRequest} from './api.service';

export class NotificationService {
	constructor() {}

	static fetchAll() {
		const url = `${API_BASE_URL}/companies/notifications`;
		return sendGetRequest(url);
	}

	static makeAllRead() {
		const url = `${API_BASE_URL}/companies/notifications/read`;
		return sendPatchRequest(url);
	}
}