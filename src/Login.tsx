import { GoogleAuthProvider, getRedirectResult, signInWithRedirect } from "firebase/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase-config";
import logo from "./image/logo.png"; // 画像ファイルをインポート

const Login = () => {
    const navigate = useNavigate();
    const userAgent = navigator.userAgent.toLowerCase();

    useEffect(() => {
        const fetchRedirectResult = async () => {
            try {
                const result = await getRedirectResult(auth);
                if (result && result.user) {
                    console.log("ログイン成功:", result.user);
                    sessionStorage.setItem("user", JSON.stringify(result.user));
                    navigate("/home");
                } else {
                    console.log("リダイレクト結果が取得できませんでした。");
                }
            } catch (error) {
                console.error("ログインエラー:", error);
            }
        };

        if (!userAgent.includes("line")) {
            fetchRedirectResult();
        }
    }, [userAgent, navigate]);

    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        signInWithRedirect(auth, provider);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-pink-100 font-sans">
            <div className="flex flex-col items-center justify-center bg-white w-full sm:w-3/4 lg:w-1/2 h-screen rounded-lg shadow-lg text-center">
                <img src={logo} alt="Logo" className="mx-auto mb-24 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96" />
                <p className="text-lg pb-8 text-pink-400">～おかし好きのためのかわいい記録帳♡～</p>
                <button
                    onClick={() => {
                        if (userAgent.includes("line")) {
                            alert("LINE内ブラウザではGoogleログインがサポートされていません。外部ブラウザで開いてください。");
                        } else {
                            signInWithGoogle();
                        }
                    }}
                    className="px-12 py-6 bg-pink-100 text-white text-xl rounded-lg hover:bg-pink-light"
                >
                    ろぐいん！
                </button>
            </div>
        </div>
    );
};

export default Login;
