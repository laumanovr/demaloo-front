import {
	API_BASE_URL,
	sendPostRequest,
	sendGetRequest,
	sendPatchRequest,
	sendDeleteRequest
} from './api.service';

export class TourService {
	constructor() {}

	// -------------------------COMPANY TOURS START-----------------------
	static createTour(data) {
		const url = `${API_BASE_URL}/companies/tours`;
		return sendPostRequest(url, data);
	}

	static updateTour(data) {
		const url = `${API_BASE_URL}/companies/tours/${data._id}`;
		return sendPatchRequest(url, data);
	}

	static fetchTourBookings(tourId) {
		const url = `${API_BASE_URL}/companies/tours/${tourId}/bookings?limit=100`;
		return sendGetRequest(url);
	}

	static fetchCompanyTours(queryParams='') {
		const url = `${API_BASE_URL}/companies/tours?sort=date${queryParams}`;
		return sendGetRequest(url);
	}

	static fetchTourById(tourId) {
		const url = `${API_BASE_URL}/companies/tours/${tourId}`;
		return sendGetRequest(url);
	}

	static addManualBooking(tourId, body) {
		const url = `${API_BASE_URL}/companies/tours/${tourId}/bookings`;
		return sendPostRequest(url, body);
	}

	static updateManualBooking(booking) {
		const url = `${API_BASE_URL}/companies/bookings/${booking._id}`;
		return sendPatchRequest(url, booking);
	}

	static deleteManualBooking(bookingId) {
		const url = `${API_BASE_URL}/companies/bookings/${bookingId}`;
		return sendDeleteRequest(url);
	}

	static cancelTour(tourId, data) {
		const url = `${API_BASE_URL}/companies/tours/${tourId}/cancel`;
		return sendPatchRequest(url, data);
	}

	static fetchTourRevenue(tourId) {
		const url = `${API_BASE_URL}/companies/tours/${tourId}/revenue`;
		return sendGetRequest(url);
	}
	// --------------COMPANY TOURS END------------------------------------------
	// -----------------CLIENT TOURS START--------------------------------------

	static fetchAllTours(queryParam='') {
		const url = `${API_BASE_URL}/tours?limit=20${queryParam}`;
		return sendGetRequest(url);
	}

	static fetchClientTourDetail(tourId) {
		const url = `${API_BASE_URL}/tours/${tourId}`;
		return sendGetRequest(url);
	}

	static paymentForTour(body) {
		const url = `${API_BASE_URL}/customers/bookings/purchase`;
		return sendPostRequest(url, body);
	}

	static reservationForTour(body) {
		const url = `${API_BASE_URL}/customers/bookings/reserve`;
		return sendPostRequest(url, body);
	}

	static purchaseReservation(bookId, data) {
		const url = `${API_BASE_URL}/customers/bookings/${bookId}/purchase`;
		return sendPostRequest(url, data);
	}

	static fetchMyTourBookings(queryParams) {
		const url = `${API_BASE_URL}/customers/bookings?limit=100${queryParams}`;
		return sendGetRequest(url);
	}

	static fetchBookingById(bookId) {
		const url = `${API_BASE_URL}/customers/bookings/${bookId}`;
		return sendGetRequest(url);
	}

	static cancelBooking(bookId) {
		const url = `${API_BASE_URL}/customers/bookings/${bookId}/cancel`;
		return sendPatchRequest(url, {});
	}

	static addFavoriteTour(tourId) {
		const url = `${API_BASE_URL}/customers/favorites/tours/${tourId}`;
		return sendPostRequest(url, {});
	}

	static fetchFavoriteTours() {
		const url = `${API_BASE_URL}/customers/favorites/tours`;
		return sendGetRequest(url);
	}

	static deleteFavoriteTour(tourId) {
		const url = `${API_BASE_URL}/customers/favorites/tours/${tourId}`;
		return sendPatchRequest(url, {});
	}
}
