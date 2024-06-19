import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Calendar from "./Calender"; // 正しいコンポーネント名に注意
import DetailsForm from "./DetailsForm";
import Login from "./Login";
import { IconProvider } from "./context/IconContext"; // IconContext のインポート
import { UserProvider } from "./context/UseContext"; // インポートパスを修正

function App() {
    return (
        <UserProvider>
            {" "}
            {/* UserProvider で全体をラップ */}
            <IconProvider>
                {" "}
                {/* IconProvider でさらにラップ */}
                <Router>
                    <div className="w-full h-screen bg-white">
                        {" "}
                        {/* アプリケーション全体の背景を白に設定 */}
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/home" element={<Calendar />} /> {/* カレンダーコンポーネントを直接表示 */}
                            <Route path="/details" element={<DetailsForm />} />
                            <Route path="/" element={<Navigate to="/login" />} /> {/* 最初にログイン画面にリダイレクト */}
                        </Routes>
                    </div>
                </Router>
            </IconProvider>
        </UserProvider>
    );
}

export default App;
