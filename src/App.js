import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Calendar from './Calender'; // カレンダーコンポーネントをインポート
import DetailsForm from './DetailsForm';
import Login from './Login';
import { UserProvider } from './context/UseContext'; // インポートパスを修正

function App() {
  return (
    <UserProvider> {/* UserProvider で全体をラップ */}
      <Router>
        <div className="w-full h-screen bg-white"> {/* アプリケーション全体の背景を白に設定 */}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Calendar />} /> {/* カレンダーコンポーネントを直接表示 */}
            <Route path="/details" element={<DetailsForm />} />
            <Route path="/" element={<Navigate to="/login" />} /> {/* 最初にログイン画面にリダイレクト */}
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
