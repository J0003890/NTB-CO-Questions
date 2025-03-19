// Check if user is authorized to access the admin page
function checkAdminAuthorization() {
    // Check for a flag in session storage that indicates proper admin login
    const isAdminAuthorized = sessionStorage.getItem('adminAuthorized');
    
    // If not authorized, redirect to the index page
    if (!isAdminAuthorized) {
        window.location.href = 'index.html';
        return false;
    }
    
    return true;
}

// DOM Elements
const backToHomeBtn = document.getElementById('back-to-home');
const logTableBody = document.getElementById('log-table-body');

// Event Listeners
backToHomeBtn.addEventListener('click', () => {
    // Clear admin authorization when leaving the page
    sessionStorage.removeItem('adminAuthorized');
    window.location.href = 'index.html';
});

// Load log data
function loadLogData() {
    const logData = JSON.parse(localStorage.getItem('logData')) || [];
    
    // Sort by timestamp, newest first
    logData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Clear table
    logTableBody.innerHTML = '';
    
    // Add rows to table
    logData.forEach(log => {
        const row = document.createElement('tr');
        
        // Employee ID cell
        const employeeIdCell = document.createElement('td');
        employeeIdCell.textContent = log.employeeId;
        row.appendChild(employeeIdCell);
        
        // Action cell
        const actionCell = document.createElement('td');
        actionCell.textContent = formatAction(log.action);
        row.appendChild(actionCell);
        
        // Details cell
        const detailsCell = document.createElement('td');
        detailsCell.textContent = formatDetails(log.action, log.details);
        row.appendChild(detailsCell);
        
        // Timestamp cell
        const timestampCell = document.createElement('td');
        timestampCell.textContent = formatTimestamp(log.timestamp);
        row.appendChild(timestampCell);
        
        logTableBody.appendChild(row);
    });
}

// Format action for display
function formatAction(action) {
    const actionMap = {
        'login': 'เข้าสู่ระบบ',
        'select_occupation': 'เลือกอาชีพ',
        'question_checked': 'เลือกคำถาม',
        'question_unchecked': 'ยกเลิกคำถาม'
    };
    
    return actionMap[action] || action;
}

// Format details for display
function formatDetails(action, details) {
    if (!details) return '-';
    
    switch (action) {
        case 'login':
            return 'เข้าสู่ระบบสำเร็จ';
        case 'select_occupation':
            return `เลือกอาชีพ: ${details}`;
        case 'question_checked':
        case 'question_unchecked':
            if (typeof details === 'object') {
                const questionType = details.questionType === 'mandatory' ? 'คำถามหลัก' : 'คำถามเฉพาะอาชีพ';
                const status = action === 'question_checked' ? 'เลือก' : 'ยกเลิก';
                return `${status} ${questionType} #${details.questionId} สำหรับอาชีพ ${details.occupation}`;
            }
            return JSON.stringify(details);
        default:
            return JSON.stringify(details);
    }
}

// Format timestamp for display
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('th-TH', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

// Initialize page
function init() {
    // First check if user is authorized to be here
    if (checkAdminAuthorization()) {
        loadLogData();
    }
}

// Run initialization
init();