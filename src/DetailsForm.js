import React from 'react';
import Cat from './image/cat.png';
import Hot from './image/hot.png';
import Salty from './image/salty.png';
import Sour from './image/sour.png';
import Sweet from './image/sweet.png';


const DetailsForm = () => {
    return (
        <div className="w-full min-h-screen flex justify-center items-center bg-pink-100">
            <div className="flex flex-col items-center bg-white h-screen w-3/4">
                <p className='py-12 text-3xl'>xxxx年xx月xx日</p>
                <div className='flex flex-col items-center w-3/4 rounded bg-pink-100 mb-12'>
                    <p className='pt-12 pb-8 text-2xl'>今日のおかしは？</p>
                    <div className='w-3/4 flex justify-between pb-4'>
                        <div className='flex flex-col items-center'>
                            <img src={Sweet} alt="Candy" style={{ width: "100px" }} />
                            <p>あまい</p>
                        </div>
                        <div className='flex flex-col items-center'>
                            <img src={Hot} alt="Candy" style={{ width: "100px" }} />
                            <p>からい</p>
                        </div>
                        <div className='flex flex-col items-center'>
                            <img src={Sour} alt="Candy" style={{ width: "100px" }} />
                            <p>すっぱい</p>
                        </div>
                        <div className='flex flex-col items-center'>
                            <img src={Salty} alt="Candy" style={{ width: "100px" }} />
                            <p>しょっぱい</p>
                        </div>
                        <div className='flex flex-col items-center'>
                            <img src={Cat} alt="Candy" style={{ width: "100px" }} />
                            <p>その他</p>
                        </div>
                    </div>
                    <div className='flex flex-row items-center'>
                        <p className='py-8 text-2xl'>お菓子名：</p>
                        <input type="text" id="name" name="name" className='h-12 w-full' />
                    </div>
                </div>
                <div className='flex flex-col w-3/4 rounded bg-pink-100 pl-16 mb-12 pt-4'>
                    <div className='flex flex-row items-center'>
                        <p className='py-4 text-2xl'>かろりー：</p>
                        <input type="text" id="cal" name="cal" className='h-12 w-1/2' />
                    </div>
                    <div className='flex flex-row items-center'>
                        <p className='py-4 pl-6 text-2xl'>かかく：</p>
                        <input type="text" id="price" name="price" className='h-12 w-1/2' />
                    </div>
                    <div className='flex flex-row items-center'>
                        <p className='pt-4 py-12 text-2xl'>かんそう：</p>
                        <input type="text" id="thoughts" name="thoughts" className='h-12 w-1/2' />
                    </div>
                </div>

                <div className='w-3/4 flex justify-around pb-12'>
                    <button className='w-40 h-12 rounded-md bg-pink-100 text-2xl'>もどる</button>
                    <button className='w-40 h-12 rounded-md bg-pink-100 text-2xl'>ほぞん</button>
                </div>
            </div >
        </div >
    );
};

export default DetailsForm;
