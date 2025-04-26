// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCgPA4T4Q3Ww44DPUkhqctltfi6BleIRK0",
    authDomain: "database-b6c31.firebaseapp.com",
    projectId: "database-b6c31",
    storageBucket: "database-b6c31.firebasestorage.app",
    messagingSenderId: "376582290782",
    appId: "1:376582290782:web:6cba9fbaadade5f066a3cf",
    measurementId: "G-GLQPJRWTRM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Reference your database
const databaseDB = getDatabase(app);

const signin = document.getElementById("signin");
signin.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const auth = getAuth();
    function createSession(user) {
        // Save user ID and token to localStorage
        localStorage.setItem('loggedInUserId', user.uid); // User ID
        localStorage.setItem('idToken', user.stsTokenManager.accessToken); // JWT token
        localStorage.setItem('refreshToken', user.refreshToken); // Refresh token
    
        console.log("Session created for user:", user.uid);
    }    
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert('Login successful');
            const user = userCredential.user;
            localStorage.setItem('loggedINUserId', user.uid);
            createSession(user)
            window.location.href = 'home.html';
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode === 'auth/wrong-password') {
                alert('Incorrect email or password');
            } else if (errorCode === 'auth/user-not-found') {
                alert('Account does not exist');
            } else {
                alert('Error: ' + error.message);
            }
        });
    
});
