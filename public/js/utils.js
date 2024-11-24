export const updateButtonState = (button, isValid) => {
    if (!button) return;
    button.disabled = !isValid;
    button.style.backgroundColor = isValid ? '#272f7a' : '#708dc7';
};

export const showToastMessage = message => {
    const toast = document.createElement('div');
    toast.textContent = message;
    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '10px 20px',
        backgroundColor: '#242424',
        color: '#fff',
        borderRadius: '5px',
        zIndex: 1000,
    });
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 2000);
};

export const formatDate = (dateString) => {
    if (!dateString) return '알 수 없음';

    try {
        const date = new Date(dateString); // UTC 시간 생성
        const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000); // 로컬 시간 변환
        const year = localDate.getFullYear();
        const month = String(localDate.getMonth() + 1).padStart(2, '0');
        const day = String(localDate.getDate()).padStart(2, '0');
        const hours = String(localDate.getHours()).padStart(2, '0');
        const minutes = String(localDate.getMinutes()).padStart(2, '0');
        const seconds = String(localDate.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    } catch (error) {
        console.error('날짜 포맷 오류:', error);
        return '알 수 없음';
    }
};



export const formatNumber = (num) => (
    num >= 100000 ? `${Math.floor(num / 1000)}k` :
    num >= 10000 ? `${Math.floor(num / 1000)}k` :
    num >= 1000 ? `${Math.floor(num / 100) / 10}k` :
    num
);

export const checkLogin = async () => {
    try {
        const response = await fetch('http://localhost:8080/auth/current', {
            credentials: 'include',
        });

        // 로그인 안됐으면 로그인 페이지로 이동
        if (!response.ok) {
            alert('로그인 상태가 아닙니다. 로그인 페이지로 이동합니다. ')
            window.location.href = '/';
        }
    } catch (error) {
        console.error('로그인 확인 중 오류 발생:', error);
        window.location.href = '/';
    }
};
