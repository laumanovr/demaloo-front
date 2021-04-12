import {API_BASE_URL, sendPostRequest} from './api.service';
import axios from 'axios';

export class ImageService {
	constructor() {}

	static generateSaveUrl(body) {
		const url = `${API_BASE_URL}/images/sign-s3`;
		return sendPostRequest(url, body);
	}

	static async saveImage(saveUrl, imgFile) {
		try {
			return await axios({method: 'PUT', url: saveUrl, data: imgFile});
		} catch (err) {
			return Promise.reject(err);
		}
	}
}