document.addEventListener("DOMContentLoaded", function () {
    const postListContainer = document.querySelector('.post-list-container');
    let page = 1;
    let loading = false;

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

    async function fetchPosts() {
        if (loading) return;
        loading = true;
        try {
            const response = await fetch(`http://localhost:8080/posts?page=${page}`, { credentials: 'include'});
            const { data: posts } = await response.json();

            if (posts.length === 0) {
                loading = false;
                return;
            }
    
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
                        <div class="post-info-right">${formatDate(post.date)}</div>
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

            page += 1;
            loading = false;
        } catch (error) {
            console.error("Error fetching posts:", error);
            loading = false;
        }
    }

    window.addEventListener("scroll", () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !loading) {
            fetchPosts();
        }
    });

    fetchPosts();
});
