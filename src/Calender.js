import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import moment from 'moment';
import 'moment/locale/ja'; // 日本語のロケールをインポート
import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
    const location = useLocation();
    const [icons, setIcons] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [goalData, setGoalData] = useState({
        priceGoal: '',
        calorieGoal: ''
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                console.log("No user logged in");
                navigate("/login");
            }
        });

        return () => unsubscribe();
    }, [auth, navigate, setUser]);

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
    }, [location.state, auth.currentUser]);

    useEffect(() => {
        const fetchGoalData = async () => {
            if (auth.currentUser) {
                const goalRef = doc(db, "users", auth.currentUser.uid, "goals", currentMonth.format('YYYY-MM'));
                const goalSnap = await getDoc(goalRef);
                if (goalSnap.exists()) {
                    setGoalData(goalSnap.data());
                } else {
                    setGoalData({
                        priceGoal: '',
                        calorieGoal: ''
                    });
                }
            }
        };

        fetchGoalData();
    }, [auth.currentUser, currentMonth]);

    const handleGoalInputChange = (e) => {
        const { name, value } = e.target;
        setGoalData(prev => ({ ...prev, [name]: value }));
    };

    const handleGoalSave = async () => {
        if (!auth.currentUser) {
            alert('ログインされていません。');
            return;
        }

        const goalRef = doc(db, "users", auth.currentUser.uid, "goals", currentMonth.format('YYYY-MM'));
        try {
            await setDoc(goalRef, goalData, { merge: true });
            setIsEditing(false);
        } catch (error) {
            console.error('保存に失敗しました。エラーを確認してください。', error);
            alert('保存に失敗しました。エラーを確認してください。');
        }
    };

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

    useEffect(() => {
        const fetchIcons = async () => {
            if (auth.currentUser) {
                const iconsRef = collection(db, "users", auth.currentUser.uid, "details");
                const snapshot = await getDocs(iconsRef);
                const iconsData = {};
                snapshot.forEach(doc => {
                    const data = doc.data();
                    iconsData[doc.id] = data.selectedIcon; // Correct the field name to 'selectedIcon'
                });
                setIcons(iconsData);
            }
        };

        fetchIcons();
    }, [auth.currentUser]);

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
                    <div className="w-10/12 flex flex-col items-start justify-center mx-4 px-4 text-black bg-white rounded py-8">
                        <p className="text-3xl mb-12">今月のもくひょう！</p>
                        <div className="w-full flex flex-row items-center mb-6">
                            <p className="w-1/4 text-xl mr-4 whitespace-nowrap">かかく</p>
                            <input
                                type="number"
                                name="priceGoal"
                                value={goalData.priceGoal}
                                onChange={handleGoalInputChange}
                                className={`w-2/4 bg-transparent outline-none text-lg no-spin ${isEditing ? 'border border-black rounded' : 'border-none'}`}
                                placeholder="10000円"
                                disabled={!isEditing}
                            />
                            <p>円</p>
                        </div>
                        <div className="w-full flex flex-row items-center mb-6">
                            <p className="w-1/4 text-xl mr-4 whitespace-nowrap">かろりー</p>
                            <input
                                type="number"
                                name="calorieGoal"
                                value={goalData.calorieGoal}
                                onChange={handleGoalInputChange}
                                className={`w-2/4 bg-transparent outline-none text-lg no-spin ${isEditing ? 'border border-black rounded' : 'border-none'}`}
                                placeholder="10000kcal"
                                disabled={!isEditing}
                            />
                            <p>kcal</p>
                        </div>
                        <div className='flex flex-col items-center w-full'>
                            {isEditing ? (
                                <button onClick={handleGoalSave} className="h-10 bg-pink-300 text-white rounded px-4 py-2 mb-4">ほぞん</button>
                            ) : (
                                <button onClick={() => setIsEditing(true)} className="h-10 bg-pink-300 text-white rounded px-4 py-2 mb-4">へんしゅう</button>
                            )}
                        </div>
                    </div>
                    <div className='flex flex-row justify-between'>
                        <img src={cakeImg} alt="Cupcake" className="mt-4" style={{ width: "100px", position: "relative", top: "-60px" }} />
                        <img src={ameImg} alt="Ame" className="mt-4" style={{ width: "100px", position: "relative", top: "-60px" }} />
                    </div>
                </div>
                <div className='flex flex-row justify-around w-full'>
                    <div className='flex flex-col-reverse'>
                        <button onClick={handleLogout} className="h-1/3 bg-pink-300 text-white rounded px-4 py-2 mb-4">ログアウト</button>
                    </div>
                    <img src={cakeDrinkImg} alt="Cake and Drink" className="mb-4" style={{ width: "200px" }} />
                </div>
            </div>
            <div className="flex flex-col items-center flex-grow p-8 min-h-full">
                <div className="flex justify-between items-center w-full mb-16">
                    <button onClick={previousMonth} className="text-xl font-semibold">⇐ まえ</button>
                    <h2 className="text-4xl font-bold">{currentMonth.format('YYYY年 M月')}</h2>
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
                                const dateKey = day.format('YYYY-MM-DD');
                                const icon = icons[dateKey];
                                const iconSrc = { Sweet, Hot, Sour, Salty, Cat }[icon];
                                const isCurrentMonth = day.isSame(currentMonth, 'month');

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
