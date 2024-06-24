import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import moment, { Moment } from "moment";
import "moment/locale/ja";
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UserContext from "./context/UseContext";
import { db } from "./firebase-config";
import ameImg from "./image/ame.png";
import cakeDrinkImg from "./image/cake&drink.png";
import cakeImg from "./image/cake.png";
import candyImg from "./image/candy.png";
import Cat from "./image/cat.png";
import Hot from "./image/hot.png";
import Salty from "./image/salty.png";
import Sour from "./image/sour.png";
import Sweet from "./image/sweet.png";

moment.locale("ja");

const Calendar = () => {
    const [currentMonth, setCurrentMonth] = useState(moment());
    const days = ["にち", "げつ", "か", "すい", "もく", "きん", "ど"];
    const { user, setUser } = useContext(UserContext);
    const auth = getAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [icons, setIcons] = useState<{ [key: string]: any }>({});
    const [isEditing, setIsEditing] = useState(false);
    const [goalData, setGoalData] = useState<{
        priceGoal: string;
        calorieGoal: string;
        lastEdited: string | null;
    }>({
        priceGoal: "",
        calorieGoal: "",
        lastEdited: null,
    });

    const [totalData, setTotalData] = useState({
        totalPrice: 0,
        totalCalorie: 0,
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
                const saveData = async (date: string, formData: any, selectedIcon: any) => {
                    const user = auth.currentUser;
                    if (user) {
                        const docRef = doc(db, "users", user.uid, "details", date);
                        await setDoc(docRef, {
                            ...formData,
                            icon: selectedIcon,
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
                const goalRef = doc(db, "users", auth.currentUser.uid, "goals", currentMonth.format("YYYY-MM"));
                const goalSnap = await getDoc(goalRef);
                if (goalSnap.exists()) {
                    const data = goalSnap.data();
                    setGoalData({
                        priceGoal: data.priceGoal || "",
                        calorieGoal: data.calorieGoal || "",
                        lastEdited: data.lastEdited || null,
                    });
                } else {
                    setGoalData({ priceGoal: "", calorieGoal: "", lastEdited: null });
                }
            }
        };

        fetchGoalData();
    }, [auth.currentUser, currentMonth]);

    useEffect(() => {
        const fetchTotalData = async () => {
            if (auth.currentUser) {
                const startOfMonth = currentMonth.startOf("month").format("YYYY-MM-DD");
                const endOfMonth = currentMonth.endOf("month").format("YYYY-MM-DD");
                const detailsQuery = query(
                    collection(db, "users", auth.currentUser.uid, "details"),
                    where("date", ">=", startOfMonth),
                    where("date", "<=", endOfMonth)
                );

                try {
                    const snapshot = await getDocs(detailsQuery);
                    let totalPrice = 0;
                    let totalCalorie = 0;
                    snapshot.forEach((doc) => {
                        const data = doc.data();
                        console.log(`Fetched document: `, data); // 追加: 取得データをログに表示
                        totalPrice += parseFloat(data.price || 0);
                        totalCalorie += parseFloat(data.cal || 0);
                    });

                    setTotalData({
                        totalPrice,
                        totalCalorie,
                    });
                } catch (error) {
                    console.error("Error fetching total data:", error); // 追加: エラーをログに表示
                }
            }
        };

        fetchTotalData();
    }, [auth.currentUser, currentMonth]);

    const handleGoalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setGoalData((prev) => ({ ...prev, [name]: value }));
    };

    const generateCalendar = () => {
        const startDay = currentMonth.clone().startOf("month").startOf("week");
        const endDay = currentMonth.clone().endOf("month").endOf("week");
        const day = startDay.clone().subtract(1, "day");
        const calendar = [];

        while (day.isBefore(endDay, "day")) {
            calendar.push(
                Array(7)
                    .fill(0)
                    .map(() => day.add(1, "day").clone())
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
                const iconsData: { [key: string]: any } = {}; // ここで型を明示
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    iconsData[doc.id] = data.selectedIcon; // 正しくデータを格納
                });
                setIcons(iconsData);
            }
        };

        fetchIcons();
    }, [auth.currentUser]);

    useEffect(() => {
        const fetchGoalData = async () => {
            if (auth.currentUser) {
                const goalRef = doc(db, "users", auth.currentUser.uid, "goals", currentMonth.format("YYYY-MM"));
                const goalSnap = await getDoc(goalRef);
                if (goalSnap.exists()) {
                    const data = goalSnap.data();
                    setGoalData({
                        priceGoal: data.priceGoal || "",
                        calorieGoal: data.calorieGoal || "",
                        lastEdited: data.lastEdited, // このタイムスタンプを保存
                    });
                } else {
                    setGoalData({ priceGoal: "", calorieGoal: "", lastEdited: null });
                }
            }
        };

        fetchGoalData();
    }, [auth.currentUser, currentMonth]);

    const nextMonth = () => {
        setCurrentMonth(currentMonth.clone().add(1, "months"));
    };

    const previousMonth = () => {
        setCurrentMonth(currentMonth.clone().subtract(1, "months"));
    };

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                navigate("/login");
            })
            .catch((error) => {
                console.error("ログアウトエラー:", error);
            });
    };

    const handleGoalSave = async () => {
        if (!auth.currentUser) {
            alert("ログインされていません。");
            return;
        }

        const now = moment();
        const lastEdited = moment(goalData.lastEdited);
        if (lastEdited.isValid() && lastEdited.isSame(now, "month")) {
            alert("今月はすでに目標を編集済みです。");
            return;
        }

        const goalRef = doc(db, "users", auth.currentUser.uid, "goals", currentMonth.format("YYYY-MM"));
        try {
            await setDoc(
                goalRef,
                {
                    ...goalData,
                    lastEdited: now.toISOString(), // 編集日時を更新
                },
                { merge: true }
            );
            setIsEditing(false);
            alert("目標を保存しました。");
        } catch (error) {
            console.error("保存に失敗しました。エラーを確認してください。", error);
            alert("保存に失敗しました。エラーを確認してください。");
        }
    };

    const handleDateClick = (day: moment.Moment) => {
        navigate("/details", { state: { date: day.format("YYYY-MM-DD") } });
    };

    const generateDayClass = (day: Moment): string => {
        let classes = "flex flex-col items-center justify-center text-lg ";
        if (day.day() === 0) {
            // 日曜日
            classes += "text-red-500 ";
        } else if (day.day() === 6) {
            // 土曜日
            classes += "text-blue-500 ";
        }
        return classes;
    };

    return (
        <div className="flex w-full min-h-screen bg-white">
            <div className="hidden sm:block w-1/4 min-h-full flex-col items-center bg-pink-100 relative justify-between">
                <div className="w-full">
                    <div className="flex flex-col items-center mb-4 text-pink-400">
                        <h1 className="text-4xl font-bold mt-8">おかしにっき</h1>
                        <p className="text-2xl mt-8">やっほ〜 {user ? user.displayName : "ゲスト"}！</p>
                    </div>
                    <div className="flex flex-row-reverse items-end">
                        <img src={candyImg} alt="Candy" style={{ width: "100px", position: "relative", bottom: "-80px" }} />
                    </div>
                    <div className="w-10/12 flex flex-col items-start justify-center mx-4 px-4 text-black bg-white rounded py-8">
                        <p className="text-3xl mb-12">今月のもくひょう！</p>
                        <div className="w-full mb-6">
                            <p className="text-xl mr-4 whitespace-nowrap">かかく</p>
                            <div className="flex items-center">
                                <p className="text-lg">{totalData.totalPrice} 円</p>
                                <span className="mx-2">/</span>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        name="priceGoal"
                                        value={goalData.priceGoal}
                                        onChange={handleGoalInputChange}
                                        className="w-1/3 outline-none text-lg border border-black rounded no-spin"
                                        placeholder="目標かかく"
                                    />
                                ) : (
                                    <p className="text-lg">{goalData.priceGoal} 円</p>
                                )}
                            </div>
                        </div>
                        <div className="w-full mb-6">
                            <p className="text-xl mr-4 whitespace-nowrap">かろりー</p>
                            <div className="flex items-center">
                                <p className="text-lg">{totalData.totalCalorie} kcal</p>
                                <span className="mx-2">/</span>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        name="calorieGoal"
                                        value={goalData.calorieGoal}
                                        onChange={handleGoalInputChange}
                                        className="w-1/3 outline-none text-lg border border-black rounded no-spin"
                                        placeholder="目標かろりー"
                                    />
                                ) : (
                                    <p className="text-lg">{goalData.calorieGoal} kcal</p>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col items-center w-full">
                            {isEditing ? (
                                <button onClick={handleGoalSave} className="h-10 bg-pink-300 text-white rounded px-4 py-2 mb-4">
                                    ほぞん
                                </button>
                            ) : (
                                <button onClick={() => setIsEditing(true)} className="h-10 bg-pink-300 text-white rounded px-4 py-2 mb-4">
                                    へんしゅう
                                </button>
                            )}
                            <p className="text-xs text-red-500">※月に1回しかへんしゅうできないからちゅうい！</p>
                        </div>
                    </div>
                    <div className="flex flex-row justify-between">
                        <img src={cakeImg} alt="Cupcake" className="mt-4" style={{ width: "100px", position: "relative", top: "-44px" }} />
                        <img src={ameImg} alt="Ame" className="mt-4" style={{ width: "100px", position: "relative", top: "-52px" }} />
                    </div>
                </div>
                <div className="flex flex-row justify-around w-full">
                    <div className="flex flex-col-reverse">
                        <button onClick={handleLogout} className="h-1/3 bg-pink-300 text-white rounded px-4 py-2 mb-4">
                            ログアウト
                        </button>
                    </div>
                    <img src={cakeDrinkImg} alt="Cake and Drink" className="mb-4" style={{ width: "200px" }} />
                </div>
            </div>
            <div className="flex flex-col items-center flex-grow p-8 min-h-full">
                <div className="flex justify-between items-center w-full mb-4">
                    <button onClick={previousMonth} className="sm:text-xl text-md font-semibold">
                        ⇐ まえ
                    </button>
                    <h2 className="sm:text-4xl text-lg font-bold">{currentMonth.format("YYYY年 M月")}</h2>
                    <button onClick={nextMonth} className="sm:text-xl text-md font-semibold">
                        つぎ ⇒
                    </button>
                </div>
                <button className="sm:hidden bg-pink-300 text-white rounded px-4 py-1 mt-2 mb-4">もくひょう</button>
                <div className="grid grid-cols-7 gap-4 w-full">
                    {days.map((day, index) => (
                        <div
                            key={index}
                            className={`text-center sm:text-lg text-sm font-medium ${
                                index === 0 ? "text-red-500" : index === 6 ? "text-blue-500" : "text-gray-500"
                            }`}
                        >
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-4 w-full mt-4 pb-4 flex-grow">
                    {calendar.map((week, weekIndex) => (
                        <React.Fragment key={weekIndex}>
                            {week.map((day) => {
                                const dateKey = day.format("YYYY-MM-DD");
                                const icon = icons[dateKey];
                                const iconMapping: { [key: string]: string } = { Sweet, Hot, Sour, Salty, Cat };
                                const iconSrc = iconMapping[icon];
                                const isToday = day.isSame(moment(), "day");
                                const dayClasses = generateDayClass(day);
                                const isCurrentMonth = day.isSame(currentMonth, "month");

                                return (
                                    <div key={dateKey} className={dayClasses} onClick={() => handleDateClick(day)}>
                                        {isCurrentMonth && (
                                            <>
                                                {iconSrc ? (
                                                    <img
                                                        src={iconSrc}
                                                        alt="Selected icon"
                                                        className="w-8 h-8 sm:w-16 sm:h-16"
                                                        style={{ width: "64px", marginBottom: "5px" }}
                                                    />
                                                ) : (
                                                    <div
                                                        className={`w-8 h-8 sm:w-16 sm:h-16 bg-pink-200 rounded-full flex items-center justify-center mb-2`}
                                                    ></div>
                                                )}
                                                <span className={`${isToday ? "bg-pink-300 rounded-full px-1 text-white" : ""}`}>
                                                    {day.date().toString().padStart(2, "0")}
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
