// Import the functions you need from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";
import { createUserWithEmailAndPassword, getAuth } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

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

// Initialize Firebase Authentication
const auth = getAuth();

// Form submit event
document.getElementById("form").addEventListener('submit', submitForm);

function submitForm(e) {
    e.preventDefault(); // Prevent the page from reloading

    // Capture input values
    const name = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const contact = document.getElementById("contact").value;
    const password = document.getElementById("password").value;

    // Create a new user with Firebase Authentication
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("User signed up:", user);

            // Write additional user details to the database
            return set(ref(databaseDB, 'users/' + name), {
                contact: contact,
                password:password,
                email: email,
                uid: user.uid,
                username: name,
                // Store UID for easy lookup
            });
        })
        .then(() => {
            alert("User registered successfully!");
            document.getElementById("form").reset(); // Clear the form
        })
        .catch((error) => {
            console.error("Error:", error.message);
            alert("An error occurred: " + error.message);
        });
}
