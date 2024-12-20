// script.js
const loadLeaderboardButton = document.getElementById('loadLeaderboard');
const leaderboardDiv = document.getElementById('leaderboard');
const messageElement = document.getElementById('message');
let userName = '';

loadLeaderboardButton.addEventListener('click', () => {
    fetchLeaderboard();
});

function fetchLeaderboard() {
    fetch('/api/leaderboard')
        .then(response => response.json())
        .then(data => {
            displayLeaderboard(data);
        });
}

function displayLeaderboard(leaderboard) {
    leaderboardDiv.innerHTML = '';
    leaderboard.forEach(entry => {
        const entryDiv = document.createElement('div');
        entryDiv.textContent = `${entry.name}: ${entry.score}`;
        leaderboardDiv.appendChild(entryDiv);
    });
}

function submitScore(name, score) {
    fetch('/api/leaderboard', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, score })
    })
    .then(response => response.json())
    .then(data => {
        messageElement.textContent = `Welcome back, ${name}! Your score is now ${score + 1}.`;
        fetchLeaderboard();  // Refresh leaderboard after submitting the score
    });
}

// Get or ask for the user's name
function getUserName() {
    userName = prompt('Enter your name:');
    if (userName) {
        submitScore(userName, 0);  // Initialize score to 0 when a new user joins
    }
}

// Check if there's a cookie with the user's name
function checkForUser() {
    const cookie = document.cookie.split(';').find(cookie => cookie.includes('userName'));
    if (cookie) {
        userName = cookie.split('=')[1];
        messageElement.textContent = `Welcome back, ${userName}!`;
        submitScore(userName, 0); // Add 1 to their score if they return
    } else {
        getUserName();  // If no userName cookie, ask for the user's name
    }
}

// Initialize the check for the user when the page loads
window.onload = checkForUser;
