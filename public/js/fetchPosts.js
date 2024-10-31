document.addEventListener("DOMContentLoaded", function () {
    const postListContainer = document.querySelector('.post-list-container');

    async function fetchPosts() {
        try {
            const response = await fetch('/data/posts.json');
            const posts = await response.json();

            posts.forEach((post) => {
                const postItem = document.createElement('div');
                postItem.classList.add('post-item');
                postItem.style.cursor = "pointer";
                postItem.innerHTML = `
                    <div class="post-title">${post.title}</div>
                    <div class="post-info-container">
                        <div class="post-info-left">
                            <span>좋아요 ${post.likes}</span>
                            <span>댓글 ${post.comments}</span>
                            <span>조회수 ${post.views}</span>
                        </div>
                        <div class="post-info-right">${post.date}</div>
                    </div>
                    <div class="post-divider"></div>
                    <div class="post-author-container">
                        <div class="post-author-avatar"></div>
                        <div class="post-author-name">${post.author}</div>
                    </div>
                `;

                postItem.addEventListener("click", () => {
                    window.location.href = `/post?id=${post.id}`;
                });

                postListContainer.appendChild(postItem);
            });
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    }

    fetchPosts();
});
