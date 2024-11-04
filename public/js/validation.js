document.addEventListener("DOMContentLoaded", function () {
    // 공통 요소 선택자
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const loginButton = document.getElementById("loginButton");
    const registerButton = document.getElementById("registerButton");

    // 회원가입 전용 요소
    const passwordConfirmInput = document.getElementById("passwordConfirm");
    const nicknameInput = document.getElementById("nickname");
    const profilePhotoInput = document.getElementById("profilePhoto");
    const profilePhotoContainer = document.querySelector(".profile-photo");
    const profilePhotoHelper = document.querySelector(".profile-photo-helper");
    const plusIcon = document.querySelector(".plus-icon");

    // 게시글 작성 전용 요소
    const titleInput = document.getElementById("post-title");
    const contentInput = document.getElementById("post-content");
    const submitButton = document.getElementById("submit-button");
    const titleHelperText = document.getElementById("title-helper-text");
    const contentHelperText = document.getElementById("content-helper-text");

    // 비밀번호 수정 전용 요소
    const changePasswordButton = document.querySelector(".submitButton");

    // 로그인/회원가입 유효성 검사 함수
    function validateEmail() {
        const emailValue = emailInput?.value.trim();
        const emailHelper = emailInput?.nextElementSibling;

        if (!emailValue) {
            emailHelper.textContent = "*이메일을 입력해주세요.";
            return false;
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailValue)) {
            emailHelper.innerHTML = "*올바른 이메일 주소 형식을 입력해주세요.<br>(예: example@example.com)";
            return false;
        } else {
            emailHelper.textContent = "";
            return true;
        }
    }

    function validatePassword() {
        const passwordValue = passwordInput?.value.trim();
        const passwordHelper = passwordInput?.nextElementSibling;

        if (!passwordValue) {
            passwordHelper.textContent = "*비밀번호를 입력해주세요.";
            return false;
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}/.test(passwordValue)) {
            passwordHelper.textContent = "*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.";
            return false;
        } else {
            passwordHelper.textContent = "";
            return true;
        }
    }

    // 회원가입 유효성 검사 함수들
    function validatePasswordConfirm() {
        if (!passwordConfirmInput) return true;

        const passwordConfirmValue = passwordConfirmInput.value.trim();
        const passwordConfirmHelper = passwordConfirmInput.nextElementSibling;

        if (!passwordConfirmValue) {
            passwordConfirmHelper.textContent = "*비밀번호를 한번 더 입력해주세요.";
            return false;
        } else if (passwordInput.value !== passwordConfirmValue) {
            passwordConfirmHelper.textContent = "*비밀번호가 다릅니다.";
            return false;
        } else {
            passwordConfirmHelper.textContent = "";
            return true;
        }
    }

    // 비밀번호 수정 페이지 전용 버튼 활성화 상태 업데이트
    function updateChangePasswordButtonState() {
        const isValid = validatePassword() && validatePasswordConfirm();
        changePasswordButton.disabled = !isValid;
        changePasswordButton.style.backgroundColor = isValid ? "#7F6AEE" : "#ACA0EB";
    }

    // 비밀번호 수정 성공 시 토스트 메시지 표시
    function showToastMessage(message) {
        const toast = document.createElement("div");
        toast.textContent = message;
        toast.style.position = "fixed";
        toast.style.bottom = "20px";
        toast.style.left = "50%";
        toast.style.transform = "translateX(-50%)";
        toast.style.padding = "10px 20px";
        toast.style.backgroundColor = "#242424";
        toast.style.color = "#fff";
        toast.style.borderRadius = "5px";
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 2000);
    }

    if (changePasswordButton && changePasswordButton.classList.contains("change-password-page")) {
        changePasswordButton.addEventListener("click", function (e) {
            e.preventDefault();
            if (validatePassword() && validatePasswordConfirm()) {
                showToastMessage("수정 완료");
                // 실제 비밀번호 수정 로직 추가
            }
        });
    }


    function validateNickname() {
        if (!nicknameInput) return true;

        const nicknameValue = nicknameInput.value.trim();
        const nicknameHelper = nicknameInput.nextElementSibling;

        if (!nicknameValue) {
            nicknameHelper.textContent = "*닉네임을 입력해주세요.";
            return false;
        } else if (/\s/.test(nicknameValue)) {
            nicknameHelper.textContent = "*띄어쓰기를 없애주세요.";
            return false;
        } else if (nicknameValue.length > 10) {
            nicknameHelper.textContent = "*닉네임은 최대 10자까지 가능합니다.";
            return false;
        } else {
            nicknameHelper.textContent = "";
            return true;
        }
    }

    function validateProfilePhoto() {
        if (!profilePhotoInput) return true;

        if (!profilePhotoInput.value) {
            if (profilePhotoHelper) {
                profilePhotoHelper.style.display = "block";
            }
            return false;
        } else {
            if (profilePhotoHelper) {
                profilePhotoHelper.style.display = "none";
            }
            return true;
        }
    }

    // 게시글 작성 유효성 검사 함수들
    function validateTitle() {
        if (!titleInput) return true;

        const titleLength = titleInput.value.length;
        if (titleLength > 26) {
            titleHelperText.textContent = "*제목은 최대 26자까지 작성 가능합니다.";
            return false;
        } else if (titleLength === 0) {
            titleHelperText.textContent = "*제목을 입력해주세요.";
            return false;
        } else {
            titleHelperText.textContent = "";
            return true;
        }
    }

    function validateContent() {
        if (!contentInput) return true;

        const contentLength = contentInput.value.length;
        if (contentLength === 0) {
            contentHelperText.textContent = "*내용을 입력해주세요.";
            return false;
        } else {
            contentHelperText.textContent = "";
            return true;
        }
    }

    loginButton?.addEventListener("click", async function (e) {
        e.preventDefault();
        if (validateEmail() && validatePassword()) {
            try {
                const response = await fetch('/data/users.json');
                const users = await response.json();
                const email = emailInput.value;
                const password = passwordInput.value;
                const user = users.find(u => u.email === email && u.password === password);

                if (user) {
                    showToastMessage("로그인 성공");
                    setTimeout(() => {
                        window.location.href = "/posts";
                    }, 500);
                } else {
                    showToastMessage("이메일 또는 비밀번호가 잘못되었습니다.");
                }
            } catch (error) {
                console.error("Login error:", error);
                showToastMessage("로그인에 실패했습니다.");
            }
        }
    });

    registerButton?.addEventListener("click", async function (e) {
        e.preventDefault();
        if (validateEmail() && validatePassword() && validatePasswordConfirm() && validateNickname()) {
            try {
                const response = await fetch('/data/users.json');
                const users = await response.json();
                const email = emailInput.value;
                const existingUser = users.find(u => u.email === email);

                if (existingUser) {
                    showToastMessage("이미 사용 중인 이메일입니다.");
                    return;
                }
                showToastMessage("회원가입이 완료되었습니다!");
                setTimeout(() => {
                    window.location.href = "/";
                }, 1000);
            } catch (error) {
                console.error("Registration error:", error);
                showToastMessage("회원가입에 실패했습니다.");
            }
        }
    });

    // 버튼 상태 업데이트 함수
    function updateActionButtonState() {
        const isLogin = !!loginButton;
        const isSignup = !!registerButton;
    
        const isValidEmail = validateEmail();
        const isValidPassword = validatePassword();
        const isValidNickname = validateNickname();
        const isValidPasswordConfirm = validatePasswordConfirm();
        
        const isValidProfilePhoto = true;
    
        let isFormValid = false;
    
        if (isSignup) {
            isFormValid = isValidEmail && isValidPassword && isValidPasswordConfirm && isValidNickname && isValidProfilePhoto;
        } else if (isLogin) {
            isFormValid = isValidEmail && isValidPassword;
        }
    
        const actionButton = isSignup ? registerButton : loginButton;
    
        if (actionButton) {
            actionButton.disabled = !isFormValid;
            actionButton.style.backgroundColor = isFormValid ? "#7F6AEE" : "#ACA0EB";
        }
    }

    function updateSubmitButtonState() {
        if (!submitButton) return;

        const isFormValid = validateTitle() && validateContent();
        submitButton.disabled = !isFormValid;
        submitButton.style.backgroundColor = isFormValid ? "#7F6AEE" : "#ACA0EB";
    }

    // 이벤트 리스너 추가
    emailInput?.addEventListener("input", updateActionButtonState);
    passwordInput?.addEventListener("input", updateActionButtonState);
    passwordConfirmInput?.addEventListener("input", updateActionButtonState);
    nicknameInput?.addEventListener("input", updateActionButtonState);
    profilePhotoInput?.addEventListener("change", updateActionButtonState);
    titleInput?.addEventListener("input", updateSubmitButtonState);
    contentInput?.addEventListener("input", updateSubmitButtonState);
    passwordInput?.addEventListener("input", updateChangePasswordButtonState);
    passwordConfirmInput?.addEventListener("input", updateChangePasswordButtonState);

    // 프로필 사진 업로드 이벤트 (회원가입 전용)
    if (profilePhotoInput) {
        profilePhotoInput.addEventListener("change", function () {
            const file = profilePhotoInput.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    profilePhotoContainer.style.backgroundImage = `url(${e.target.result})`;
                    profilePhotoContainer.style.backgroundSize = "cover";
                    profilePhotoContainer.style.backgroundPosition = "center";
                    plusIcon.style.display = "none";
                    profilePhotoHelper.style.display = "none";
                };
                reader.readAsDataURL(file);
            }
        });

        profilePhotoContainer.addEventListener("click", function () {
            if (profilePhotoInput.value) {
                profilePhotoInput.value = "";
                profilePhotoContainer.style.backgroundImage = "none";
                plusIcon.style.display = "flex";
                profilePhotoHelper.style.display = "block";
            }
        });
    }

    // 게시글 작성 완료 버튼 클릭 시 필수 입력 확인
    submitButton?.addEventListener("click", function (e) {
        e.preventDefault();
        if (!validateTitle() || !validateContent()) {
            alert("*제목과 내용을 모두 작성해주세요.");
        } else {
            // 여기에 게시글 등록 로직 추가
            console.log("제목:", titleInput.value);
            console.log("내용:", contentInput.value);
        }
    });
});
