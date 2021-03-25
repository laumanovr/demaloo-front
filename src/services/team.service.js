import {API_BASE_URL, sendGetRequest, sendPatchRequest} from './api.service';

export class TeamService {
	constructor() {}

	static fetchCompanyTeamMembers() {
		const url = `${API_BASE_URL}/companies/team`;
		return sendGetRequest(url);
	}

	static updateCompanyTeamMembers(body) {
		const url = `${API_BASE_URL}/companies/team`;
		return sendPatchRequest(url, body);
	}
}