// Initialize local storage data structure if not exists
if (!localStorage.getItem('logData')) {
    localStorage.setItem('logData', JSON.stringify([]));
}

// DOM Elements
const employeeBtn = document.getElementById('employee-btn');
const adminBtn = document.getElementById('admin-btn');
const employeeModal = document.getElementById('employee-modal');
const adminModal = document.getElementById('admin-modal');
const closeBtns = document.querySelectorAll('.close');
const employeeLogin = document.getElementById('employee-login');
const adminLogin = document.getElementById('admin-login');
const employeeId = document.getElementById('employee-id');
const adminPassword = document.getElementById('admin-password');
const employeeError = document.getElementById('employee-error');
const adminError = document.getElementById('admin-error');

// Event Listeners
employeeBtn.addEventListener('click', () => {
    employeeModal.style.display = 'flex';
});

adminBtn.addEventListener('click', () => {
    adminModal.style.display = 'flex';
});

closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        employeeModal.style.display = 'none';
        adminModal.style.display = 'none';
        resetFormErrors();
    });
});

window.addEventListener('click', (e) => {
    if (e.target === employeeModal) {
        employeeModal.style.display = 'none';
        resetFormErrors();
    }
    if (e.target === adminModal) {
        adminModal.style.display = 'none';
        resetFormErrors();
    }
});

// Employee ID validation and login
employeeLogin.addEventListener('click', () => {
    const id = employeeId.value.trim();
    
    if (id.length !== 8 || !/^\d+$/.test(id)) {
        employeeError.textContent = 'กรุณากรอกรหัสพนักงานแบบเต็ม เช่น 00003890';
        return;
    }
    
    // Log the login event
    logActivity(id, 'login', null);
    
    // Redirect to occupations page with employee ID
    window.location.href = `occupations.html?id=${id}`;
});

// Admin login
adminLogin.addEventListener('click', () => {
    const password = adminPassword.value.trim();
    
    if (password !== 'kycnaja321start') {
        adminError.textContent = 'รหัสผ่านไม่ถูกต้อง';
        return;
    }
    
    // Redirect to admin dashboard
    window.location.href = 'admin.html';
});

// Helper Functions
function resetFormErrors() {
    employeeError.textContent = '';
    adminError.textContent = '';
    employeeId.value = '';
    adminPassword.value = '';
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