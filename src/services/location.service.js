import {API_BASE_URL, sendGetRequest, sendPatchRequest} from './api.service';

export class LocationService {
	constructor() {}

	static fetchAllLocations() {
		const url = `${API_BASE_URL}/places`;
		return sendGetRequest(url);
	}

	static addNewPlace(data, regionId, rayonId) {
		const url = `${API_BASE_URL}/places/${regionId}/${rayonId}/addPlace`;
		return sendPatchRequest(url, data);
	}
}
