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

    const checkEmailDuplicate = async email => {
        try {
            const response = await fetch(`http://localhost:8080/users/check-email?email=${email}`);
            if (!response.ok) {
                const { message } = await response.json();
                showToastMessage(message || '이메일 중복 검사 실패');
                return false;
            }
            return true;
        } catch (error) {
            console.error('Error checking email:', error);
            showToastMessage('서버 오류로 인해 이메일 중복 검사 실패');
            return false;
        }
    };
    
    const checkNicknameDuplicate = async nickname => {
        try {
            const response = await fetch(`http://localhost:8080/users/check-nickname?nickname=${nickname}`);
            if (!response.ok) {
                const { message } = await response.json();
                showToastMessage(message || '닉네임 중복 검사 실패');
                return false;
            }
            return true;
        } catch (error) {
            console.error('Error checking nickname:', error);
            showToastMessage('서버 오류로 인해 닉네임 중복 검사 실패');
            return false;
        }
    };

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
            const formData = new FormData();
            formData.append('email', emailInput.value.trim());
            formData.append('password', passwordInput.value.trim());
            formData.append('nickname', nicknameInput.value.trim());
            if (profilePhotoInput.files[0]) {
                formData.append('profile_image', profilePhotoInput.files[0]);
            }

            try {
                const response = await fetch(
                    'http://localhost:8080/auth/signup',
                    {
                        method: 'POST',
                        body: formData,
                    });

                const result = await response.json();
                console.log(result);

                if (response.ok) {
                    showToastMessage('회원가입 완료');
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
