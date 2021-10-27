import axios from 'axios';
const activityUrl = 'https://demaloo.cdn.prismic.io/api/v2';

export class ActivityService {
	constructor() {}

	static async fetchAllActivities(page = 1) {
		try {
			const latestRef = await this.fetchLatestRef();
			const fetchUrl = `${activityUrl}/documents/search?ref=${latestRef}`;
			const res = await axios.get(`${fetchUrl}&q=[[at(document.type, "entertainment")]]&page=${page}`);
			return res.data;
		} catch (err) {
			return Promise.reject(err);
		}
	}

	static async fetchById(id) {
		try {
			const latestRef = await this.fetchLatestRef();
			const fetchUrl = `${activityUrl}/documents/search?ref=${latestRef}&q=[[in(document.id, ["${id}"])]]`;
			const res = await axios.get(fetchUrl);
			return res.data.results[0].data;
		} catch (err) {
			return Promise.reject(err);
		}
	}

	static async searchByText(text) {
		try {
			const latestRef = await this.fetchLatestRef();
			const fetchUrl = `${activityUrl}/documents/search?ref=${latestRef}&q=[[fulltext(document, "${text}")][at(document.type, "entertainment")]]`;
			const res = await axios.get(fetchUrl);
			return res.data;
		} catch (err) {
			return Promise.reject(err);
		}
	}

	static async fetchLatestRef() {
		try {
			const res = await axios.get(activityUrl);
			return res.data.refs[0].ref;
		} catch (err) {
			return Promise.reject(err);
		}
	}
}