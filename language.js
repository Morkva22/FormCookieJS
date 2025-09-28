const uaBtn = document.getElementById('ua-btn');
const enBtn = document.getElementById('en-btn');

function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.indexOf(nameEQ) === 0) {
            return cookie.substring(nameEQ.length);
        }
    }
    return null;
}

function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.getElementById(fieldId + '-error');

    field.classList.add('error');
    field.classList.remove('success');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function hideError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.getElementById(fieldId + '-error');

    field.classList.remove('error');
    field.classList.add('success');
    errorDiv.style.display = 'none';
}

function validateForm() {
    const login = document.getElementById('login').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const currentLang = localStorage.getItem('language') || 'ua';

    let isValid = true;

    if (login.length < 3) {
        showError('login', translations[currentLang]['error-login-short']);
        isValid = false;
    } else {
        hideError('login');
    }

    if (!validateEmail(email)) {
        showError('email', translations[currentLang]['error-email-invalid']);
        isValid = false;
    } else {
        hideError('email');
    }

    if (password.length < 8) {
        showError('password', translations[currentLang]['error-password-short']);
        isValid = false;
    } else {
        hideError('password');
    }

    return isValid;
}

function showWelcomeMessage(login) {
    const welcomeDiv = document.getElementById('welcome-message');
    const currentLang = localStorage.getItem('language') || 'ua';

    if (currentLang === 'ua') {
        welcomeDiv.innerHTML = `🎉 Вітаємо, <strong>${login}</strong>! Ви успішно зареєстровані!`;
    } else {
        welcomeDiv.innerHTML = `🎉 Welcome, <strong>${login}</strong>! You have successfully registered!`;
    }

    welcomeDiv.style.display = 'block';

    setTimeout(() => {
        welcomeDiv.style.display = 'none';
    }, 5000);
}

function clearAllData() {
    const currentLang = localStorage.getItem('language') || 'ua';
    let confirmMessage = currentLang === 'ua'
        ? 'Ви впевнені, що хочете очистити всі дані? Це видалить cookies та localStorage.'
        : 'Are you sure you want to clear all data? This will delete cookies and localStorage.';

    if (confirm(confirmMessage)) {
        document.cookie.split(";").forEach(function(c) {
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });

        localStorage.clear();

        setLanguage('ua');

        document.getElementById('current-user').style.display = 'none';
        document.getElementById('registration-form').style.display = 'block';
        document.getElementById('registration-form').reset();

        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            input.classList.remove('error', 'success');
        });

        const errors = document.querySelectorAll('.error-message');
        errors.forEach(error => {
            error.style.display = 'none';
        });
    }
}

function logout() {
    deleteCookie('username');
    document.getElementById('current-user').style.display = 'none';
    document.getElementById('registration-form').style.display = 'block';
    document.getElementById('registration-form').reset();
}

function checkLoggedUser() {
    const savedUsername = getCookie('username');
    if (savedUsername) {
        document.getElementById('logged-username').textContent = savedUsername;
        document.getElementById('current-user').style.display = 'block';
        document.getElementById('registration-form').style.display = 'none';
    }
}

function setLanguage(lang) {
    Object.keys(translations[lang]).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            element.textContent = translations[lang][key];
        }
    });

    localStorage.setItem('language', lang);

    if (lang === 'ua') {
        uaBtn.classList.add('active');
        enBtn.classList.remove('active');
    } else {
        enBtn.classList.add('active');
        uaBtn.classList.remove('active');
    }

    document.documentElement.lang = lang === 'ua' ? 'uk' : 'en';
    document.title = translations[lang]['main-title'];
}

uaBtn.addEventListener('click', () => setLanguage('ua'));
enBtn.addEventListener('click', () => setLanguage('en'));

document.addEventListener('DOMContentLoaded', function() {
    const savedLanguage = localStorage.getItem('language') || 'ua';
    setLanguage(savedLanguage);
    checkLoggedUser();

    document.getElementById('registration-form').addEventListener('submit', function(e) {
        e.preventDefault();

        if (validateForm()) {
            const login = document.getElementById('login').value.trim();

            setCookie('username', login, 7);

            showWelcomeMessage(login);

            setTimeout(() => {
                document.getElementById('logged-username').textContent = login;
                document.getElementById('current-user').style.display = 'block';
                document.getElementById('registration-form').style.display = 'none';
                document.getElementById('registration-form').reset();
            }, 2000);
        }
    });
});