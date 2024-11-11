document.addEventListener("DOMContentLoaded", async () => {
    const postId = new URLSearchParams(window.location.search).get("id");

    if (!postId) return console.error("Invalid post ID.");

    const titleInput = document.getElementById("post-title");
    const contentInput = document.getElementById("post-content");
    const editButton = document.getElementById("edit-button");

    // 서버에서 게시글 데이터 가져오기
    try {
        const response = await fetch(`http://localhost:8080/posts/${postId}`);
        const { data: post } = await response.json();

        if (post) {
            titleInput.value = post.title;
            contentInput.value = post.content;
            editButton.disabled = false;  // 수정 완료 버튼 활성화
        } else {
            console.error("게시글 데이터를 불러올 수 없습니다.");
        }
    } catch (error) {
        console.error("Error fetching post data:", error);
    }

    // 입력 유효성 검사 함수
    const validateInputs = () => {
        const isTitleValid = titleInput.value.trim().length > 0 && titleInput.value.length <= 26;
        const isContentValid = contentInput.value.trim().length > 0;

        editButton.disabled = !(isTitleValid && isContentValid);
        editButton.style.backgroundColor = editButton.disabled ? "#ACA0EB" : "#7F6AEE";
    };

    // 입력 이벤트에 따라 수정 버튼 활성화 상태 업데이트
    titleInput.addEventListener("input", validateInputs);
    contentInput.addEventListener("input", validateInputs);

    // 수정 완료 버튼 클릭 이벤트
    editButton.addEventListener("click", async (e) => {
        console.log("수정 버튼 클릭됨"); // 클릭 이벤트 확인
        e.preventDefault();

        const updatedPost = {
            title: titleInput.value,
            content: contentInput.value,
            image_url: ""
        };

        console.log("수정 요청 시작");
        try {
            const response = await fetch(`http://localhost:8080/posts/${postId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedPost)
            });
            console.log("수정 요청 완료");
            if (response.ok) {
                alert("게시글이 수정되었습니다.");
                setTimeout(() => window.location.href = "/posts", 1000);
            } else {
                const result = await response.json();
                alert(`수정 실패: ${result.message}`);
            }
        } catch (error) {
            console.error("Error updating post:", error);
            alert("게시글 수정 중 오류가 발생했습니다.");
        }
    });
});
