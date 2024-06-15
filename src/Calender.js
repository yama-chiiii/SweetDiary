import { getAuth, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import moment from 'moment';
import 'moment/locale/ja'; // 日本語のロケールをインポート
import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useIcons } from './context/IconContext';
import UserContext from './context/UseContext'; // インポートパスを修正
import { db } from './firebase-config'; // Firebaseのインポート
import ameImg from './image/ame.png';
import cakeDrinkImg from './image/cake&drink.png';
import cakeImg from './image/cake.png';
import candyImg from './image/candy.png';
import Cat from './image/cat.png';
import Hot from './image/hot.png';
import Salty from './image/salty.png';
import Sour from './image/sour.png';
import Sweet from './image/sweet.png';

moment.locale('ja');

const Calendar = () => {
    const [currentMonth, setCurrentMonth] = useState(moment());
    const days = ['にち', 'げつ', 'か', 'すい', 'もく', 'きん', 'ど'];
    const { user, setUser } = useContext(UserContext);
    const auth = getAuth();
    const navigate = useNavigate();
    const { icons } = useIcons();
    const location = useLocation();

    useEffect(() => {
        if (location.state) {
            const { date, formData, selectedIcon } = location.state;
            if (selectedIcon !== undefined) {
                const saveData = async (date, formData, selectedIcon) => {
                    const user = auth.currentUser;
                    if (user) {
                        const docRef = doc(db, "users", user.uid, "details", date);
                        await setDoc(docRef, {
                            ...formData,
                            icon: selectedIcon
                        });
                    }
                };
                saveData(date, formData, selectedIcon);
            }
        }
    }, [location.state, auth.currentUser]); // auth.currentUserを依存配列に追加


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

    const handleDateClick = (day) => {
        // DetailsFormに遷移し、日付をパラメータとして渡す
        navigate('/details', { state: { date: day.format('YYYY-MM-DD') } });
    };

    return (
        <div className="flex w-full min-h-screen bg-white">
            <div className="w-1/4 min-h-full flex flex-col items-center bg-pink-100 relative justify-between">
                <div className='w-full'>
                    <div className='flex flex-col items-center mb-4 text-pink-400'>
                        <h1 className="text-4xl font-bold mt-8">おかしにっき</h1>
                        <p className="text-2xl mt-8">やっほ〜 {user ? user.displayName : 'ゲスト'}！</p>
                    </div>
                    <div className='flex flex-row-reverse items-end'>
                        <img src={candyImg} alt="Candy" style={{ width: "100px", position: "relative", bottom: "-80px" }} />
                    </div>
                    <div className="flex flex-col items-start justify-center mx-4 px-4 text-black bg-white rounded py-8">
                        <p className="text-3xl mb-12">もくひょう！</p>
                        <p className="text-2xl">かかく</p>
                        <input className="bg-transparent outline-none border-none w-full text-lg ml-8 mb-4" placeholder="3000円/10000円" />
                        <p className="text-2xl">かろりー</p>
                        <input className="bg-transparent outline-none border-none w-full text-lg ml-8 mb-6" placeholder="3000kcal/10000kcal" />
                    </div>
                    <div className='flex flex-row justify-between'>
                        <img src={cakeImg} alt="Cupcake" className="mt-4" style={{ width: "100px", position: "relative", top: "-60px" }} />
                        <img src={ameImg} alt="Ame" className="mt-4" style={{ width: "100px", position: "relative", top: "-60px" }} />
                    </div>
                </div>
                <div className='flex flex-row justify-around  w-full'>
                    <div className='flex flex-col-reverse'>
                        <button onClick={handleLogout} className="h-1/3 bg-pink-300 text-white rounded px-4 py-2 mb-4">ログアウト</button>
                    </div>
                    <img src={cakeDrinkImg} alt="Cake and Drink" className="mb-4" style={{ width: "200px" }} />
                </div>
            </div>
            <div className="flex flex-col items-center flex-grow p-8 min-h-full">
                <div className="flex justify-between items-center w-full mb-16">
                    <button onClick={previousMonth} className="text-xl font-semibold">⇐ 前</button>
                    <h2 className="text-4xl font-bold">{currentMonth.format('YYYY年 M月')}</h2>
                    <button onClick={nextMonth} className="text-xl font-semibold">次 ⇒</button>
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
                                // const date = day.date();
                                const dateKey = day.format('YYYY-MM-DD');
                                const icon = icons[dateKey];
                                const iconSrc = { Sweet, Hot, Sour, Salty, Cat }[icon];
                                const isCurrentMonth = day.isSame(currentMonth, 'month');
                                // const isToday = date === parseInt(today, 10) && day.isSame(moment(), 'day');

                                return (
                                    <div key={dateKey} className="flex flex-col items-center justify-center"
                                        onClick={() => handleDateClick(day)}>
                                        {isCurrentMonth && (
                                            <>
                                                {iconSrc ? (
                                                    <img src={iconSrc} alt="Selected icon" style={{ width: '64px', marginBottom: '5px' }} />
                                                ) : (
                                                    <div className={`w-14 h-14 bg-pink-200 rounded-full flex items-center justify-center mb-2`}></div>
                                                )}
                                                <span className={`text-lg ${day.isSame(moment(), 'day') ? 'text-pink-500' : 'text-black'}`}>
                                                    {day.date().toString().padStart(2, '0')}
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
        </div>
    );
};

export default Calendar;
