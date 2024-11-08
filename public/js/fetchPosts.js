document.addEventListener("DOMContentLoaded", function () {
    const postListContainer = document.querySelector('.post-list-container');
    let page = 1;
    let loading = false;

    async function fetchPosts() {
        try {
            const response = await fetch('/data/posts.json');
            // const response = await fetch(`/data/posts_page_${page}.json`);
            const posts = await response.json();

            posts.forEach((post) => {
                const postItem = document.createElement('div');
                postItem.classList.add('post-item');
                postItem.style.cursor = "pointer";

                const postTitle = post.title.length > 26 ? post.title.substring(0, 26) + '...' : post.title;

                postItem.innerHTML = `
                    <div class="post-title">${post.title}</div>
                    <div class="post-info-container">
                        <div class="post-info-left">
                            <span>좋아요 ${post.likes}</span>
                            <span>댓글 ${post.comments_count}</span>
                            <span>조회수 ${post.views}</span>
                        </div>
                        <div class="post-info-right">${new Date(post.date).toLocaleString()}</div>
                    </div>
                    <div class="post-divider"></div>
                    <div class="post-author-container">
                        <div class="post-author-avatar"></div>
                        <div class="post-author-name">${post.author}</div>
                    </div>
                `;

                postItem.addEventListener("click", () => {
                    window.location.href = `/post?id=${post.post_id}`;
                });
                postListContainer.appendChild(postItem);
            });

            loading = false;
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    }

    window.addEventListener("scroll", () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !loading) {
            loading = true;
            page += 1;
            fetchPosts(page);
        }
    });

    fetchPosts(page);
});
