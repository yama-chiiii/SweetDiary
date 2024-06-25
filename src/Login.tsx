import { GoogleAuthProvider, getRedirectResult, signInWithRedirect } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase-config";
import logo from "./image/logo.png"; // 画像ファイルをインポート

const Login = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const userAgent = navigator.userAgent.toLowerCase();

    useEffect(() => {
        const fetchRedirectResult = async () => {
            console.log("Fetching redirect result...");
            setLoading(true); // ローディングを開始
            try {
                const result = await getRedirectResult(auth);
                if (result && result.user) {
                    console.log("ログイン成功:", result.user);
                    sessionStorage.clear(); // セッションストレージをクリア
                    navigate("/home");
                } else {
                    console.log("リダイレクト結果が取得できませんでした。");
                }
            } catch (error) {
                console.error("ログインエラー:", error);
            } finally {
                setLoading(false); // ローディングを終了
            }
        };

        if (!userAgent.includes("line")) {
            console.log("Not in LINE browser, fetching redirect result");
            fetchRedirectResult();
        } else {
            console.log("In LINE browser, skip fetching redirect result");
        }
    }, [userAgent, navigate]);

    const signInWithGoogle = () => {
        console.log("Sign in with Google triggered");
        setLoading(true); // ローディングを開始
        const provider = new GoogleAuthProvider();
        signInWithRedirect(auth, provider).catch((error) => {
            console.error("リダイレクト中のエラー:", error);
            setLoading(false); // エラーが発生した場合、ローディングを終了
        });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-pink-100 font-sans">
            <div className="flex flex-col items-center justify-center bg-white w-full sm:w-3/4 lg:w-1/2 h-screen rounded-lg shadow-lg text-center">
                <img src={logo} alt="Logo" className="mx-auto mb-24 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96" />
                <p className="text-lg pb-8 text-pink-400">～おかし好きのためのかわいい記録帳♡～</p>
                {loading ? (
                    <div className="flex items-center justify-center">
                        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
                    </div>
                ) : (
                    <button
                        onClick={() => {
                            console.log("Login button clicked");
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
                )}
            </div>
        </div>
    );
};

export default Login;
