document.addEventListener("DOMContentLoaded", async function () {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get("id");

    function formatNumber(num) {
        if (num >= 100000) return `${Math.floor(num / 1000)}k`;
        if (num >= 10000) return `${Math.floor(num / 1000)}k`;
        if (num >= 1000) return `${Math.floor(num / 100) / 10}k`;
        return num;
    }

    if (postId !== null) {
        try {
            const postResponse = await fetch('/data/posts.json');
            const posts = await postResponse.json();
            const post = posts.find(p => p.id == postId);

            if (post) {
                document.querySelector(".post-title").textContent = post.title;
                document.querySelector(".post-author-name").textContent = post.author;
                document.querySelector(".post-date").textContent = post.date;
                document.querySelector(".post-content").textContent = post.content;
                document.getElementById("likes-count").textContent = formatNumber(post.likes);
                document.getElementById("views-count").textContent = formatNumber(post.views);
                document.getElementById("comments-count").textContent = formatNumber(post.comments);

                const editButton = document.querySelector(".edit-button");
                editButton.addEventListener("click", () => {
                    window.location.href = `/post/edit?id=${postId}`;
                });
            } else {
                console.error("Post not found for ID:", postId);
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
                            <span class="comment-date">${comment.date}</span>
                        </div>
                        <p class="comment-text">${comment.content}</p>
                    </div>
                `;
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
