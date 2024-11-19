import { formatDate } from './utils.js';

document.addEventListener('DOMContentLoaded', function () {
    const postListContainer = document.querySelector('.post-list-container');
    let page = 1;
    let loading = false;

    const renderPost = post => {
        const postItem = document.createElement('div');
        postItem.classList.add('post-item');
        postItem.style.cursor = 'pointer';

        const postTitle =
            post.title.length > 26
                ? post.title.substring(0, 26) + '...'
                : post.title;

        const profileImageUrl = post.profile_image
            ? `http://localhost:8080${post.profile_image}`
            : 'http://localhost:8080/uploads/profile-icon.png';

        postItem.innerHTML = `
            <div class="post-title">${postTitle}</div>
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
                <div class="post-author-avatar">
                    <img
                    src="${profileImageUrl}"
                    alt="작성자 프로필"
                    class="post-author-profile"
                    />
                </div>
                <div class="post-author-name">${post.author}</div>
            </div>
        `;

        postItem.addEventListener('click', () => {
            window.location.href = `/post?id=${post.post_id}`;
        });

        postListContainer.appendChild(postItem);
    };

    const fetchPosts = async () => {
        if (loading) return;
        loading = true;
        try {
            const response = await fetch(
                `http://localhost:8080/posts?page=${page}`,
                { credentials: 'include' },
            );
            const { data: posts } = await response.json();

            console.log(posts)

            if (!posts || posts.length === 0) {
                console.log('더 이상 게시글이 없습니다.');
                loading = false;
                return;
            }

            posts.forEach(renderPost);

            page += 1;
        } catch (error) {
            console.error('Error fetching posts:', error);
            alert('게시글을 불러오는 중 문제가 발생했습니다.');
        } finally {
            loading = false;
        }
    };

    window.addEventListener('scroll', () => {
        if (
            window.innerHeight + window.scrollY >=
                document.body.offsetHeight - 100 &&
            !loading
        ) {
            fetchPosts();
        }
    });

    fetchPosts();
});
