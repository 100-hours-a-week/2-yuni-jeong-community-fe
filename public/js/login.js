import { API_BASE_URL } from './config.js';
import { validateEmail, validatePassword } from './validation.js';
import { updateButtonState, showToastMessage } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('loginButton');

    // 로그인 버튼 활성화 상태 업데이트
    const updateLoginButtonState = () => {
        const isValid =
            validateEmail(emailInput, 'login') && validatePassword(passwordInput);
        updateButtonState(loginButton, isValid);
    };

    // 로그인 API 호출
    loginButton.addEventListener('click', async e => {
        e.preventDefault();

        if (validateEmail(emailInput, 'login') && validatePassword(passwordInput)) {
            try {
                const response = await fetch(
                    `${API_BASE_URL}/auth/login`,
                    {
                        method: 'POST',
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: emailInput.value,
                            password: passwordInput.value,
                        }),
                    },
                );

                const result = await response.json();

                if (response.ok) {
                    showToastMessage('로그인 성공');
                    setTimeout(() => (window.location.href = '/posts'), 500);
                } else {
                    showToastMessage(result.message || '로그인 실패');
                }
            } catch (error) {
                console.error('Login error:', error);
                showToastMessage('서버 오류로 인해 로그인 실패');
            }
        }
    });

    emailInput.addEventListener('input', updateLoginButtonState);
    passwordInput.addEventListener('input', updateLoginButtonState);
});
