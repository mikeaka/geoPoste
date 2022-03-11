import firebase from 'firebase/compat/app';
import "firebase/compat/database";

const firebaseConfig = {
    apiKey: "AIzaSyCgweBDtWGfQrPXczhBkuDa8Rz-khyRlIw",
    authDomain: "laposteci-3b76e.firebaseapp.com",
    databaseURL: "https://laposteci-3b76e-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "laposteci-3b76e",
    storageBucket: "laposteci-3b76e.appspot.com",
    messagingSenderId: "284504191413",
    appId: "1:284504191413:web:374e76830683ec902f69fc"
};

const fireDb = firebase.initializeApp(firebaseConfig);

export default fireDb.database().ref();