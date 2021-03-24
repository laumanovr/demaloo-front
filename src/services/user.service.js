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

	static fetchCompanyProfile() {
		const url = `${API_BASE_URL}/companies/me`;
		return sendGetRequest(url);
	}

	static updateCompanyProfile(body) {
		const url = `${API_BASE_URL}/companies/updateMe`;
		return sendPatchRequest(url, body);
	}

	static fetchCompanyTeamMembers() {
		const url = `${API_BASE_URL}/companies/team`;
		return sendGetRequest(url);
	}

	static updateCompanyTeamMembers(body) {
		const url = `${API_BASE_URL}/companies/team`;
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
}
