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
        }
    });

    // 프로필 사진 제거
    profilePhotoContainer?.addEventListener('click', () => {
        profilePhotoInput.value = '';
        profilePhotoContainer.style.backgroundImage = 'none';
        plusIcon.style.display = 'flex';
        if (profilePhotoHelper) profilePhotoHelper.style.display = 'block';
    });
};
