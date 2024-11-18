import { validateTitle, validateContent } from './validation.js';
import { updateButtonState, showToastMessage } from './utils.js';

document.addEventListener("DOMContentLoaded", async () => {
    const titleInput = document.getElementById("post-title");
    const contentInput = document.getElementById("post-content");
    const editButton = document.getElementById("edit-button");
    const postId = new URLSearchParams(window.location.search).get("id");


    if (!postId) {
        console.error("Invalid post ID.");
        return;
    }

    // 게시글 데이터 가져오기
    const fetchPostData = async () => {
        try {
            const response = await fetch(`http://localhost:8080/posts/${postId}`);
            const { data: post } = await response.json();

            if (post) {
                titleInput.value = post.title;
                contentInput.value = post.content;
                updateEditButtonState()
            } else {
                console.error("게시글 데이터를 불러올 수 없습니다.");
            }
        } catch (error) {
            console.error("Error fetching post data:", error);
        }
    };

    const updateEditButtonState = () => {
        const isFormValid = validateTitle(titleInput) && validateContent(contentInput);
        updateButtonState(editButton, isFormValid);
    };

    // 게시글 수정 API
    const updatePost = async () => {
        const updatedPost = {
            title: titleInput.value.trim(),
            content: contentInput.value.trim(),
            image_url: "" // TODO: 이미지 처리 로직 추가 필요 시 수정
        };

        try {
            const response = await fetch(`http://localhost:8080/posts/${postId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedPost)
            });

            if (response.ok) {
                showToastMessage("게시글이 수정되었습니다.");
                setTimeout(() => (window.location.href = "/posts"), 1000);
            } else {
                const result = await response.json();
                showToastMessage(result.message || "게시글 수정 실패");
            }
        } catch (error) {
            console.error("Error updating post:", error);
            showToastMessage("서버 오류로 인해 게시글 수정 실패");
        }
    };

    titleInput.addEventListener("input", updateEditButtonState);
    contentInput.addEventListener("input", updateEditButtonState);

    editButton.addEventListener("click", async (e) => {
        e.preventDefault();
        if (validateTitle(titleInput) && validateContent(contentInput)) {
            await updatePost();
        }
    });

    await fetchPostData();
});
