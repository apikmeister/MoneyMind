import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import app from "./firebaseConfig";

// Get the Firebase authentication and database instances
const auth = getAuth(app);
const database = getDatabase(app);

// Get the register form
const registerButton = document.getElementById("registerForm");

// Add submit event listener to the register form
registerButton.addEventListener("click", (e) => {
    //   e.preventDefault();

    // Get user credentials from the form
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Register a new user with email and password
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Create a user entry in the Firebase database
            const userId = userCredential.user.uid;
            const userDataRef = ref(database, `users/${userId}`);
            const userData = {
                email: email,
                financialData: {
                    savings: 0,
                    expenses: 0,
                }
            };

            set(userDataRef, userData)
                .then(() => {
                    console.log("User registered successfully!");
                    // Redirect to the login page
                    window.location.href = "login.html";
                })
                .catch((error) => {
                    console.log("Failed to create user entry:", error.message);
                });
        })
        .catch((error) => {
            console.log(error.message);
        });
});
