import {API_BASE_URL, sendGetRequest, sendPatchRequest} from './api.service';

export class LocationService {
	constructor() {}

	static fetchAllLocations() {
		const url = `${API_BASE_URL}/places`;
		return sendGetRequest(url);
	}

	static addNewPlace(data, regionId) {
		const url = `${API_BASE_URL}/places/${regionId}/addPlace`;
		return sendPatchRequest(url, data);
	}

	static searchPlace(query) {
		const url = `${API_BASE_URL}/places/search?q=${query}`;
		return sendGetRequest(url);
	}
}
