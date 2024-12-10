import { DEFAULT_PROFILE_IMAGE } from './config.js';
export const initializeProfilePhoto = (
    profilePhotoInput,
    profilePhotoContainer,
    profilePhotoHelper,
    plusIcon,
) => {
    // 프로필 사진 변경
    profilePhotoInput?.addEventListener('change', () => {
        const file = profilePhotoInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = e => {
                profilePhotoContainer.style.backgroundImage = `url(${e.target.result})`;
                profilePhotoContainer.style.backgroundSize = 'cover';
                profilePhotoContainer.style.backgroundPosition = 'center';
                plusIcon.style.display = 'none';
                if (profilePhotoHelper)
                    profilePhotoHelper.style.display = 'none';
            };
            reader.readAsDataURL(file);
        } else {
            // 파일 선택이 취소되었을 경우 기본 이미지로 설정
            resetToDefaultProfileImage(profilePhotoContainer, plusIcon, profilePhotoHelper);
        }
    });

    // 프로필 사진 제거
    profilePhotoContainer?.addEventListener('click', () => {
        profilePhotoInput.value = ''; // 파일 입력 초기화
        resetToDefaultProfileImage(profilePhotoContainer, plusIcon, profilePhotoHelper);
    });
};

const resetToDefaultProfileImage = (profilePhotoContainer, plusIcon, profilePhotoHelper) => {
    profilePhotoContainer.style.backgroundImage = `url(${DEFAULT_PROFILE_IMAGE})`;
    profilePhotoContainer.style.backgroundSize = 'cover';
    profilePhotoContainer.style.backgroundPosition = 'center';
    if (plusIcon) plusIcon.style.display = 'flex';
    if (profilePhotoHelper) profilePhotoHelper.style.display = 'block';
};

