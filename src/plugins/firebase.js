import * as firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
	apiKey: "AIzaSyAPXIcotkyYkL6fvHIh7Kyf3w5b_5HdK9I",
	authDomain: "demaloo-ae263.firebaseapp.com",
	projectId: "demaloo-ae263",
	storageBucket: "demaloo-ae263.appspot.com",
	messagingSenderId: "616463014243",
	appId: "1:616463014243:web:25485a3cf67b62ad5e9b56",
	measurementId: "G-XLV0R3R0K9",
};
export default firebase.initializeApp(firebaseConfig);