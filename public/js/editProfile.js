document.addEventListener("DOMContentLoaded", async function() {
    const profilePhoto = document.getElementById("profilePhoto");
    const profilePhotoContainer = document.getElementById("profilePhotoContainer");
    const deleteAccountButton = document.getElementById("deleteAccountButton");
    const deleteAccountModal = document.getElementById("deleteAccountModal");
    const cancelButton = document.getElementById("cancelButton");
    const confirmButton = document.getElementById("confirmButton");
    const emailDisplay = document.querySelector(".email-display");
    const nicknameInput = document.getElementById("nickname");
    const editButton = document.getElementById("editButton");

    let user_id;

    // 현재 유저 정보 불러오기
    try {
        const response = await fetch("http://localhost:8080/auth/current", { credentials: 'include'});
        if (response.ok){
            const { data } = await response.json();
            emailDisplay.textContent = data.email;
            nicknameInput.value = data.nickname;
            user_id = data.user_id;
        } else {
            console.error("사용자 정보를 불러오는 데 실패했습니다.");
        }
    } catch (error) {
        console.error("Error fetching user info : ", error);
    }

    // 닉네임 유효성 검사
    const validateNickname = () => {
        const nicknameInput = document.getElementById("nickname");
        const nicknameValue = nicknameInput.value.trim();
        const nicknameHelper = nicknameInput.nextElementSibling;
    
        if (!nicknameValue) {
            nicknameHelper.textContent = "*닉네임을 입력해주세요.";
            return false;
        } else if (/\s/.test(nicknameValue)) {
            nicknameHelper.textContent = "*띄어쓰기를 없애주세요.";
            return false;
        } else if (nicknameValue.length > 10) {
            nicknameHelper.textContent = "*닉네임은 최대 10자까지 가능합니다.";
            return false;
        } else {
            nicknameHelper.textContent = "";
            return true;
        }
    };

    // 수정하기 버튼 색깔 업데이트
    const updateEditButtonState = () => {
        const isValidNickname = validateNickname();
        editButton.disabled = !isValidNickname;
        editButton.style.backgroundColor = isValidNickname ? "#7F6AEE" : "#ACA0EB";
    };

    // 수정하기 버튼 클릭 시 서버에 요청
    editButton.addEventListener("click", async () => {
        if (!validateNickname()) {
            alert("유효한 닉네임을 입력해주세요.");
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:8080/users/${user_id}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nickname: nicknameInput.value.trim(),
                    profile_image: profilePhotoContainer.style.backgroundImage || ""
                })
            });
    
            const result = await response.json();
    
            if (response.ok) {
                showToastMessage("회원 정보가 수정되었습니다!");
            } else {
                showToastMessage(result.message);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            showToastMessage("회원 정보 수정 중 오류가 발생했습니다.");
        }
    });

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


    document.getElementById("nickname").addEventListener("input", updateEditButtonState); 





    const showToastMessage = (message) => {
        const toast = document.createElement("div");
        toast.textContent = message;
        Object.assign(toast.style, {
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "10px 20px",
            backgroundColor: "#242424",
            color: "#fff",
            borderRadius: "5px"
        });
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 2000);
    }
    
    
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
