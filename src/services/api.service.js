import axios from 'axios';
import {authHeader} from '../utils/authHeader';
import respMessage from '../utils/respMessages';

export const API_BASE_URL = `${process.env.VUE_APP_BASE_URL}api/v1`;

export const AWS_IMAGE_URL = 'https://g64x0limh7.execute-api.eu-central-1.amazonaws.com/prod';

export const sendGetRequest = (url) => sendRequest('GET', url);

export const sendPostRequest = (url, data) => sendRequest('POST', url, data);

export const sendPutRequest = (url, data) => sendRequest('PUT', url, data);

export const sendPatchRequest = (url, data) => sendRequest('PATCH', url, data);

export const sendDeleteRequest = (url, data) => sendRequest('DELETE', url, data);

const sendRequest = async (method, url, data) => {
	const isFormData = data instanceof FormData;
	const config = {
		method,
		url,
		headers: {
			...authHeader(),
			'Content-Type': !isFormData ? 'application/json' : '',
		},
	};
	if (data) {
		config.data = isFormData ? data : JSON.stringify(data);
	}
	try {
		const res = await axios(config);
		return res.data;
	} catch (err) {
		const errMsg = respMessage[err.response.data.message];
		return Promise.reject(errMsg ? errMsg : err.response.data.message);
	}
};
