import firebase from 'firebase/app';
import 'firebase/auth';
import apiKey from '../keys/firebaseKey';

const firebaseConfig = {apiKey};

export const firebaseApp = firebase.initializeApp(firebaseConfig);