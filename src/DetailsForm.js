import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useIcons } from './context/IconContext';
import Cat from './image/cat.png';
import Hot from './image/hot.png';
import Salty from './image/salty.png';
import Sour from './image/sour.png';
import Sweet from './image/sweet.png';

const DetailsForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { date } = location.state;
    const formattedDate = moment(date).format('MがつDにち');
    const { setIconForDate } = useIcons();
    const [isEditing, setIsEditing] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState(''); // デフォルト値を設定
    const [formData, setFormData] = useState({
        name: '',
        cal: '',
        price: '',
        thoughts: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            // Firebaseからデータを取得する処理
        };
        fetchData();
    }, [date]);

    const handleIconSelect = (icon) => {
        if (isEditing) {
            setIconForDate(date, icon);
            setSelectedIcon(icon);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (selectedIcon === '') {
            alert('アイコンを選択してください');
            return;
        }
        navigate('/home', {
            state: {
                date,
                formData,
                selectedIcon
            }
        });
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleBack = () => {
        navigate('/home');
    };

    const iconClass = (icon) => isEditing && selectedIcon === icon ? 'bg-pink-200' : '';

    return (
        <div className="w-full min-h-screen flex justify-center items-center bg-pink-100">
            <div className="flex flex-col items-center bg-white h-full w-3/4">
                <p className='pt-12 pb-8 text-4xl'>{formattedDate}</p>
                <div className='flex flex-col items-center w-3/4 rounded bg-pink-100 mb-12'>
                    <p className='pt-12 pb-8 text-2xl'>今日のおかしは？</p>
                    <div className='w-3/4 flex justify-between pb-4'>
                        <div className={`flex flex-col items-center p-2 ${iconClass('Sweet')}`} onClick={() => handleIconSelect('Sweet')}>
                            <img src={Sweet} alt="Candy" style={{ width: "100px" }} />
                            <p>あまい</p>
                        </div>
                        <div className={`flex flex-col items-center p-2 ${iconClass('Hot')}`} onClick={() => handleIconSelect('Hot')}>
                            <img src={Hot} alt="Candy" style={{ width: "100px" }} />
                            <p>からい</p>
                        </div>
                        <div className={`flex flex-col items-center p-2 ${iconClass('Sour')}`} onClick={() => handleIconSelect('Sour')}>
                            <img src={Sour} alt="Candy" style={{ width: "100px" }} />
                            <p>すっぱい</p>
                        </div>
                        <div className={`flex flex-col items-center p-2 ${iconClass('Salty')}`} onClick={() => handleIconSelect('Salty')}>
                            <img src={Salty} alt="Candy" style={{ width: "100px" }} />
                            <p>しょっぱい</p>
                        </div>
                        <div className={`flex flex-col items-center p-2 ${iconClass('Cat')}`} onClick={() => handleIconSelect('Cat')}>
                            <img src={Cat} alt="Candy" style={{ width: "100px" }} />
                            <p>その他</p>
                        </div>
                    </div>
                    <div className='flex flex-row items-center'>
                        <p className='py-8 text-2xl whitespace-nowrap'>お菓子名：</p>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className='h-12 w-full' disabled={!isEditing} />
                    </div>
                </div>
                <div className='flex flex-col w-3/4 rounded bg-pink-100 pl-16 mb-12 pt-4'>
                    <div className='flex flex-row items-center'>
                        <p className='py-4 text-2xl'>かろりー：</p>
                        <input type="text" id="cal" name="cal" value={formData.cal} onChange={handleInputChange} className='h-12 w-1/2' disabled={!isEditing} />
                    </div>
                    <div className='flex flex-row items-center'>
                        <p className='py-4 pl-6 text-2xl'>かかく：</p>
                        <input type="text" id="price" name="price" value={formData.price} onChange={handleInputChange} className='h-12 w-1/2' disabled={!isEditing} />
                    </div>
                    <div className='flex flex-row items-center'>
                        <p className='pt-4 py-12 text-2xl'>かんそう：</p>
                        <input type="text" id="thoughts" name="thoughts" value={formData.thoughts} onChange={handleInputChange} className='h-12 w-1/2' disabled={!isEditing} />
                    </div>
                </div>
                <div className='w-3/4 flex justify-around pb-12'>
                    <button onClick={handleBack} className='w-40 h-12 rounded-md bg-pink-100 text-2xl'>もどる</button>
                    {isEditing ? (
                        <button onClick={handleSave} className='w-40 h-12 rounded-md bg-pink-100 text-2xl'>ほぞん</button>
                    ) : (
                        <button onClick={handleEdit} className='w-40 h-12 rounded-md bg-pink-100 text-2xl'>へんしゅう</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DetailsForm;
