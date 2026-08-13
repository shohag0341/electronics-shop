// App entry for Login Page
import { login, resetPassword, getSession } from './auth.js';

// DOM Elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const errorMsg = document.getElementById('errorMsg');
const successMsg = document.getElementById('successMsg');
const forgotPasswordLink = document.getElementById('forgotPassword');
const resetForm = document.getElementById('resetForm');
const resetEmailInput = document.getElementById('resetEmail');
const resetBtn = document.getElementById('resetBtn');
const backToLogin = document.getElementById('backToLogin');

// Check if already logged in
async function checkAuth() {
  const session = await getSession();
  if (session) {
    window.location.href = 'dashboard.html';
  }
}

// Show error message
function showError(message) {
  errorMsg.textContent = message;
  errorMsg.classList.remove('hidden');
  successMsg.classList.add('hidden');
}

// Show success message
function showSuccess(message) {
  successMsg.textContent = message;
  successMsg.classList.remove('hidden');
  errorMsg.classList.add('hidden');
}

// Hide messages
function hideMessages() {
  errorMsg.classList.add('hidden');
  successMsg.classList.add('hidden');
}

// Login form submit
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideMessages();

    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password) {
      showError('ইমেইল এবং পাসওয়ার্ড দিন');
      return;
    }

    loginBtn.disabled = true;
    loginBtn.textContent = 'লগইন হচ্ছে...';

    const result = await login(email, password);

    if (result.success) {
      showSuccess('লগইন সফল! রিডাইরেক্ট হচ্ছে...');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 800);
    } else {
      showError(result.message || 'লগইন ব্যর্থ হয়েছে। ইমেইল বা পাসওয়ার্ড চেক করুন।');
      loginBtn.disabled = false;
      loginBtn.textContent = 'লগইন';
    }
  });
}

// Forgot password toggle
if (forgotPasswordLink) {
  forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.add('hidden');
    resetForm.classList.remove('hidden');
    hideMessages();
  });
}

// Back to login
if (backToLogin) {
  backToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    resetForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
    hideMessages();
  });
}

// Password reset form
if (resetForm) {
  resetForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideMessages();

    const email = resetEmailInput.value;

    if (!email) {
      showError('ইমেইল অ্যাড্রেস দিন');
      return;
    }

    resetBtn.disabled = true;
    resetBtn.textContent = 'পাঠানো হচ্ছে...';

    const result = await resetPassword(email);

    if (result.success) {
      showSuccess(result.message);
      resetEmailInput.value = '';
    } else {
      showError(result.message);
    }

    resetBtn.disabled = false;
    resetBtn.textContent = 'রিসেট লিংক পাঠান';
  });
}

// Run on page load
checkAuth();

