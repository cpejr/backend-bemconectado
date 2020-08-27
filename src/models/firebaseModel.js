const firebase = require("firebase/app");

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASEURL,
    projectId: process.env.FIREBASE_PROJECTID,
    storageBucket: process.env.FIREBASE_STORAGEBUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
    appId: process.env.FIREBASE_APPID
};
firebase.initializeApp(firebaseConfig);

module.exports = {
    async createNewOng(email, password) {
        try {
            const result = await firebase.auth().createUserWithEmailAndPassword(email, password)
            return result;
        }
        catch (error) {
            console.log(error);
        }
    }
}