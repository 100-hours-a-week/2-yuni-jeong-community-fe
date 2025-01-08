import { DEFAULT_PROFILE_IMAGE, API_BASE_URL } from './config.js';

document.addEventListener('DOMContentLoaded', async function () {
    const profileImage = document.getElementById('profileImage');
    const dropdownMenu = document.getElementById('dropdownMenu');

    const fetchUserProfile = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/current`, {
                credentials: 'include'
            })

            if (response.ok) {
                const { data } = await response.json();
                if (profileImage) {
                    profileImage.src = data.profile_image || DEFAULT_PROFILE_IMAGE;
                }
            } else {
                if (profileImage) {
                    profileImage.src = DEFAULT_PROFILE_IMAGE;
                }
            }
        } catch (error) {
            console.log('유저 정보 불러오기 실패 : ', error);
            profileImage.src = DEFAULT_PROFILE_IMAGE;
        }
    };

    if (profileImage && dropdownMenu) {
        profileImage.addEventListener('click', () => {
            dropdownMenu.style.display =
                dropdownMenu.style.display === 'flex' ? 'none' : 'flex';
        });

        document.addEventListener('click', event => {
            if (
                !profileImage.contains(event.target) &&
                !dropdownMenu.contains(event.target)
            ) {
                dropdownMenu.style.display = 'none';
            }
        });
    }

    await fetchUserProfile();
});

window.logout = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
        });

        if (response.ok) {
            alert('로그아웃 되었습니다.');
            window.location.href = '/';
        } else {
            alert('로그아웃 실패: 서버 문제');
        }
    } catch (error) {
        console.error('로그아웃 요청 실패:', error);
        alert('로그아웃 중 문제가 발생했습니다.');
    }
};
