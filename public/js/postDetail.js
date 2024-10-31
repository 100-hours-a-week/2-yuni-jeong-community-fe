document.addEventListener("DOMContentLoaded", async function () {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get("id");

    if (postId !== null) {
        try {
            // 게시글 정보 가져오기
            const postResponse = await fetch('/data/posts.json');
            const posts = await postResponse.json();
            const post = posts.find(p => p.id == postId);

            if (post) {
                document.querySelector(".post-title").textContent = post.title;
                document.querySelector(".post-author-name").textContent = post.author;
                document.querySelector(".post-date").textContent = post.date;
                document.querySelector(".post-content").textContent = post.content;
                document.getElementById("likes-count").textContent = post.likes;
                document.getElementById("views-count").textContent = post.views;
                document.getElementById("comments-count").textContent = post.comments;
            } else {
                console.error("Post not found for ID:", postId);
                document.querySelector(".post-content").textContent = "게시글을 찾을 수 없습니다.";
            }

            // 댓글 정보 가져오기
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
        } catch (error) {
            console.error("Error fetching post details:", error);
        }
    } else {
        console.error("Invalid post ID.");
    }
});

