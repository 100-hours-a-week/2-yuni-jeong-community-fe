import {
    validateEmail,
    validatePassword,
    validatePasswordConfirm,
    validateNickname,
} from './validation.js';
import { updateButtonState, showToastMessage } from './utils.js';
import { initializeProfilePhoto } from './profilePhoto.js';

document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const passwordConfirmInput = document.getElementById('passwordConfirm');
    const nicknameInput = document.getElementById('nickname');
    const registerButton = document.getElementById('registerButton');
    const profilePhotoInput = document.getElementById('profilePhoto');
    const profilePhotoContainer = document.querySelector('.profile-photo');
    const profilePhotoHelper = document.querySelector('.profile-photo-helper');
    const plusIcon = document.querySelector('.plus-icon');

    // 프로필 사진 초기화
    initializeProfilePhoto(
        profilePhotoInput,
        profilePhotoContainer,
        profilePhotoHelper,
        plusIcon,
    );

    // 회원가입 버튼 활성화 상태 업데이트
    const updateRegisterButtonState = () => {
        const isFormValid =
            validateEmail(emailInput) &&
            validatePassword(passwordInput) &&
            validatePasswordConfirm(passwordInput, passwordConfirmInput) &&
            validateNickname(nicknameInput);
        updateButtonState(registerButton, isFormValid);
    };

    // 회원가입 API 호출
    registerButton?.addEventListener('click', async e => {
        e.preventDefault();

        if (
            validateEmail(emailInput) &&
            validatePassword(passwordInput) &&
            validatePasswordConfirm(passwordInput, passwordConfirmInput) &&
            validateNickname(nicknameInput)
        ) {
            try {
                const response = await fetch(
                    'http://localhost:8080/auth/signup',
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: emailInput.value.trim(),
                            password: passwordInput.value.trim(),
                            nickname: nicknameInput.value.trim(),
                            profile_image: profilePhotoInput.value || '',
                        }),
                    },
                );

                const result = await response.json();

                if (response.ok) {
                    showToastMessage('회원가입이 완료');
                    setTimeout(() => (window.location.href = '/'), 1000);
                } else {
                    showToastMessage(result.message || '회원가입 실패');
                }
            } catch (error) {
                console.error('Registration error:', error);
                showToastMessage('서버 오류로 인해 회원가입 실패');
            }
        }
    });

    // 입력 이벤트 리스너 추가
    [emailInput, passwordInput, passwordConfirmInput, nicknameInput].forEach(
        input => input?.addEventListener('input', updateRegisterButtonState),
    );
});
