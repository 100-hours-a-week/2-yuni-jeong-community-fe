export const updateButtonState = (button, isValid) => {
    if (!button) return;
    button.disabled = !isValid;
    button.style.backgroundColor = isValid ? "#7F6AEE" : "#ACA0EB";
};

export const showToastMessage = (message) => {
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
        borderRadius: "5px",
        zIndex: 1000,
    });
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 2000);
};

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const formatNumber = (num) => (
    num >= 100000 ? `${Math.floor(num / 1000)}k` :
    num >= 10000 ? `${Math.floor(num / 1000)}k` :
    num >= 1000 ? `${Math.floor(num / 100) / 10}k` :
    num
);

