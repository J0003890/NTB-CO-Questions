// Get employee ID from URL
const urlParams = new URLSearchParams(window.location.search);
const employeeId = urlParams.get('id');

// Redirect to home if no employee ID is provided
if (!employeeId) {
    window.location.href = 'index.html';
}

// DOM Elements
const backBtn = document.getElementById('back-btn');
const occupationCards = document.querySelectorAll('.occupation-card');

// Event Listeners
backBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
});

occupationCards.forEach(card => {
    card.addEventListener('click', () => {
        const occupation = card.getAttribute('data-occupation');
        
        // Log occupation selection
        logActivity(employeeId, 'select_occupation', occupation);
        
        // Redirect to questions page
        window.location.href = `questions.html?id=${employeeId}&occupation=${encodeURIComponent(occupation)}`;
    });
});

// Function to log user activity
function logActivity(employeeId, action, details) {
    const logData = JSON.parse(localStorage.getItem('logData')) || [];
    
    logData.push({
        employeeId,
        action,
        details,
        timestamp: new Date().toISOString()
    });
    
    localStorage.setItem('logData', JSON.stringify(logData));
}