document.addEventListener("DOMContentLoaded", async function () {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get("id");

    function formatNumber(num) {
        if (num >= 100000) return `${Math.floor(num / 1000)}k`;
        if (num >= 10000) return `${Math.floor(num / 1000)}k`;
        if (num >= 1000) return `${Math.floor(num / 100) / 10}k`;
        return num;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
    
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    if (postId !== null) {
        try {
            const postResponse = await fetch(`http://localhost:8080/posts/${postId}`);
            const { data: post } = await postResponse.json();

            if (post) {
                document.querySelector(".post-title").textContent = post.title;
                document.querySelector(".post-author-name").textContent = post.author;
                document.querySelector(".post-date").textContent = formatDate(post.date);
                document.querySelector(".post-content").textContent = post.content;
                document.getElementById("likes-count").textContent = formatNumber(post.likes);
                document.getElementById("views-count").textContent = formatNumber(post.views);
                document.getElementById("comments-count").textContent = formatNumber(post.comments_count);

                const postImageContainer = document.querySelector(".post-image");
                if (post.image_url) {
                    postImageContainer.style.backgroundImage = `url(${post.image_url})`;
                    postImageContainer.style.display = "block";
                }

                const editButton = document.querySelector(".edit-button");
                editButton.addEventListener("click", () => {
                    window.location.href = `/post/edit?id=${postId}`;
                });

                const deleteButton = document.querySelector(".delete-button");
                const deleteModal = document.getElementById("deleteModal");
                const cancelButton = document.getElementById("cancelButton");
                const confirmButton = document.getElementById("confirmButton");

                deleteButton.addEventListener("click", () => {
                    deleteModal.style.display = "flex";
                });

                cancelButton.addEventListener("click", () => {
                    deleteModal.style.display = "none";
                });

                
                confirmButton.addEventListener("click", () => {
                    alert("게시글이 삭제되었습니다.");
                    deleteModal.style.display = "none";
                    window.location.href = "/posts";
                });
            } else {
                document.querySelector(".post-content").textContent = "게시글을 찾을 수 없습니다.";
            }

            const commentResponse = await fetch('/data/comments.json');
            const commentsData = await commentResponse.json();
            const comments = commentsData[postId] || [];

            const commentList = document.querySelector('.comment-list');
            commentList.innerHTML = "";

            comments.forEach(comment => {
                const commentItem = document.createElement('div');
                commentItem.classList.add('comment-item');
                commentItem.innerHTML = `
                    <div class="comment-author-avatar"></div>
                    <div class="comment-content">
                        <div class="comment-item-header">
                            <span class="comment-author-name">${comment.author}</span>
                            <span class="comment-date">${formatDate(comment.date)}</span>
                            <div class="comment-actions">
                                <button class="edit-button">수정</button>
                                <button class="delete-button">삭제</button>
                            </div>
                        </div>
                        <p class="comment-text">${comment.content}</p>
                    </div>
                `;
                
                const editCommentButton = commentItem.querySelector(".edit-button");
                const deleteCommentButton = commentItem.querySelector(".delete-button");

                editCommentButton.addEventListener("click", () => {
                    commentInput.value = comment.content;
                    submitButton.textContent = "댓글 수정";
                    submitButton.onclick = () => {
                        comment.content = commentInput.value;
                        commentItem.querySelector(".comment-text").textContent = comment.content;
                        submitButton.textContent = "댓글 등록";
                        commentInput.value = "";
                    };
                });

                deleteCommentButton.addEventListener("click", () => {
                    const commentDeleteModal = document.getElementById("commentDeleteModal");
                    commentDeleteModal.style.display = "flex";

                    document.getElementById("commentCancelButton").onclick = () => {
                        commentDeleteModal.style.display = "none";
                    };

                    document.getElementById("commentConfirmButton").onclick = () => {
                        commentDeleteModal.style.display = "none";
                        commentItem.remove();
                    };
                });
                
                commentList.appendChild(commentItem);
            });

            // 댓글 입력 상태에 따른 버튼 활성화
            const commentInput = document.querySelector(".comment-input");
            const submitButton = document.querySelector(".comment-submit-button");

            commentInput.addEventListener("input", () => {
                if (commentInput.value.trim().length > 0) {
                    submitButton.disabled = false;
                    submitButton.style.backgroundColor = "#7F6AEE"; // 활성화 색상
                } else {
                    submitButton.disabled = true;
                    submitButton.style.backgroundColor = "#ACA0EB"; // 비활성화 색상 수정
                }
            });
        } catch (error) {
            console.error("Error fetching post details:", error);
        }
    } else {
        console.error("Invalid post ID.");
    }
});
