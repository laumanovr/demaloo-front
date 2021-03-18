import {API_BASE_URL, sendGetRequest, sendPatchRequest} from './api.service';

export class ReviewService {
	constructor() {}

	static fetchCompanyAllReviews() {
		const url = `${API_BASE_URL}/companies/toursWithReviewStats?limit=100`;
		return sendGetRequest(url);
	}

	static fetchCompanyTourReviews(tourId) {
		const url = `${API_BASE_URL}/companies/tours/${tourId}/reviews`;
		return sendGetRequest(url);
	}

	static makeAllRead(tourId) {
		const url = `${API_BASE_URL}/companies/tours/${tourId}/readReviews`;
		return sendPatchRequest(url);
	}

	static companyReply(reviewId, data) {
		const url = `${API_BASE_URL}/companies/reviews/${reviewId}`;
		return sendPatchRequest(url, data);
	}
}