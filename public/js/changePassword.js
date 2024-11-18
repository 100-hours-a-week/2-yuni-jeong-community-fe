import { validatePassword, validatePasswordConfirm } from './validation.js';
import { updateButtonState, showToastMessage } from './utils.js';

document.addEventListener("DOMContentLoaded", () => {
    const passwordInput = document.getElementById("password");
    const passwordConfirmInput = document.getElementById("passwordConfirm");
    const changePasswordButton = document.getElementById("changePasswordButton");

    // 버튼 활성화 상태 업데이트
    const updateChangePasswordButtonState = () => {
        const isValid = validatePassword(passwordInput) && validatePasswordConfirm(passwordInput, passwordConfirmInput);
        updateButtonState(changePasswordButton, isValid);
    };

    // 비밀번호 변경 API 호출
    changePasswordButton.addEventListener("click", async (e) => {
        e.preventDefault();

        if (validatePassword(passwordInput) && validatePasswordConfirm(passwordInput, passwordConfirmInput)) {
            try {
                const response = await fetch('http://localhost:8080/users/password', {
                    method: "PATCH",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ new_password: passwordInput.value }),
                });

                const result = await response.json();

                if (response.ok) {
                    showToastMessage("수정 완료");
                    passwordInput.value = "";
                    passwordConfirmInput.value = "";
                    updateChangePasswordButtonState();
                } else {
                    showToastMessage(result.message || "수정 실패");
                }
            } catch (error) {
                console.error("Error:", error);
                showToastMessage("서버 오류로 인해 비밀번호 변경 실패");
            }
        }
    });

    [passwordInput, passwordConfirmInput].forEach((input) =>
        input.addEventListener("input", updateChangePasswordButtonState)
    );
});
