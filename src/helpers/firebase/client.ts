import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/functions';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyD-bmZ3mKxmCKpNbJxvfh2dfgNFxfsWOQU",
    authDomain: "cathub-f5274.firebaseapp.com",
    projectId: "cathub-f5274",
    storageBucket: "cathub-f5274.appspot.com",
    messagingSenderId: "764688616148",
    appId: "1:764688616148:web:869cc4d05be35f6df58941",
    measurementId: "G-J4NZB6BGEW"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
    firebase.app().functions('asia-east2')
}
  
export default firebase
