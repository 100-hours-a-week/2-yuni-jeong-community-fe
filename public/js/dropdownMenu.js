document.addEventListener('DOMContentLoaded', async function () {
    const profileImage = document.getElementById('profileImage');
    const dropdownMenu = document.getElementById('dropdownMenu');

    const fetchUserProfile = async () => {
        try {
            const response = await fetch('http://localhost:8080/auth/current', {
                credentials: 'include'
            })

            console.log(response)
            if (response.ok) {
                const { data } = await response.json();
                profileImage.src = `http://localhost:8080${data.profile_image || '/uploads/user-profile.jpg'}`;
            } else {
                profileImage.src = 'http://localhost:8080/uploads/user-profile.jpg';
            }
        } catch (error) {
            console.log('유저 정보 불러오기 실패 : ', error);
            profileImage.src = 'http://localhost:8080/uploads/user-profile.jpg';
        }
    } 

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

    await fetchUserProfile();
});

const logout = async () => {
    try {
        const response = await fetch('http://localhost:8080/auth/logout', {
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
