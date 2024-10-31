document.addEventListener("DOMContentLoaded", function() {
    const profilePhoto = document.getElementById("profilePhoto");
    const profilePhotoContainer = document.getElementById("profilePhotoContainer");
    const saveChangesButton = document.getElementById("saveChangesButton");
    const deleteAccountButton = document.getElementById("deleteAccountButton");
    const deleteAccountModal = document.getElementById("deleteAccountModal");
    const cancelButton = document.getElementById("cancelButton");
    const confirmButton = document.getElementById("confirmButton");

    // 프로필 사진 미리보기
    profilePhoto.addEventListener("change", function() {
        const file = profilePhoto.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profilePhotoContainer.style.backgroundImage = `url(${e.target.result})`;
                profilePhotoContainer.querySelector(".plus-icon").style.display = "none";
            };
            reader.readAsDataURL(file);
        }
    });

    // '회원 탈퇴' 버튼 클릭 시 모달 열기
    deleteAccountButton.addEventListener("click", function() {
        deleteAccountModal.style.display = "flex";
    });

    // 모달 '취소' 버튼 클릭 시 모달 닫기
    cancelButton.addEventListener("click", function() {
        deleteAccountModal.style.display = "none";
    });

    // 모달 '확인' 버튼 클릭 시 탈퇴 처리
    confirmButton.addEventListener("click", function() {
        alert("회원 탈퇴가 완료되었습니다.");
        window.location.href = "/";
    });
});
