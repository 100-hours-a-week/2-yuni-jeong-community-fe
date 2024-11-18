import { formatDate, formatNumber } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
    const postId = new URLSearchParams(window.location.search).get('id');
    const commentInput = document.querySelector('.comment-input');
    const submitButton = document.querySelector('.comment-submit-button');
    const postTitle = document.querySelector('.post-title');
    const postAuthor = document.querySelector('.post-author-name');
    const postDate = document.querySelector('.post-date');
    const postContent = document.querySelector('.post-content');
    const postImageContainer = document.querySelector('.post-image');
    const deleteButton = document.querySelector('.delete-button');

    let editingCommentId = null;

    const renderPost = post => {
        postTitle.textContent = post.title;
        postAuthor.textContent = post.author;
        postDate.textContent = formatDate(post.date);
        postContent.textContent = post.content;

        document.getElementById('likes-count').textContent = formatNumber(
            post.likes,
        );
        document.getElementById('views-count').textContent = formatNumber(
            post.views,
        );
        document.getElementById('comments-count').textContent = formatNumber(
            post.comments_count,
        );

        if (post.image_url) {
            postImageContainer.style.backgroundImage = `url(${post.image_url})`;
            postImageContainer.style.display = 'block';
        }

        if (post.isAuthor) {
            document.querySelector(".post-actions").style.display = "flex";
        } else {
            document.querySelector(".post-actions").style.display = "none";
        }
    };

    const fetchPost = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/posts/${postId}`,
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
            <div class="comment-author-avatar"></div>
            <div class="comment-content">
                <div class="comment-item-header">
                    <span class="comment-author-name">${comment.author}</span>
                    <span class="comment-date">${formatDate(comment.date)}</span>
                    <div class="comment-actions">
                    ${comment.isAuthor ? `
                        <button class="edit-button">수정</button>
                        <button class="delete-button">삭제</button>
                    ` : ''}
                    </div>
                </div>
                <p class="comment-text">${comment.content}</p>
            </div>
        `;
        setCommentActions(commentItem, comment);
        commentList.appendChild(commentItem);
    };

    const fetchComments = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/posts/${postId}/comments`,
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
                commentInput.value = comment.content;
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

    const deleteComment = async commentId => {
        try {
            const response = await fetch(
                `http://localhost:8080/posts/${postId}/comments/${commentId}`,
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
            ? `http://localhost:8080/posts/${postId}/comments/${editingCommentId}`
            : `http://localhost:8080/posts/${postId}/comments`;
        const method = editingCommentId ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: 1, content }),
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
                fetchComments();
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
                    `http://localhost:8080/posts/${postId}`,
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

    const handleCommentInput = () => {
        commentInput.addEventListener('input', () => {
            const isCommentFilled = commentInput.value.trim().length > 0;
            submitButton.disabled = !isCommentFilled;
            submitButton.style.backgroundColor = isCommentFilled
                ? '#7F6AEE'
                : '#ACA0EB';
        });
    };

    const initialize = () => {
        if (!postId) {
            console.error('Invalid post ID.');
            return;
        }

        fetchPost();
        fetchComments();
        handleCommentInput();

        submitButton.addEventListener('click', addOrUpdateComment);
        deleteButton?.addEventListener('click', deletePost);

        document.querySelector('.edit-button').addEventListener('click', () => {
            window.location.href = `/post/edit?id=${postId}`;
        });
    };

    initialize();
});
