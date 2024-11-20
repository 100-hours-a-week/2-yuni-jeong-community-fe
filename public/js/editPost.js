import { validateTitle, validateContent } from './validation.js';
import { updateButtonState, showToastMessage, checkLogin } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
    await checkLogin();
    const titleInput = document.getElementById('post-title');
    const contentInput = document.getElementById('post-content');
    const editButton = document.getElementById('edit-button');
    const post_id = new URLSearchParams(window.location.search).get('id');
    const imageInput = document.getElementById('post-image');
    const fileUploadText = document.querySelector('.file-upload-text');

    if (!post_id) {
        console.error('Invalid post ID.');
        return;
    }

    // 게시글 데이터 가져오기
    const fetchPostData = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/posts/${post_id}`,
            );
            const { data: post } = await response.json();

            if (post) {
                titleInput.value = post.title;
                contentInput.value = post.content;

                if (post.image_url) {
                    fileUploadText.textContent = post.image_url.split('/').pop(); // 파일명 표시
                }

                updateEditButtonState();
            } else {
                console.error('게시글 데이터를 불러올 수 없습니다.');
            }
        } catch (error) {
            console.error('Error fetching post data:', error);
        }
    };

    const updateEditButtonState = () => {
        const isFormValid =
            validateTitle(titleInput) && validateContent(contentInput);
        updateButtonState(editButton, isFormValid);
    };

    // 게시글 수정 API
    const updatePost = async () => {
        const formData = new FormData();
        formData.append('title', titleInput.value.trim());
        formData.append('content', contentInput.value.trim());

        if (imageInput.files[0]) {
            formData.append('image', imageInput.files[0]);
        }

        try {
            const response = await fetch(
                `http://localhost:8080/posts/${post_id}`,
                {
                    method: 'PATCH',
                    credentials: 'include',
                    body: formData,
                },
            );

            const result = await response.json();

            if (response.ok) {
                showToastMessage('게시글이 수정되었습니다.');
                setTimeout(() => (window.location.href = `/post?id=${result.data.post_id}`), 1000);
            } else {
                const result = await response.json();
                showToastMessage(result.message || '게시글 수정 실패');
            }
        } catch (error) {
            console.error('Error updating post:', error);
            showToastMessage('서버 오류로 인해 게시글 수정 실패');
        }
    };

    imageInput.addEventListener('change', () => {
        const file = imageInput.files[0];
        if (file) {
            fileUploadText.textContent = file.name;
        } else {
            fileUploadText.textContent = '파일을 선택해주세요.';
        }
    });

    titleInput.addEventListener('input', updateEditButtonState);
    contentInput.addEventListener('input', updateEditButtonState);

    editButton.addEventListener('click', async e => {
        e.preventDefault();
        if (validateTitle(titleInput) && validateContent(contentInput)) {
            await updatePost();
        }
    });

    await fetchPostData();
});
