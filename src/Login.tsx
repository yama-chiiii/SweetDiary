import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase-config";
import logo from "./image/logo.png"; // 画像ファイルをインポート

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const navigate = useNavigate();
    const userAgent = navigator.userAgent.toLowerCase();

    useEffect(() => {
        const checkLoginState = async () => {
            setLoading(true);
            try {
                auth.onAuthStateChanged((user) => {
                    if (user) {
                        console.log("ログイン成功:", user);
                        navigate("/home");
                    } else {
                        console.log("ユーザーが見つかりません。");
                    }
                });
            } catch (error) {
                console.error("ログインエラー:", error);
            } finally {
                setLoading(false);
            }
        };

        if (!userAgent.includes("line")) {
            console.log("Not in LINE browser, checking login state");
            checkLoginState();
        } else {
            console.log("In LINE browser, skip login state check");
        }
    }, [userAgent, navigate]);

    const signInWithGoogle = () => {
        console.log("Sign in with Google triggered");
        setLoading(true);
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider).catch((error) => {
            console.error("ポップアップ中のエラー:", error);
            setLoading(false);
        });
    };

    useEffect(() => {
        if (/Android|iPhone/i.test(navigator.userAgent)) {
            setShowWarning(true);
        }
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-pink-100 font-sans">
            {showWarning && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                        <h2 className="text-2xl font-bold mb-4 text-pink-500">ご注意ください</h2>
                        <p className="mb-4 text-gray-700">
                            外部ブラウザでないとログインがうまくいかない場合があります。ChromeやSafariを使用してください。
                        </p>
                        <button onClick={() => setShowWarning(false)} className="px-4 py-2 bg-pink-100 text-white rounded-lg hover:bg-pink-200">
                            OK
                        </button>
                    </div>
                </div>
            )}
            <div className="flex flex-col items-center justify-center bg-white w-full sm:w-3/4 lg:w-1/2 h-screen rounded-lg shadow-lg text-center">
                {loading ? (
                    <div className="loader">
                        <div className="wave"></div>
                        <div className="wave"></div>
                        <div className="wave"></div>
                    </div>
                ) : (
                    <>
                        <img src={logo} alt="Logo" className="mx-auto mb-24 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96" />
                        <p className="text-lg pb-8 text-pink-400">～おかし好きのためのかわいい記録帳♡～</p>
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
                    </>
                )}
            </div>
        </div>
    );
};

export default Login;
