import {API_BASE_URL, sendGetRequest, sendPatchRequest, sendPostRequest} from './api.service';

export class ReviewService {
	constructor() {}

	// --------------------------COMPANY----------------------------------------
	static fetchCompanyAllReviewsWithStatus() {
		const url = `${API_BASE_URL}/companies/toursWithReviewStats?limit=100`;
		return sendGetRequest(url);
	}

	static fetchCompanyTourReviews(tourId) {
		const url = `${API_BASE_URL}/companies/tours/${tourId}/reviews`;
		return sendGetRequest(url);
	}

	static fetchCompanyReviews(companyId, limit=300) {
		const url = `${API_BASE_URL}/companies/${companyId}/reviews?limit=${limit}`;
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

	// ---------------------------CLIENT------------------------------------------------
	static addClientReview(bookId, body) {
		const url = `${API_BASE_URL}/customers/bookings/${bookId}/reviews`;
		return sendPostRequest(url, body);
	}

	static fetchAllClientReviews() {
		const url = `${API_BASE_URL}/customers/reviews?limit=200`;
		return sendGetRequest(url);
	}
}