import moment from 'moment';

export const formatDate = (date) => {
	return moment(date, 'YYYY-MM-DD').format('DD.MM.YYYY');
};