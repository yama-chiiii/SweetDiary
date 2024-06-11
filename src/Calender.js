import { getAuth, signOut } from 'firebase/auth';
import moment from 'moment';
import 'moment/locale/ja'; // 日本語のロケールをインポート
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from './context/UseContext'; // インポートパスを修正
import memoImage from './memo.png'; // 画像ファイルをインポート

moment.locale('ja'); // momentのロケールを日本語に設定

const Calendar = () => {
    const [currentMonth, setCurrentMonth] = useState(moment());
    const days = ['にち', 'げつ', 'か', 'すい', 'もく', 'きん', 'ど'];
    const { user, setUser } = useContext(UserContext); // Contextからユーザー情報を取得
    const auth = getAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = () => {
            const currentUser = auth.currentUser;
            if (currentUser) {
                setUser(currentUser);
            }
        };
        fetchUser();
    }, [auth, setUser]);

    const nextMonth = () => {
        setCurrentMonth(currentMonth.clone().add(1, 'months'));
    };

    const previousMonth = () => {
        setCurrentMonth(currentMonth.clone().subtract(1, 'months'));
    };

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                navigate('/login');
            })
            .catch((error) => {
                console.error('ログアウトエラー:', error);
            });
    };

    const today = moment().format('D');

    // 日曜日から始まるカレンダーを作成するための配列生成
    const generateCalendar = () => {
        const startDay = currentMonth.clone().startOf('month').startOf('week');
        const endDay = currentMonth.clone().endOf('month').endOf('week');

        const day = startDay.clone().subtract(1, 'day');
        const calendar = [];

        while (day.isBefore(endDay, 'day')) {
            calendar.push(
                Array(7).fill(0).map(() => day.add(1, 'day').clone())
            );
        }

        return calendar;
    };

    const calendar = generateCalendar();

    return (
        <div className="flex w-full min-h-screen bg-white">
            <div className="w-1/4 min-h-full flex flex-col items-center justify-between bg-pink-100">
                <div className='flex flex-col items-center '>
                    <h1 className="text-2xl font-bold mt-6 ">おかしにっき</h1>
                    <p className="text-xl mt-2">やっほ〜 {user ? user.displayName : 'ゲスト'}～！</p>
                </div>
                <img src={memoImage} alt="Memo" className="w-64 h-64" style={{ width: '540px', height: '440px' }} />
                <div>
                    <button onClick={handleLogout} className="bg-pink-300 text-white rounded px-4 py-2 mb-4">ろぐあうと</button>
                </div>
            </div >
            <div className="flex flex-col items-center flex-grow p-8 min-h-full">
                <div className="flex justify-between items-center w-full mb-16">
                    <button onClick={previousMonth} className="text-xl font-semibold">⇐ まえ</button>
                    <h2 className="text-4xl font-bold">{currentMonth.format('YYYY年 MMMM')}</h2>
                    <button onClick={nextMonth} className="text-xl font-semibold">つぎ ⇒</button>
                </div>
                <div className="grid grid-cols-7 gap-4 w-full">
                    {days.map((day, index) => (
                        <div
                            key={day}
                            className={`text-center text-lg font-medium ${index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-gray-500'}`}
                        >
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-4 w-full mt-4 pb-4 flex-grow">
                    {calendar.map((week, weekIndex) => (
                        <React.Fragment key={weekIndex}>
                            {week.map((day) => {
                                const date = day.date();
                                const isCurrentMonth = day.isSame(currentMonth, 'month');
                                const isToday = date === parseInt(today, 10) && day.isSame(moment(), 'day');
                                const dayOfWeek = day.day();

                                return (
                                    <div key={day.format('YYYY-MM-DD')} className="flex flex-col items-center justify-center">
                                        {isCurrentMonth && (
                                            <>
                                                <div className={`w-14 h-14 bg-pink-200 rounded-full flex items-center justify-center mb-2 ${isToday ? 'text-pink-500' : dayOfWeek === 0 ? 'text-red-500' : dayOfWeek === 6 ? 'text-blue-500' : 'text-black'}`}>
                                                </div>
                                                <span className={`text-lg ${isToday ? 'text-pink-500' : dayOfWeek === 0 ? 'text-red-500' : dayOfWeek === 6 ? 'text-blue-500' : 'text-black'}`}>
                                                    {date.toString().padStart(2, '0')}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div >
    );
};

export default Calendar;
