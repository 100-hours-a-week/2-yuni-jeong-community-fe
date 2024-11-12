document.addEventListener("DOMContentLoaded", async () => {
    const postId = new URLSearchParams(window.location.search).get("id");
    const commentInput = document.querySelector(".comment-input");
    const submitButton = document.querySelector(".comment-submit-button");

    let editingCommentId = null;

    const formatNumber = (num) => (
        num >= 100000 ? `${Math.floor(num / 1000)}k` :
        num >= 10000 ? `${Math.floor(num / 1000)}k` :
        num >= 1000 ? `${Math.floor(num / 100) / 10}k` :
        num
    );

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    };

    const displayPost = (post) => {
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
    };

    const fetchPost = async () => {
        try {
            const response = await fetch(`http://localhost:8080/posts/${postId}`);
            const { data: post } = await response.json();
            if (post) displayPost(post);
            else document.querySelector(".post-content").textContent = "게시글을 찾을 수 없습니다.";
        } catch (error) {
            console.error("Error fetching post details:", error);
        }
    };

    document.querySelector(".edit-button").addEventListener("click", () => {
        window.location.href = `/post/edit?id=${postId}`;
    });

    const displayComment = (comment) => {
        const commentItem = document.createElement("div");
        commentItem.classList.add("comment-item");
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
        setUpCommentActions(commentItem, comment);
        document.querySelector(".comment-list").appendChild(commentItem);
    };

    const fetchComments = async () => {
        try {
            const response = await fetch(`http://localhost:8080/posts/${postId}/comments`);
            const { data: comments } = await response.json();
            document.querySelector(".comment-list").innerHTML = "";
            comments.forEach(displayComment);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    const setUpCommentActions = (commentItem, comment) => {
        const editCommentButton = commentItem.querySelector(".edit-button");
        const deleteCommentButton = commentItem.querySelector(".delete-button");

        editCommentButton.addEventListener("click", () => {
            commentInput.value = comment.content;
            submitButton.textContent = "댓글 수정";
            editingCommentId = comment.comment_id;
        });

        deleteCommentButton.addEventListener("click", () => {
            const commentDeleteModal = document.getElementById("commentDeleteModal");
            commentDeleteModal.style.display = "flex";

            document.getElementById("commentCancelButton").onclick = () => {
                commentDeleteModal.style.display = "none";
            };

            document.getElementById("commentConfirmButton").onclick = async () => {
                commentDeleteModal.style.display = "none";

                try {
                    const response = await fetch(`http://localhost:8080/posts/${postId}/comments/${comment.comment_id}`, {
                        method: "DELETE",
                    });

                    if (response.ok) {
                        alert("댓글이 삭제되었습니다.");
                        commentItem.remove();
                    } else {
                        const errorData = await response.json();
                        alert(`댓글 삭제 실패: ${errorData.message}`);
                    }
                } catch (error) {
                    console.error("Error deleting comment:", error);
                    alert("댓글 삭제 중 오류가 발생했습니다.");
                }
            };
        });
        
    };

    const addComment = async () => {
        const content = commentInput.value.trim();
        if (!content) return;

        const url = editingCommentId
            ? `http://localhost:8080/posts/${postId}/comments/${editingCommentId}`
            : `http://localhost:8080/posts/${postId}/comments`;
        const method = editingCommentId ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: 1, content })
            });
            console.log(response.status)

            if (response.ok) {
                if (editingCommentId) {
                    alert("댓글이 수정되었습니다.");
                    editingCommentId = null; // 수정 완료 후 초기화
                    submitButton.textContent = "댓글 등록";
                } else {
                    const { data: newComment } = await response.json();
                    displayComment(newComment);
                }
                commentInput.value = "";
                fetchComments(); // 댓글 목록 새로고침
            } else {
                const result = await response.json();
                alert(`오류: ${result.message}`);
            }
        } catch (error) {
            console.error("Error posting/updating comment", error);
            alert("댓글 작성/수정 중 오류가 발생했습니다.");
        }
    };

    submitButton.addEventListener("click", addComment);

    const handleCommentInput = () => {
        commentInput.addEventListener("input", () => {
            const isCommentFilled = commentInput.value.trim().length > 0;
            submitButton.disabled = !isCommentFilled;
            submitButton.style.backgroundColor = isCommentFilled ? "#7F6AEE" : "#ACA0EB";
        });
    };

    const deletePost = async () => {
        const deleteModal = document.getElementById("deleteModal");
        deleteModal.style.display = "flex";
    
        document.getElementById("cancelButton").onclick = () => {
            deleteModal.style.display = "none";
        };
    
        document.getElementById("confirmButton").onclick = async () => {
            deleteModal.style.display = "none";
            try {
                const response = await fetch(`http://localhost:8080/posts/${postId}`, {
                    method: "DELETE",
                });
                if (response.ok) {
                    alert("게시글이 삭제되었습니다.");
                    window.location.href = "/posts";
                } else {
                    const errorData = await response.json();
                    alert(`삭제 실패: ${errorData.message}`);
                }
            } catch (error) {
                console.error("Error deleting post:", error);
                alert("게시글 삭제 중 오류가 발생했습니다.");
            }
        };
    };

    const initialize = () => {
        if (postId) {
            fetchPost();
            fetchComments();
            handleCommentInput();
            submitButton.addEventListener("click", addComment);
            document.querySelector(".delete-button").addEventListener("click", deletePost);
        } else {
            console.error("Invalid post ID.");
        }
    };

    initialize();
});
