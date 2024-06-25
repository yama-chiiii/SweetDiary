import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase-config";
import logo from "./image/logo.png"; // 画像ファイルをインポート

const Login = () => {
    const navigate = useNavigate();
    const [isLineBrowser, setIsLineBrowser] = useState(false);

    useEffect(() => {
        const userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.includes("line")) {
            setIsLineBrowser(true);
        }
    }, []);

    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                console.log("ログイン成功:", result.user);
                navigate("/home");
            })
            .catch((error) => {
                console.error("ログインエラー:", error);
            });
    };

    if (isLineBrowser) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-pink-100 font-sans">
                <div className="flex flex-col items-center justify-center bg-white w-full sm:w-3/4 lg:w-1/2 h-screen rounded-lg shadow-lg text-center">
                    <p className="text-lg pb-8 text-pink-400">
                        LINEアプリ内のブラウザではログインできません。ChromeやSafariなどの標準ブラウザでアクセスしてください。
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-pink-100 font-sans">
            <div className="flex flex-col items-center justify-center bg-white w-full sm:w-3/4 lg:w-1/2 h-screen rounded-lg shadow-lg text-center">
                <img src={logo} alt="Logo" className="mx-auto mb-24 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96" />
                <p className="text-lg pb-8 text-pink-400">～おかし好きのためのかわいい記録帳♡～</p>
                <button onClick={signInWithGoogle} className="px-12 py-6 bg-pink-100 text-white text-xl rounded-lg hover:bg-pink-light">
                    ろぐいん！
                </button>
            </div>
        </div>
    );
};

export default Login;
