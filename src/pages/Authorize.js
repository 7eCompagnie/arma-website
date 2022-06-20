import { useNavigate } from "react-router-dom";

function Authorize() {
    const navigate = useNavigate();

    window.onload = function () {
        const urlParams = new URLSearchParams(window.location.search);

        // Create a cookie that expire in 30 days
        const expires = new Date();
        expires.setDate(expires.getDate() + 30);
        document.cookie = `token=${urlParams.get("code")}; expires=${expires.toUTCString()}; path=/`;
        navigate("/dashboard");
    };

    return (<>
    </>);
}

export default Authorize;
