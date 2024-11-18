document.addEventListener('DOMContentLoaded', function () {
    const profileImage = document.getElementById('profileImage');
    const dropdownMenu = document.getElementById('dropdownMenu');

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
});

function logout() {
    alert('로그아웃 되었습니다.');
    window.location.href = '/';
}
