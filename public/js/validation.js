import { API_BASE_URL } from './config.js';
export const validateEmail = async (emailInput, context = 'signup') => {
    if (!emailInput) return true;

    const emailValue = emailInput?.value.trim();
    const emailHelper = emailInput?.nextElementSibling;

    if (!emailValue) {
        emailHelper.textContent = '*이메일을 입력해주세요.';
        return false;
    } else if (
        !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailValue)
    ) {
        emailHelper.innerHTML =
            '*올바른 이메일 주소 형식을 입력해주세요.<br>(예: example@example.com)';
        return false;
    } 

    // 회원가입 시에만 이메일 중복 검사
    if (context === 'signup'){
        try {
            const response = await fetch(
                `${API_BASE_URL}/users/check-email?email=${emailValue}`,
            );
            if (!response.ok) {
                const { message } = await response.json();
                emailHelper.textContent = `*${message}`;
                return false;
            }
            emailHelper.textContent = '';
            return true;
        } catch (error) {
            console.error('Error checking email:', error);
            return false;
        }
    }

    emailHelper.textContent = '';
    return true;
};

export const validatePassword = passwordInput => {
    if (!passwordInput) return true;

    const passwordValue = passwordInput?.value.trim();
    const passwordHelper = passwordInput?.nextElementSibling;

    if (!passwordValue) {
        passwordHelper.textContent = '*비밀번호를 입력해주세요.';
        return false;
    } else if (
        !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`])[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]{8,20}/.test(
            passwordValue,
        )
    ) {
        passwordHelper.textContent =
            '*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.';
        return false;
    } else {
        passwordHelper.textContent = '';
        return true;
    }
};

export const validatePasswordConfirm = (
    passwordInput,
    passwordConfirmInput,
) => {
    if (!passwordConfirmInput) return true;

    const passwordConfirmValue = passwordConfirmInput.value.trim();
    const passwordConfirmHelper = passwordConfirmInput.nextElementSibling;

    if (!passwordConfirmValue) {
        passwordConfirmHelper.textContent = '*비밀번호를 한번 더 입력해주세요.';
        return false;
    } else if (passwordInput.value !== passwordConfirmValue) {
        passwordConfirmHelper.textContent = '*비밀번호가 다릅니다.';
        return false;
    } else {
        passwordConfirmHelper.textContent = '';
        return true;
    }
};

export const validateNickname = async (nicknameInput, context = 'signup') => {
    if (!nicknameInput) return true;

    const nicknameValue = nicknameInput.value.trim();
    const nicknameHelper = nicknameInput.nextElementSibling;

    if (!nicknameValue) {
        nicknameHelper.textContent = '*닉네임을 입력해주세요.';
        return false;
    } else if (/\s/.test(nicknameValue)) {
        nicknameHelper.textContent = '*띄어쓰기를 없애주세요.';
        return false;
    } else if (nicknameValue.length > 10) {
        nicknameHelper.textContent = '*닉네임은 최대 10자까지 가능합니다.';
        return false;
    } 
    try {
        // 프로필 수정일 때
        if (context === 'edit') {
            const response = await fetch(`${API_BASE_URL}/auth/current`, {
                credentials: 'include',
            });
            const { data } = await response.json();

            // 자신의 닉네임은 닉네임 중복 검사 안함
            if (data.nickname === nicknameValue) {
                nicknameHelper.textContent = '';
                return true;
            }
        }

        const checkResponse = await fetch(
            `${API_BASE_URL}/users/check-nickname?nickname=${nicknameValue}`,
        );
        if (!checkResponse.ok) {
            const { message } = await checkResponse.json();
            nicknameHelper.textContent = `*${message}`;
            return false;
        }
        nicknameHelper.textContent = '';
        return true;
    } catch (error) {
        console.error('Error checking nickname:', error);
        return false;
    }
};

export const validateTitle = titleInput => {
    if (!titleInput) return true;

    const titleHelperText = titleInput?.nextElementSibling;
    const titleLength = titleInput.value.length;

    if (titleLength > 26) {
        titleHelperText.textContent = '*제목은 최대 26자까지 작성 가능합니다.';
        return false;
    } else if (titleLength === 0) {
        titleHelperText.textContent = '*제목을 입력해주세요.';
        return false;
    } else {
        titleHelperText.textContent = '';
        return true;
    }
};

export const validateContent = contentInput => {
    if (!contentInput) return true;

    const contentHelperText = contentInput?.nextElementSibling;
    const contentLength = contentInput.value.length;

    if (contentLength === 0) {
        contentHelperText.textContent = '*내용을 입력해주세요.';
        return false;
    } else {
        contentHelperText.textContent = '';
        return true;
    }
};

export const validateProfilePhoto = profilePhotoInput => {
    if (!profilePhotoInput) return true;

    if (!profilePhotoInput.value) {
        if (profilePhotoHelper) {
            profilePhotoHelper.style.display = 'block';
        }
        return false;
    } else {
        if (profilePhotoHelper) {
            profilePhotoHelper.style.display = 'none';
        }
        return true;
    }
};
