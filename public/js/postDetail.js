import { API_BASE_URL, DEFAULT_PROFILE_IMAGE } from './config.js';
import { formatDate, formatNumber, checkLogin, decodeHTML } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
    await checkLogin();

    const post_id = new URLSearchParams(window.location.search).get('id');
    const commentInput = document.querySelector('.comment-input');
    const submitButton = document.querySelector('.comment-submit-button');
    const postTitle = document.querySelector('.post-title');
    const postAuthor = document.querySelector('.post-author-name');
    const postDate = document.querySelector('.post-date');
    const postContent = document.querySelector('.post-content');
    const postImageContainer = document.querySelector('.post-image');
    const deleteButton = document.querySelector('.delete-button');
    const likeButton = document.getElementById('likes-button');
    const likesCountElement = document.getElementById('likes-count');

    let editingCommentId = null;

    // 현재 유저 ID 반환
    const getCurrentUserId = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/current`, {
                credentials: 'include',
            });
    
            if (response.ok) {
                const { data } = await response.json();
                return data.user_id; // 사용자 ID 반환
            } else {
                console.error('사용자 정보를 가져오지 못했습니다.');
                return null;
            }
        } catch (error) {
            console.error('Error fetching current user ID:', error);
            return null;
        }
    };

    const renderPost =async(post) => {
        postTitle.textContent = decodeHTML(post.title);
        postAuthor.textContent = decodeHTML(post.author);
        postDate.textContent = formatDate(post.created_at);
        postContent.textContent = decodeHTML(post.content).replace(/\n/g, '<br>');

        const postAuthorProfileImage = document.getElementById('postAuthorProfileImage');
        postAuthorProfileImage.src = post.profile_image || DEFAULT_PROFILE_IMAGE;
        postImageContainer.innerHTML = '';

        if (post.image_url) {
            // 이미지가 있는 경우
            const img = document.createElement('img');
            img.src = post.image_url;
            img.alt = '게시글 이미지';
            
            img.onload = () => {
                postImageContainer.classList.add('has-image');
                postImageContainer.appendChild(img);
            };
    
            img.onerror = () => {
                console.error('이미지 로드 실패');
                postImageContainer.classList.remove('has-image');
            };
        } else {
            // 이미지가 없는 경우
            postImageContainer.classList.remove('has-image');
            // postImageContainer.style.backgroundColor = '#f3f3f3';
        }

        document.getElementById('likes-count').textContent = formatNumber(
            post.likes,
        );
        document.getElementById('views-count').textContent = formatNumber(
            post.views,
        );
        document.getElementById('comments-count').textContent = formatNumber(
            post.comments_count,
        );

        if (post.isAuthor) {
            document.querySelector(".post-actions").style.display = "flex";
        } else {
            document.querySelector(".post-actions").style.display = "none";
        }

        if (post.isLiked) {
            likeButton.classList.add('liked');
        } else {
            likeButton.classList.remove('liked');
        }
    };

    const fetchPost = async () => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/posts/${post_id}`,
                {
                    credentials: 'include',
                },
            );
            const { data: post } = await response.json();

            if (post) {
                renderPost(post);
            } else {
                postContent.textContent = '게시글을 찾을 수 없습니다.';
            }
        } catch (error) {
            console.error('Error fetching post:', error);
            alert('게시글을 불러오는 중 문제가 발생했습니다.');
        }
    };

    const renderComment = comment => {
        const commentList = document.querySelector('.comment-list');
        const commentItem = document.createElement('div');
        commentItem.classList.add('comment-item');

        commentItem.innerHTML = `
            <div class="comment-author-avatar">
                <img
                    src="${comment.profile_image || DEFAULT_PROFILE_IMAGE}"
                    alt="프로필 이미지"
                    class="comment-author-profile"
                />
            </div>
            <div class="comment-content">
                <div class="comment-item-header">
                    <span class="comment-author-name">}</span>
                    <span class="comment-date">${formatDate(comment.created_at)}</span>
                    <div class="comment-actions">
                    ${comment.isAuthor ? `
                        <button class="edit-button">수정</button>
                        <button class="delete-button">삭제</button>
                    ` : ''}
                    </div>
                </div>
                <p class="comment-text"></p>
            </div>
        `;
        
        const authorNameElement = commentItem.querySelector('.comment-author-name');
        const commentTextElement = commentItem.querySelector('.comment-text');
        authorNameElement.textContent = decodeHTML(comment.author);
        commentTextElement.textContent = decodeHTML(comment.content);

        setCommentActions(commentItem, comment);
        commentList.appendChild(commentItem);
    };

    const fetchComments = async () => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/posts/${post_id}/comments`,
                {
                    credentials: 'include',
                },
            );
            const { data: comments } = await response.json();

            const commentList = document.querySelector('.comment-list');
            commentList.innerHTML = '';
            comments.forEach(renderComment);
        } catch (error) {
            console.error('Error fetching comments:', error);
            alert('댓글을 불러오는 중 문제가 발생했습니다.');
        }
    };

    const setCommentActions = (commentItem, comment) => {
        const editButton = commentItem.querySelector('.edit-button');
        const deleteButton = commentItem.querySelector('.delete-button');

        if (editButton){
            editButton.addEventListener('click', () => {
                commentInput.value = decodeHTML(comment.content);
                submitButton.textContent = '댓글 수정';
                editingCommentId = comment.comment_id;
            });
        }

        if (deleteButton) {
            deleteButton.addEventListener('click', () => {
                const deleteModal = document.getElementById('commentDeleteModal');
                deleteModal.style.display = 'flex';
    
                document.getElementById('commentCancelButton').onclick = () => {
                    deleteModal.style.display = 'none';
                };
    
                document.getElementById('commentConfirmButton').onclick =
                    async () => {
                        deleteModal.style.display = 'none';
                        await deleteComment(comment.comment_id);
                    };
            });
        }
    };

    const deleteComment = async comment_id => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/posts/${post_id}/comments/${comment_id}`,
                {
                    method: 'DELETE',
                    credentials: 'include',
                },
            );

            if (response.ok) {
                alert('댓글이 삭제되었습니다.');
                fetchComments();
            } else {
                const errorData = await response.json();
                alert(`댓글 삭제 실패: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
            alert('댓글 삭제 중 오류가 발생했습니다.');
        }
    };

    const addOrUpdateComment = async () => {
        const content = commentInput.value.trim();
        if (!content) return;

        const url = editingCommentId
            ? `${API_BASE_URL}/posts/${post_id}/comments/${editingCommentId}`
            : `${API_BASE_URL}/posts/${post_id}/comments`;
        const method = editingCommentId ? 'PATCH' : 'POST';
        const currentUserId = await getCurrentUserId();

        try {
            const response = await fetch(url, {
                method,
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentUserId, content }),
            });

            if (response.ok) {
                if (editingCommentId) {
                    alert('댓글이 수정되었습니다.');
                    editingCommentId = null;
                    submitButton.textContent = '댓글 등록';
                } else {
                    alert('댓글이 등록되었습니다.');
                }
                commentInput.value = '';
                await fetchComments();
            } else {
                const result = await response.json();
                alert(`오류: ${result.message}`);
            }
        } catch (error) {
            console.error('Error adding/updating comment:', error);
            alert('댓글 작성/수정 중 문제가 발생했습니다.');
        }
    };

    const deletePost = async () => {
        const deleteModal = document.getElementById('deleteModal');
        deleteModal.style.display = 'flex';

        document.getElementById('cancelButton').onclick = () => {
            deleteModal.style.display = 'none';
        };

        document.getElementById('confirmButton').onclick = async () => {
            deleteModal.style.display = 'none';

            try {
                const response = await fetch(
                    `${API_BASE_URL}/posts/${post_id}`,
                    {
                        method: 'DELETE',
                        credentials: 'include',
                    },
                );

                if (response.ok) {
                    alert('게시글이 삭제되었습니다.');
                    window.location.href = '/posts';
                } else {
                    const errorData = await response.json();
                    alert(`게시글 삭제 실패: ${errorData.message}`);
                }
            } catch (error) {
                console.error('Error deleting post:', error);
                alert('게시글 삭제 중 오류가 발생했습니다.');
            }
        };
    };

    const toggleLike = async () => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/posts/${post_id}/like`,
                {
                    method: 'POST',
                    credentials: 'include',
                }
            );

            const result = await response.json();

            if (response.ok) {
                likesCountElement.textContent = formatNumber(result.data.likes);

                if (result.data.isLiked) {
                    likeButton.classList.add('liked');
                } else {
                    likeButton.classList.remove('liked');
                }
            } else {
                alert(result.message || '좋아요 처리 실패');
            }
        } catch (error) {
            console.error('Error toggling like:', error);
            alert('좋아요 처리 중 문제가 발생했습니다.');
        }
    };

    likeButton.addEventListener('click', toggleLike);

    const handleCommentInput = () => {
        commentInput.addEventListener('input', () => {
            const isCommentFilled = commentInput.value.trim().length > 0;
            submitButton.disabled = !isCommentFilled;
            submitButton.style.backgroundColor = isCommentFilled
                ? '#272f7a'
                : '#708dc7';
        });
    };

    const initialize = () => {
        if (!post_id) {
            console.error('Invalid post ID.');
            return;
        }

        fetchPost();
        fetchComments();
        handleCommentInput();

        submitButton.addEventListener('click', addOrUpdateComment);
        deleteButton?.addEventListener('click', deletePost);

        document.querySelector('.edit-button').addEventListener('click', () => {
            window.location.href = `/post/edit?id=${post_id}`;
        });
    };

    initialize();
});
