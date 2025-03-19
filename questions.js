// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const employeeId = urlParams.get('id');
const occupation = urlParams.get('occupation');

// Redirect to home if no parameters provided
if (!employeeId || !occupation) {
    window.location.href = 'index.html';
}

// DOM Elements
const backBtn = document.getElementById('back-btn');
const occupationTitle = document.getElementById('occupation-name');
const occupationQuestionsList = document.getElementById('occupation-questions');
const mandatoryCheckboxes = document.querySelectorAll('.mandatory-question');
const redLight = document.getElementById('red-light');
const yellowLight = document.getElementById('yellow-light');
const greenLight = document.getElementById('green-light');
const trafficMessage = document.getElementById('traffic-message');

// Set occupation title
occupationTitle.textContent = occupation;

// Load occupation-specific questions
function loadOccupationQuestions() {
    // Get questions for the selected occupation
    const questions = occupationQuestions[occupation] || [];
    
    // Clear existing questions
    occupationQuestionsList.innerHTML = '';
    
    // Add questions to the list
    questions.forEach((question, index) => {
        const questionItem = document.createElement('div');
        questionItem.className = 'question-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'question-checkbox occupation-question';
        checkbox.id = `occupation-${index + 1}`;
        checkbox.dataset.questionId = index + 1;
        
        const label = document.createElement('label');
        label.htmlFor = `occupation-${index + 1}`;
        label.className = 'question-text';
        label.textContent = question;
        
        questionItem.appendChild(checkbox);
        questionItem.appendChild(label);
        occupationQuestionsList.appendChild(questionItem);
        
        // Add event listener
        checkbox.addEventListener('change', () => {
            updateTrafficLight();
            logQuestionChecked(index + 1, checkbox.checked);
        });
    });
}

// Update the traffic light based on checkboxes
function updateTrafficLight() {
    // Count checked mandatory questions
    const checkedMandatory = Array.from(mandatoryCheckboxes).filter(checkbox => checkbox.checked).length;
    
    // Count checked occupation questions
    const occupationCheckboxes = document.querySelectorAll('.occupation-question');
    const checkedOccupation = Array.from(occupationCheckboxes).filter(checkbox => checkbox.checked).length;
    
    // Update lights
    redLight.classList.remove('active');
    yellowLight.classList.remove('active');
    greenLight.classList.remove('active');
    trafficMessage.classList.remove('visible');
    
    // Set appropriate message and light
    let message = '';
    
    if (checkedMandatory < 3) {
        // Red: Not all mandatory questions checked
        redLight.classList.add('active');
        message = "หยุด คุณยังรู้จักลูกค้าไม่พอ!";
    } else if (checkedOccupation < 3) {
        // Yellow: All mandatory but fewer than 3 occupation questions
        yellowLight.classList.add('active');
        message = "เกือบละ รู้จักละ อีกนิดนึง";
    } else {
        // Green: All mandatory and at least 3 occupation questions
        greenLight.classList.add('active');
        message = "เย่ ๆ คุณรู้จักลูกค้าพอสมควรแล้ว";
    }
    
    // Update message with animation
    trafficMessage.textContent = message;
    setTimeout(() => {
        trafficMessage.classList.add('visible');
    }, 100);
}

// Log question checked or unchecked
function logQuestionChecked(questionId, isChecked) {
    const action = isChecked ? 'question_checked' : 'question_unchecked';
    const details = {
        occupation: occupation,
        questionType: questionId > 0 ? 'occupation' : 'mandatory',
        questionId: Math.abs(questionId)
    };
    
    logActivity(employeeId, action, details);
}

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

// Initialize page
function init() {
    // Load occupation questions
    loadOccupationQuestions();
    
    // Add event listeners for mandatory checkboxes
    mandatoryCheckboxes.forEach((checkbox, index) => {
        checkbox.addEventListener('change', () => {
            updateTrafficLight();
            logQuestionChecked(-(index + 1), checkbox.checked); // Negative to distinguish from occupation questions
        });
    });
    
    // Back button event listener
    backBtn.addEventListener('click', () => {
        window.location.href = `occupations.html?id=${employeeId}`;
    });
    
    // Initialize traffic light
    updateTrafficLight();
}

// Run initialization
init();