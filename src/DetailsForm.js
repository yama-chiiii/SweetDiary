import moment from 'moment';
import React, { useState } from 'react';
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
    //const [setSelectedIcon] = useState('');
    const { setIconForDate } = useIcons();
    const [isEditing, setIsEditing] = useState(false);


    const handleIconSelect = (icon) => {
        setIconForDate(date, icon);
        // カレンダーに情報を反映するための状態更新もここで行う必要がある
    };

    const handleSave = () => {
        navigate('/home');
    };

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    return (
        <div className="w-full min-h-screen flex justify-center items-center bg-pink-100">
            <div className="flex flex-col items-center bg-white h-full w-3/4">
                <p className='pt-12 pb-8 text-4xl'>{formattedDate}</p>
                <button onClick={toggleEdit} className='mb-8 w-32 h-10 rounded-md bg-pink-100 text-xl'>へんしゅう</button>
                <div className='flex flex-col items-center w-3/4 rounded bg-pink-100 mb-12'>
                    <p className='pt-12 pb-8 text-2xl'>今日のおかしは？</p>
                    <div className='w-3/4 flex justify-between pb-4'>

                        <div className='flex flex-col items-center' onClick={() => handleIconSelect('Sweet')} disabled={!isEditing}>
                            <img src={Sweet} alt="Candy" style={{ width: "100px" }} />
                            <p>あまい</p>
                        </div>
                        <div className='flex flex-col items-center' onClick={() => handleIconSelect('Hot')} disabled={!isEditing}>
                            <img src={Hot} alt="Candy" style={{ width: "100px" }} />
                            <p>からい</p>
                        </div>
                        <div className='flex flex-col items-center' onClick={() => handleIconSelect('Sour')} disabled={!isEditing}>
                            <img src={Sour} alt="Candy" style={{ width: "100px" }} />
                            <p>すっぱい</p>
                        </div>
                        <div className='flex flex-col items-center' onClick={() => handleIconSelect('Salty')} disabled={!isEditing}>
                            <img src={Salty} alt="Candy" style={{ width: "100px" }} />
                            <p>しょっぱい</p>
                        </div>
                        <div className='flex flex-col items-center' onClick={() => handleIconSelect('Cat')} disabled={!isEditing}>
                            <img src={Cat} alt="Candy" style={{ width: "100px" }} />
                            <p>その他</p>
                        </div>

                    </div>
                    <div className='flex flex-row items-center'>
                        <p className='py-8 text-2xl'>お菓子名：</p>
                        <input type="text" id="name" name="name" className='h-12 w-full' disabled={!isEditing} />
                    </div>
                </div>
                <div className='flex flex-col w-3/4 rounded bg-pink-100 pl-16 mb-12 pt-4'>
                    <div className='flex flex-row items-center'>
                        <p className='py-4 text-2xl'>かろりー：</p>
                        <input type="text" id="cal" name="cal" className='h-12 w-1/2' disabled={!isEditing} />
                    </div>
                    <div className='flex flex-row items-center'>
                        <p className='py-4 pl-6 text-2xl'>かかく：</p>
                        <input type="text" id="price" name="price" className='h-12 w-1/2' />
                    </div>
                    <div className='flex flex-row items-center'>
                        <p className='pt-4 py-12 text-2xl'>かんそう：</p>
                        <input type="text" id="thoughts" name="thoughts" className='h-12 w-1/2' disabled={!isEditing} />
                    </div>
                </div>

                <div className='w-3/4 flex justify-around pb-12'>
                    <button className='w-40 h-12 rounded-md bg-pink-100 text-2xl'>もどる</button>
                    <button onClick={handleSave} className='w-40 h-12 rounded-md bg-pink-100 text-2xl'>ほぞん</button>
                </div>
            </div >
        </div >
    );
};

export default DetailsForm;
