import { API_BASE_URL, MAX_FILE_SIZE } from './config.js';
import { validateTitle, validateContent } from './validation.js';
import { updateButtonState, showToastMessage, checkLogin } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
    await checkLogin();

    const titleInput = document.getElementById('post-title');
    const contentInput = document.getElementById('post-content');
    const submitButton = document.getElementById('submit-button');
    const imageInput = document.getElementById('post-image');
    const fileUploadText = document.querySelector('.file-upload-text');

    // 게시글 작성 버튼 활성화 상태 업데이트
    const updateSubmitButtonState = () => {
        const isFormValid =
            validateTitle(titleInput) && validateContent(contentInput);
        updateButtonState(submitButton, isFormValid);
    };

    // 게시글 업로드 API 호출
    submitButton.addEventListener('click', async e => {
        e.preventDefault();

        if (validateTitle(titleInput) && validateContent(contentInput)) {
            const formData = new FormData();
            formData.append('title', titleInput.value.trim());
            formData.append('content', contentInput.value.trim());
            if (imageInput.files[0]) {
                formData.append('image', imageInput.files[0]);
            }

            try {
                const response = await fetch(`${API_BASE_URL}/posts`, {
                    method: 'POST',
                    credentials: 'include',
                    body: formData,
                });

                const result = await response.json();

                if (response.ok) {
                    showToastMessage('게시글이 등록되었습니다');
                    setTimeout(() => (window.location.href = `/post?id=${result.data.post_id}`), 1000);
                } else {
                    showToastMessage(result.message || '게시글 등록 실패');
                }
            } catch (error) {
                console.error('Error posting article:', error);
                showToastMessage('서버 오류로 인해 게시글 등록 실패');
            }
        }
    });

    imageInput.addEventListener('change', () => {
        const file = imageInput.files[0];

        if (file && file.size > MAX_FILE_SIZE) {
            alert('파일 크기가 너무 큽니다. 최대 5MB까지 업로드할 수 있습니다.');
            fileUploadText.textContent = '파일을 선택해주세요.';
            imageInput.value = '';
            return;
        }

        if (file) {
            fileUploadText.textContent = file.name;
        } else {
            fileUploadText.textContent = '파일을 선택해주세요.';
        }
    });

    contentInput.addEventListener('input', () => {
        validateContent(contentInput);
        updateSubmitButtonState();
    });

    titleInput.addEventListener('input', () => {
        validateTitle(titleInput);
        updateSubmitButtonState();
    });
    
});
