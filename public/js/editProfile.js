import { validateNickname } from './validation.js';
import { updateButtonState, showToastMessage } from './utils.js';
import { initializeProfilePhoto } from './profilePhoto.js';

document.addEventListener('DOMContentLoaded', async function () {
    const emailDisplay = document.querySelector('.email-display');
    const nicknameInput = document.getElementById('nickname');
    const saveButton = document.getElementById('saveButton');
    const profilePhotoInput = document.getElementById('profilePhoto');
    const profilePhotoContainer = document.querySelector('.profile-photo');
    const profilePhotoHelper = document.querySelector('.profile-photo-helper');
    const plusIcon = document.querySelector('.plus-icon');
    const deleteAccountButton = document.getElementById('deleteAccountButton');
    const deleteAccountModal = document.getElementById('deleteAccountModal');
    const confirmButton = document.getElementById('confirmButton');
    const cancelButton = document.getElementById('cancelButton');

    initializeProfilePhoto(
        profilePhotoInput,
        profilePhotoContainer,
        profilePhotoHelper,
        plusIcon,
    );

    // 현재 유저 정보 불러오기
    const fetchUserInfo = async () => {
        try {
            const response = await fetch('http://localhost:8080/auth/current', {
                credentials: 'include',
            });
            if (response.ok) {
                const { data } = await response.json();
                emailDisplay.textContent = data.email;
                nicknameInput.value = data.nickname;

                if (data.profile_image) {
                    profilePhotoContainer.style.backgroundImage = `url(http://localhost:8080${data.profile_image})`;
                } else {
                    profilePhotoContainer.style.backgroundImage = 'url(http://localhost:8080/uploads/profile-icon.png)';
                }

                profilePhotoContainer.style.backgroundSize = 'cover';
                profilePhotoContainer.style.backgroundPosition = 'center';

                if (plusIcon) plusIcon.style.display = data.profile_image ? 'none' : 'flex';
                if (profilePhotoHelper) profilePhotoHelper.style.display = data.profile_image ? 'none' : 'block';

            } else {
                console.error('사용자 정보를 불러오는 데 실패했습니다.');
                showToastMessage('사용자 정보를 불러오는 데 실패했습니다.');
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
            showToastMessage(
                '서버 오류로 인해 사용자 정보를 불러오지 못했습니다.',
            );
        }
    };

    // 회원정보 수정 버튼 활성화 상태 업데이트
    const updateSaveButtonState = () => {
        const isFormValid = validateNickname(nicknameInput);
        updateButtonState(saveButton, isFormValid);
    };

    // 회원정보 수정 API
    const updateUserProfile = async () => {
        const formData = new FormData();
        formData.append('nickname', nicknameInput.value.trim());

        const file = profilePhotoInput.files[0];
        if (file) {
            formData.append('profile_image', file);
        } else {
            formData.append('profile_image', '');
        }

        try {
            const response = await fetch(
                'http://localhost:8080/users/profile',
                {
                    method: 'PUT',
                    credentials: 'include',
                    body: formData,
                },
            );

            const result = await response.json();

            if (response.ok) {
                showToastMessage('수정 완료');
                await fetchUserInfo();
            } else {
                showToastMessage(result.message || '수정 실패');
            }
        } catch (error) {
            console.error('Profile update error:', error);
            showToastMessage('서버 오류로 인해 수정 실패');
        }
    };

    const deleteAccount = async () => {
        try {
            const response = await fetch('http://localhost:8080/users', {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) {
                alert('회원 탈퇴가 완료되었습니다.');
                window.location.href = '/';
            } else {
                const result = await response.json();
                alert(result.message || '회원 탈퇴 실패');
            }
        } catch (error) {
            console.error('회원 탈퇴 오류:', error);
            alert('서버 오류로 인해 회원 탈퇴 실패');
        }
    };

    // 회원 탈퇴 모달 열기
    deleteAccountButton.addEventListener('click', () => {
        deleteAccountModal.style.display = 'flex';
    });

    // 모달 닫기
    cancelButton.addEventListener('click', () => {
        deleteAccountModal.style.display = 'none';
    });

    // 탈퇴 확인 버튼
    confirmButton.addEventListener('click', async () => {
        deleteAccountModal.style.display = 'none';
        await deleteAccount();
    });

    // 저장 버튼 클릭 이벤트
    saveButton?.addEventListener('click', async e => {
        e.preventDefault();
        if (validateNickname(nicknameInput)) {
            await updateUserProfile();
        }
    });

    // 입력 이벤트 리스너 추가
    nicknameInput?.addEventListener('input', updateSaveButtonState);

    // 초기화
    await fetchUserInfo();
});
