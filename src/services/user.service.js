import {API_BASE_URL, sendPostRequest, sendGetRequest, sendPatchRequest} from './api.service';

export class UserService {
	constructor() {}

	static loginCompany(data) {
		const url = `${API_BASE_URL}/companies/login`;
		return sendPostRequest(url, data);
	}

	static registerCompany(data) {
		const url = `${API_BASE_URL}/companies/signup`;
		return sendPostRequest(url, data);
	}

	static updateCompanyProfile(body) {
		const url = `${API_BASE_URL}/companies/updateMe`;
		return sendPatchRequest(url, body);
	}

	static fetchCompanyById(id) {
		const url = `${API_BASE_URL}/companies/${id}/info`;
		return sendGetRequest(url);
	}

	static fetchAllCompanies() {
		const url = `${API_BASE_URL}/companies`;
		return sendGetRequest(url);
	}

	static sendRecoveryEmail(body) {
		const url = `${API_BASE_URL}/companies/forgotPassword`;
		return sendPatchRequest(url, body);
	}

	static resetCompanyPassword(body) {
		const url = `${API_BASE_URL}/resetPassword`;
		return sendPatchRequest(url, body);
	}
	// ---------------------------------------------------------------

	static registerClient(body) {
		const url = `${API_BASE_URL}/signup`;
		return sendPostRequest(url, body);
	}

	static loginClient(body) {
		const url = `${API_BASE_URL}/login`;
		return sendPostRequest(url, body);
	}

	static updateClient(body) {
		const url = `${API_BASE_URL}/customers/updateMe`;
		return sendPatchRequest(url, body);
	}

	static fetchMyProfile() {
		const url = `${API_BASE_URL}/customers/me`;
		return sendGetRequest(url);
	}
}
