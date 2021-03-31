import {API_BASE_URL, sendGetRequest} from './api.service';

export class CategoryService {
	constructor() {}

	static fetchAllCategories() {
		const url = `${API_BASE_URL}/categories`;
		return sendGetRequest(url);
	}
}