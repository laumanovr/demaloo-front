import axios from 'axios';
const MainUrl = 'https://demaloo.cdn.prismic.io/api/v2';

export class EventService {
	constructor() {}
	
	static async fetchAllEvents(page = 1) {
		try {
			const latestRef = await this.fetchLatestRef();
			const fetchUrl = `${MainUrl}/documents/search?ref=${latestRef}`;
			const res = await axios.get(`${fetchUrl}&q=[[at(document.type, "event")]]&page=${page}`);
			return res.data;
		} catch (err) {
			return Promise.reject(err);
		}
	}
	
	static async fetchById(id) {
		try {
			const latestRef = await this.fetchLatestRef();
			const fetchUrl = `${MainUrl}/documents/search?ref=${latestRef}&q=[[in(document.id, ["${id}"])]]`;
			const res = await axios.get(fetchUrl);
			return res.data.results[0].data;
		} catch (err) {
			return Promise.reject(err);
		}
	}
	
	static async searchByText(text) {
		try {
			const latestRef = await this.fetchLatestRef();
			const fetchUrl = `${MainUrl}/documents/search?ref=${latestRef}&q=[[fulltext(document, "${text}")][at(document.type, "event")]]`;
			const res = await axios.get(fetchUrl);
			return res.data;
		} catch (err) {
			return Promise.reject(err);
		}
	}
	
	static async filterByCategories(categories) {
		try {
			const latestRef = await this.fetchLatestRef();
			const fetchUrl = `${MainUrl}/documents/search?ref=${latestRef}&q=[[any(my.event.categories.category, ${categories})][at(document.type, "event")]]`;
			const res = await axios.get(fetchUrl);
			return res.data;
		} catch (err) {
			return Promise.reject(err);
		}
	}
	
	static async fetchLatestRef() {
		try {
			const res = await axios.get(MainUrl);
			return res.data.refs[0].ref;
		} catch (err) {
			return Promise.reject(err);
		}
	}
}