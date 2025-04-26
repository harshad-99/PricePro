// Import the functions you need from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

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

// Initialize Firebase Authentication
const auth = getAuth();

// Form submit event
document.getElementById("form").addEventListener('submit', submitForgotPasswordForm);

function submitForgotPasswordForm(e) {
    e.preventDefault(); // Prevent page reload

    // Get the email input value
    const email = document.getElementById("email").value;

    // Send password reset email
    sendPasswordResetEmail(auth, email)
        .then(() => {
            alert("Password reset email sent successfully! Check your inbox.");
            window.location.href="login.html";
        })
        .catch((error) => {
            console.error("Error:", error.message);
            alert("An error occurred: " + error.message);
        });
}
