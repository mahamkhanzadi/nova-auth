
// ===================================
// NOVA AUTH - FIREBASE AUTHENTICATION
// ===================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    onAuthStateChanged,
    signOut,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";


// Firebase Configuration

const firebaseConfig = {
    apiKey: "AIzaSyAFoyKL7spvv3mA1S_DeF1QFnOUvLAwvQY",
    authDomain: "nova-auth-1fb04.firebaseapp.com",
    projectId: "nova-auth-1fb04",
    storageBucket: "nova-auth-1fb04.firebasestorage.app",
    messagingSenderId: "646641417486",
    appId: "1:646641417486:web:d0a28b2ec13727aab62b5f"
};


// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


// Get HTML Elements

const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");
const logoutBtn = document.getElementById("logoutBtn");


// ===================================
// SIGNUP FUNCTION
// ===================================

if (signupForm) {

    signupForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const fullName = document.getElementById("fullname").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {

            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            const user = userCredential.user;

            await updateProfile(user, {
                displayName: fullName
            });

            alert("Account created successfully!");

            window.location.href = "dashboard.html";

        } catch (error) {

            alert(error.message);
            console.error(error);

        }

    });

}


// ===================================
// LOGIN FUNCTION
// ===================================

if (loginForm) {

    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        try {

            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            alert("Login successful!");

            window.location.href = "dashboard.html";

        } catch (error) {

            alert(error.message);
            console.error(error);

        }

    });

}


// ===================================
// FORGOT PASSWORD FUNCTION
// ===================================

const forgotPassword = document.querySelector(".forgot-password");

if (forgotPassword) {

    forgotPassword.addEventListener("click", async (e) => {

        e.preventDefault();

        const email = document.getElementById("email").value.trim();

        if (!email) {
            alert("Please enter your email address first.");
            return;
        }

        try {

            await sendPasswordResetEmail(auth, email);

            alert("Password reset email sent successfully!");

        } catch (error) {

            alert(error.message);
            console.error(error);

        }

    });

}


// ===================================
// AUTHENTICATION STATE
// ===================================

onAuthStateChanged(auth, (user) => {

    const isDashboard = document.body.classList.contains("dashboard-body");
    const isAuthPage = signupForm || loginForm;

    if (isDashboard) {

        if (!user) {

            window.location.href = "login.html";
            return;

        }

        // Display actual user information

        const nameElement = document.getElementById("userName");
        const emailElement = document.getElementById("userEmail");
        const greetingElement = document.getElementById("welcomeName");
        const avatarElement = document.getElementById("userAvatar");

        const name = user.displayName || "User";

        if (nameElement) {
            nameElement.textContent = name;
        }

        if (emailElement) {
            emailElement.textContent = user.email || "";
        }

        if (greetingElement) {
            greetingElement.textContent = `Hello, ${name}!`;
        }

        if (avatarElement) {
            avatarElement.textContent = name.charAt(0).toUpperCase();
        }

    } else if (isAuthPage && user) {

        window.location.href = "dashboard.html";

    }

});


// ===================================
// LOGOUT FUNCTION
// ===================================

if (logoutBtn) {

    logoutBtn.addEventListener("click", async () => {

        try {

            await signOut(auth);

            alert("You have logged out successfully!");

            window.location.href = "login.html";

        } catch (error) {

            alert(error.message);
            console.error(error);

        }

    });

}
  

 
 // ===================================
 // PROFILE UPDATE FUNCTION
 // ===================================

const profileUpdateForm = document.getElementById("profileUpdateForm");

if (profileUpdateForm) {

    profileUpdateForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const newName = document.getElementById("updateName").value.trim();

        if (!newName) {
            alert("Please enter your name!");
            return;
        }

        try {

            const user = auth.currentUser;

            if (!user) {
                alert("Please login first!");
                return;
            }

            await updateProfile(user, {
                displayName: newName
            });

            // Update dashboard name

            const nameElement = document.getElementById("userName");
            const greetingElement = document.getElementById("welcomeName");
            const avatarElement = document.getElementById("userAvatar");

            if (nameElement) {
                nameElement.textContent = newName;
            }

            if (greetingElement) {
                greetingElement.textContent = `Hello, ${newName}!`;
            }

            if (avatarElement) {
                avatarElement.textContent = newName.charAt(0).toUpperCase();
            }

            alert("Profile updated successfully!");

            profileUpdateForm.reset();

        } catch (error) {

            alert(error.message);
            console.error(error);

        }

    });

}
