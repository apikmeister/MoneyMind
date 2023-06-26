import { getAuth, signInWithEmailAndPassword, setPersistence, browserSessionPersistence } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import app from "./firebaseConfig";

// Get the Firebase authentication and database instances
const auth = getAuth(app);
const database = getDatabase(app);

// Get the login form
const loginButton = document.getElementById("loginButton");
const errorMessage = document.getElementById("errorMessage");

// Add submit event listener to the login form
loginButton.addEventListener("click", (e) => {

  // Get user credentials from the form
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Sign in with email and password
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Retrieve user data from Firebase and redirect to the homepage
      const userId = userCredential.user.uid;
      const userDataRef = ref(database, `users/${userId}`);

      onValue(userDataRef, (snapshot) => {
        const userData = snapshot.val();
        if (userData) {
          window.location.href = "index.html";
        } else {
          console.log("User data not found");
          errorMessage.classList.remove("hidden");
          errorMessage.textContent = "User data not found"
        }
      });
    })
    .catch((error) => {
      console.log(error.message);
      errorMessage.classList.remove("hidden");
      errorMessage.textContent = error.message;
    });
});
