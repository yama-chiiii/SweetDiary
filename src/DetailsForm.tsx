import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import moment from "moment";
import { SetStateAction, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useIcons } from "./context/IconContext";
import { auth, db } from "./firebase-config";
import Cat from "./image/cat.png";
import Hot from "./image/hot.png";
import Salty from "./image/salty.png";
import Sour from "./image/sour.png";
import Sweet from "./image/sweet.png";

const iconMapping = {
    Sweet: { image: Sweet, label: "あまい" },
    Hot: { image: Hot, label: "からい" },
    Sour: { image: Sour, label: "すっぱい" },
    Salty: { image: Salty, label: "しょっぱい" },
    Cat: { image: Cat, label: "その他" },
};

const DetailsForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { date } = location.state;
    const formattedDate = moment(date).format("MがつDにち");
    const { setIconForDate } = useIcons();
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        cal: "",
        price: "",
        thoughts: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            if (auth.currentUser) {
                const docRef = doc(db, "users", auth.currentUser.uid, "details", date);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setFormData({
                        name: data.name || "",
                        cal: data.cal || "",
                        price: data.price || "",
                        thoughts: data.thoughts || "",
                    });
                    setSelectedIcon(data.selectedIcon || "");
                } else {
                    setFormData({ name: "", cal: "", price: "", thoughts: "" });
                    setSelectedIcon("");
                }
            } else {
                console.log("No user logged in");
                navigate("/login");
            }
        };
        fetchData();
    }, [date, navigate]);

    const handleIconSelect = (icon: SetStateAction<string>) => {
        if (isEditing) {
            setIconForDate(date, icon);
            setSelectedIcon(icon);
        }
    };

    const handleInputChange = (e: { target: { name: any; value: any } }) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        console.log("Save started");

        if (!auth.currentUser) {
            console.log("No user logged in at save attempt");
            alert("ログインされていません。");
            return;
        }

        if (!selectedIcon) {
            console.log("No icon selected at save attempt");
            alert("アイコンを選択してください");
            return;
        }

        const docRef = doc(db, "users", auth.currentUser.uid, "details", date);
        console.log(`Attempting to write document with data:`, {
            name: formData.name,
            cal: formData.cal,
            price: formData.price,
            thoughts: formData.thoughts,
            selectedIcon,
        });
        console.log(`Path used: /users/${auth.currentUser.uid}/details/${date}`);

        try {
            await setDoc(
                docRef,
                {
                    ...formData,
                    selectedIcon,
                    date: date, // 追加: 日付フィールドを保存
                },
                { merge: true }
            );
            setIsEditing(false);
            navigate("/home");
        } catch (error) {
            alert("保存に失敗しました。エラーを確認してください。");
        }
    };

    const handleDelete = async () => {
        if (!auth.currentUser) {
            alert("ログインされていません。");
            return;
        }

        const docRef = doc(db, "users", auth.currentUser.uid, "details", date);

        try {
            await deleteDoc(docRef);
            navigate("/home");
        } catch (error) {
            alert("削除に失敗しました。エラーを確認してください。");
        }
    };

    useEffect(() => {
        console.log("Editing State changed:", isEditing);
    }, [isEditing]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleBack = () => {
        navigate("/home");
    };

    const iconClass = (icon: string) => (isEditing && selectedIcon === icon ? "bg-pink-200" : "");

    return (
        <div className="w-full min-h-screen flex justify-center items-center bg-pink-100 relative">
            <div className="flex flex-col items-center bg-white h-full w-full sm:w-3/4 relative z-10">
                <p className="pt-12 pb-8 text-2xl sm:text-4xl">{formattedDate}</p>
                {isEditing && (
                    <div className="w-full flex flex-row-reverse px-2 sm:pr-36">
                        <button onClick={() => setShowDeleteConfirmation(true)} className="bg-red-500 text-white rounded px-4 py-2 my-4">
                            でーたさくじょ
                        </button>
                    </div>
                )}
                <div className="flex flex-col items-center w-full sm:w-3/4 rounded bg-pink-100 mb-12">
                    <p className="my-4 text-lg sm:text-xl">きょうのおかしはどんなあじ？</p>
                    <div className="w-full sm:w-3/4 flex justify-between pb-4">
                        {Object.entries(iconMapping).map(([iconType, { image, label }]) => (
                            <div
                                key={iconType}
                                className={`flex flex-col items-center p-2 ${iconClass(iconType)}`}
                                onClick={() => handleIconSelect(iconType)}
                            >
                                <img src={image} alt={`${label} icon`} className="w-16 sm:w-24" />
                                <p>{label}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-row items-center w-full px-4 sm:px-0">
                        <p className="py-8 sm:pl-16 text-lg sm:text-2xl whitespace-nowrap">お菓子名：</p>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={`h-12 w-2/3 px-4 sm:px-4 border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-lg sm:text-xl ${
                                !isEditing ? "text-center" : ""
                            }`}
                            disabled={!isEditing}
                        />
                    </div>
                </div>
                <div className="flex flex-col w-full sm:w-3/4 rounded bg-pink-100 pl-8 sm:pl-16 mb-12 pt-4">
                    <div className="flex flex-row items-center w-full px-4 sm:px-0">
                        <p className="py-4 text-lg sm:text-2xl">かろりー：</p>
                        <input
                            type="tel"
                            id="cal"
                            name="cal"
                            value={formData.cal}
                            onChange={handleInputChange}
                            className={`h-12 w-1/3 sm:w-1/5 px-4 border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-lg sm:text-xl ${
                                !isEditing ? "text-center" : ""
                            } no-spin`}
                            disabled={!isEditing}
                        />
                        <p className="py-4  px-4 text-sm sm:text-lg">かろりー</p>
                    </div>
                    <div className="flex flex-row items-center w-full px-4 sm:px-0">
                        <p className="py-4 pl-2 sm:pl-6 text-lg sm:text-2xl">かかく：</p>
                        <input
                            type="tel"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            className={`h-12 w-1/3 sm:w-1/5 px-4 border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-lg sm:text-xl ${
                                !isEditing ? "text-center" : ""
                            } no-spin`}
                            disabled={!isEditing}
                        />
                        <p className="py-4 px-4 text-sm sm:text-lg">えん</p>
                    </div>
                    <div className="flex flex-row items-center w-full px-4 sm:px-0">
                        <p className="py-4 text-lg sm:text-2xl">かんそう：</p>
                        <input
                            type="text"
                            id="thoughts"
                            name="thoughts"
                            value={formData.thoughts}
                            onChange={handleInputChange}
                            className={`h-12 w-2/3 px-4 border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-lg sm:text-xl ${
                                !isEditing ? "text-center" : ""
                            }`}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className="pb-4" />
                </div>
                <div className="w-full sm:w-3/4 flex justify-around pb-12">
                    <button onClick={handleBack} className="w-24 h-10 sm:w-40 sm:h-12 rounded-md bg-pink-100 text-lg sm:text-2xl">
                        もどる
                    </button>
                    {isEditing ? (
                        <button onClick={handleSave} className="w-24 h-10 sm:w-40 sm:h-12 rounded-md bg-pink-100 text-lg sm:text-2xl">
                            ほぞん
                        </button>
                    ) : (
                        <button onClick={handleEdit} className="w-24 h-10 sm:w-40 sm:h-12 rounded-md bg-pink-100 text-lg sm:text-2xl">
                            へんしゅう
                        </button>
                    )}
                </div>
            </div>
            {showDeleteConfirmation && (
                <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-20">
                    <div className="bg-white p-8 rounded shadow-lg text-center">
                        <p className="text-lg mb-4">ほんとうにけすの？</p>
                        <div className="flex justify-around">
                            <button
                                onClick={() => {
                                    setShowDeleteConfirmation(false);
                                    setIsEditing(false);
                                }}
                                className="bg-gray-300 text-black rounded px-4 py-2 mx-2"
                            >
                                キャンセル
                            </button>
                            <button onClick={handleDelete} className="bg-red-500 text-white rounded px-4 py-2 mx-2">
                                けす
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DetailsForm;
