document.addEventListener("DOMContentLoaded", async function () {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get("id");

    if (postId) {
        try {
            // JSON 파일에서 게시글 데이터 가져오기
            const response = await fetch('/data/posts.json');
            const posts = await response.json();
            const post = posts.find(p => p.id == postId);

            if (post) {
                // 제목과 내용을 가져와 입력 필드에 표시
                document.getElementById("post-title").value = post.title;
                document.getElementById("post-content").value = post.content;
            } else {
                console.error("게시글 데이터를 불러올 수 없습니다.");
            }
        } catch (error) {
            console.error("Error fetching post data:", error);
        }
    } else {
        console.error("Invalid post ID.");
    }

    // 수정 완료 버튼 클릭 이벤트
    document.getElementById("edit-button").addEventListener("click", (e) => {
        e.preventDefault();
        
        const updatedPost = {
            id: postId,
            title: document.getElementById("post-title").value,
            content: document.getElementById("post-content").value,
        };
        
        // 수정된 데이터 콘솔에 출력
        console.log("수정된 게시글 데이터:", updatedPost);

        alert("게시글이 수정되었습니다.");
        window.location.href = `/post?id=${postId}`;
    });
});
