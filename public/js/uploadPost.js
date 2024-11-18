import { validateTitle, validateContent } from './validation.js';
import { updateButtonState, showToastMessage } from './utils.js';

document.addEventListener("DOMContentLoaded", () => {
    const titleInput = document.getElementById("post-title");
    const contentInput = document.getElementById("post-content");
    const submitButton = document.getElementById("submit-button");

    // 게시글 작성 버튼 활성화 상태 업데이트
    const updateSubmitButtonState = () => {
        const isFormValid = validateTitle(titleInput) && validateContent(contentInput);
        updateButtonState(submitButton, isFormValid);
    };

    // 게시글 업로드 API 호출
    submitButton.addEventListener("click", async (e) => {
        e.preventDefault();

        if (validateTitle(titleInput) && validateContent(contentInput)) {
            try {
                const response = await fetch('http://localhost:8080/posts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: titleInput.value.trim(),
                        content: contentInput.value.trim(),
                        user_id: 1, // TODO: 로그인된 사용자 ID로 수정
                        image_url: "", // 이미지 URL 추가 필요 시 처리
                    }),
                });

                const result = await response.json();

                if (response.ok) {
                    showToastMessage("게시글이 등록되었습니다");
                    setTimeout(() => (window.location.href = "/posts"), 1000);
                } else {
                    showToastMessage(result.message || "게시글 등록 실패");
                }
            } catch (error) {
                console.error("Error posting article:", error);
                showToastMessage("서버 오류로 인해 게시글 등록 실패");
            }
        }
    });

    titleInput.addEventListener("input", updateSubmitButtonState);
    contentInput.addEventListener("input", updateSubmitButtonState);
});
