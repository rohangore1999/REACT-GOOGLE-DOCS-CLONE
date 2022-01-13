import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBCFvnYkaim0T-TTGDVly3STg_sm6xMhbI",
    authDomain: "docs-clone-react-894ba.firebaseapp.com",
    projectId: "docs-clone-react-894ba",
    storageBucket: "docs-clone-react-894ba.appspot.com",
    messagingSenderId: "501726845206",
    appId: "1:501726845206:web:696abe7590f31313ab5837",
    measurementId: "G-WHQKJYHFCT"
};

// if the app is not generated earlier then initialize else use existing one
const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app()


const db = app.firestore()

export { db }   