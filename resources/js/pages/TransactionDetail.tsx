import { P } from "node_modules/framer-motion/dist/types.d-DsEeKk6G";
import { useState } from "react"

export default function TransactionDetail({role}){
    const [selectedRating, setSelectedRating] = useState(5);
    const [pop, setPop] = useState(false);
    const [selected, setSelected] = useState(false)
    const [selected2, setSelected2] = useState(false)
    const [selected3, setSelected3] = useState(false)
    const [selected4, setSelected4] = useState(false)
    const [selected5, setSelected5] = useState(false)
    const [selected6, setSelected6] = useState(false)
    const [selected7, setSelected7] = useState(false)
    const [selected8, setSelected8] = useState(false)
    const stars = [1, 2, 3, 4, 5]
    const goToNextB = () =>{
        window.location.href = '/Buyer/chat'
    }
    const goToNextS = () =>{
        window.location.href = '/Seller/chat'
    }

    const goToNext = () =>{
        window.location.href = '/Buyer/review'
    }

    return(
        <>
            <div className= "flex justify-center items-center w-full h-full py-10 px-30">
                <div className="relative flex flex-col w-[948px] h-[1100px] bg-[#BBDCE5] rounded-xl gap-10">
                    <div className="flex justify-end h-[60px]">
                        <div className="flex justify-center items-center bg-[#68B143] w-[170px] h-[37px] mt-12 mr-12 rounded-4xl">
                            <p className="text-[20px] text-white">Approved</p>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-start px-40 gap-8">
                        <div className="flex justify-start items-center gap-5">
                            <img src="/shoes.jpg" alt="shoes" className="w-[185px] h-[169px] rounded-2xl"/>
                            <p className="text-[40px]">Product Price</p>
                        </div>
                        <div className="flex flex-col justify-center items-start gap-15">
                            <h1 className="text-[32px]">Appointmet ID</h1>
                            <div className="flex justify-between gap-60">
                                <div className="flex flex-col gap-5">
                                    <div className="flex flex-col">
                                        <p className="text-[20px]">item</p>
                                        <h1 className="text-[28px]">Barang X</h1>
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-[20px]">time</p>
                                        <h1 className="text-[28px]">11:00 AM</h1>
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-[20px]">location</p>
                                        <h1 className="text-[28px]">Jln X, Kota X</h1>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-5">
                                    <div className="flex flex-col">
                                        <p className="text-[20px]">COD Method</p>
                                        <h1 className="text-[28px]">COD</h1>
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-[20px]">date</p>
                                        <h1 className="text-[28px]">10/08/2025</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center gap-80 mt-14">
                    <div className="flex flex-col justify-center items-center">
                        <img src="/user.png" alt="user" className="w-[63px] h-[63px]"/>
                        <p className="text-[20px]">Nama Buyer</p>
                                <div className="flex text-3xl">
                                {stars.map((s) => (
                                <span key={s} className="text-[#FFC107]">{s <= Math.floor(selectedRating) ? "★" : "☆"}</span>
                                ))}
                            </div>
                        <div className="bg-[#9BC0E6] w-[60px] h-[60px] flex justify-center items-center rounded-full mt-3 hover:cursor-pointer" onClick={goToNextB}>
                            <button onClick={goToNextB}><img src="/chat.png" alt="chat" className="w-[38px] h-[38px] hover:cursor-pointer"/></button>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <img src="/user.png" alt="user" className="w-[63px] h-[63px]"/>
                        <p className="text-[20px]">Nama Seller</p>
                        <div className="flex text-3xl">
                            {stars.map((s) => (
                            <span key={s} className="text-[#FFC107]">{s <= Math.floor(selectedRating) ? "★" : "☆"}</span>
                            ))}
                        </div>
                        <div className="bg-[#9BC0E6] w-[60px] h-[60px] flex justify-center items-center rounded-full mt-3 hover:cursor-pointer" onClick={goToNextS}>
                            <button><img src="/chat.png" alt="chat" className="w-[38px] h-[38px] hover:cursor-pointer" onClick={goToNextS}/></button>
                        </div>
                    </div>
                </div>
                <div className="mt-2">
                <div className="flex w-full h-full justify-center">
                    <div className="flex justify-between gap-5">
                        <div className="flex justify-center items-center w-[441px] h-[52px] bg-[#76DD5F] rounded-2xl hover:cursor-pointer" onClick={goToNext}>
                            <button className="text-[32px] hover:cursor-pointer" onClick={goToNext}>Deal</button>
                        </div>
                        <div className="flex justify-center items-center w-[441px] h-[52px] bg-[#F64848] rounded-2xl hover:cursor-pointer" onClick={() => setPop(!pop)}>
                            <button className="text-[32px] hover:cursor-pointer" onClick={() =>setPop(!pop)}>Not Deal</button>
                        </div>
                    </div>
                </div>
            </div>
            {pop &&(
                <div className="absolute flex flex-col justify-start items-start p-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[838px] h-[900px] bg-white border-3 rounded-3xl">
                    {role == "Seller" ? (
                        <div className="flex flex-col justify-between gap-5 mt-20">
                            <h1 className="text-[32px] mb-5">Reason Not Dealing</h1>
                            <div className="flex items-center gap-2 cursor-pointer">
                                <div
                                    onClick={() => setSelected(!selected)}
                                    className={`w-[37px] h-[37px] rounded-full border-3 ${
                                    selected ? "bg-blue-600 border-black" : "bg-white border-black"
                                    }`}
                                />
                                <span className="text-[28px] text-[#F64848]">Buyer didn’t show up</span>
                            </div>
                            <div className="flex items-center gap-2 cursor-pointer">
                                <div
                                    onClick={() => setSelected2(!selected2)}
                                    className={`w-[37px] h-[37px] rounded-full border-3 ${
                                    selected2 ? "bg-blue-600 border-black" : "bg-white border-black"
                                    }`}
                                />
                                <span className="text-[28px] text-[#F64848]">Buyer asked to lower the price too much</span>
                            </div>
                            <div className="flex items-center gap-2 cursor-pointer">
                                <div
                                    onClick={() => setSelected3(!selected3)}
                                    className={`w-[37px] h-[37px] rounded-full border-3 ${
                                    selected3 ? "bg-blue-600 border-black" : "bg-white border-black"
                                    }`}
                                />
                                <span className="text-[28px] text-[#F64848]">Buyer changed meeting time/place suddenly</span>
                            </div>
                            <div className="flex items-center gap-2 cursor-pointer">
                                <div
                                    onClick={() => setSelected4(!selected4)}
                                    className={`w-[37px] h-[37px] rounded-full border-3 ${
                                    selected4 ? "bg-blue-600 border-black" : "bg-white border-black"
                                    }`}
                                />
                                <span className="text-[28px] text-[#F64848]">Safety concerns about the buyer</span>
                            </div>
                            <div className="flex items-center gap-2 cursor-pointer">
                                <div
                                    onClick={() => setSelected5(!selected5)}
                                    className={`w-[37px] h-[37px] rounded-full border-3 ${
                                    selected5 ? "bg-blue-600 border-black" : "bg-white border-black"
                                    }`}
                                />
                                <span className="text-[28px] text-[#F64848]">Buyer check too many but not serious</span>
                            </div>
                            <div className="flex items-center gap-2 cursor-pointer">
                                <div
                                    onClick={() => setSelected6(!selected6)}
                                    className={`w-[37px] h-[37px] rounded-full border-3 ${
                                    selected6 ? "bg-blue-600 border-black" : "bg-white border-black"
                                    }`}
                                />
                                <span className="text-[28px] text-[#F64848]">Buyer seemed suspicious</span>
                            </div>
                            <div className="flex items-center gap-2 cursor-pointer">
                                <div
                                    onClick={() => setSelected7(!selected7)}
                                    className={`w-[37px] h-[37px] rounded-full border-3 ${
                                    selected7 ? "bg-blue-600 border-black" : "bg-white border-black"
                                    }`}
                                />
                                <span className="text-[28px] text-[#F64848]">Buyer didn’t follow the agreed COD location</span>
                            </div>
                            <div className="flex items-center gap-2 cursor-pointer">
                                <div
                                    onClick={() => setSelected8(!selected8)}
                                    className={`w-[37px] h-[37px] rounded-full border-3 ${
                                    selected8 ? "bg-blue-600 border-black" : "bg-white border-black"
                                    }`}
                                />
                                <span className="text-[28px] text-[#F64848]">Buyer didn’t agree with product condition</span>
                            </div>
                        </div>
                    ):(
                        <div className="flex flex-col justify-between gap-5 mt-20">
                            <h1 className="text-[32px] mb-5">Reason Not Dealing</h1>
                            <div className="flex items-center gap-2 cursor-pointer">
                                <div
                                    onClick={() => setSelected(!selected)}
                                    className={`w-[37px] h-[37px] rounded-full border-3 ${
                                    selected ? "bg-blue-600 border-black" : "bg-white border-black"
                                    }`}
                                />
                                <span className="text-[28px] text-[#F64848]">Found cheaper elsewhere</span>
                            </div>
                            <div className="flex items-center gap-2 cursor-pointer">
                                <div
                                    onClick={() => setSelected2(!selected2)}
                                    className={`w-[37px] h-[37px] rounded-full border-3 ${
                                    selected2 ? "bg-blue-600 border-black" : "bg-white border-black"
                                    }`}
                                />
                                <span className="text-[28px] text-[#F64848]">Fake Product</span>
                            </div>
                            <div className="flex items-center gap-2 cursor-pointer">
                                <div
                                    onClick={() => setSelected3(!selected3)}
                                    className={`w-[37px] h-[37px] rounded-full border-3 ${
                                    selected3 ? "bg-blue-600 border-black" : "bg-white border-black"
                                    }`}
                                />
                                <span className="text-[28px] text-[#F64848]">Item not as expected</span>
                            </div>
                            <div className="flex items-center gap-2 cursor-pointer">
                                <div
                                    onClick={() => setSelected4(!selected4)}
                                    className={`w-[37px] h-[37px] rounded-full border-3 ${
                                    selected4 ? "bg-blue-600 border-black" : "bg-white border-black"
                                    }`}
                                />
                                <span className="text-[28px] text-[#F64848]">Item quality not good</span>
                            </div>
                            <div className="flex items-center gap-2 cursor-pointer">
                                <div
                                    onClick={() => setSelected5(!selected5)}
                                    className={`w-[37px] h-[37px] rounded-full border-3 ${
                                    selected5 ? "bg-blue-600 border-black" : "bg-white border-black"
                                    }`}
                                />
                                <span className="text-[28px] text-[#F64848]">Wrong size / type</span>
                            </div>
                            <div className="flex items-center gap-2 cursor-pointer">
                                <div
                                    onClick={() => setSelected6(!selected6)}
                                    className={`w-[37px] h-[37px] rounded-full border-3 ${
                                    selected6 ? "bg-blue-600 border-black" : "bg-white border-black"
                                    }`}
                                />
                                <span className="text-[28px] text-[#F64848]">Safety concerns</span>
                            </div>
                            <div className="flex items-center gap-2 cursor-pointer">
                                <div
                                    onClick={() => setSelected7(!selected7)}
                                    className={`w-[37px] h-[37px] rounded-full border-3 ${
                                    selected7 ? "bg-blue-600 border-black" : "bg-white border-black"
                                    }`}
                                />
                                <span className="text-[28px] text-[#F64848]">Payment Issues</span>
                            </div>
                            <div className="flex items-center gap-2 cursor-pointer">
                                <div
                                    onClick={() => setSelected8(!selected8)}
                                    className={`w-[37px] h-[37px] rounded-full border-3 ${
                                    selected8 ? "bg-blue-600 border-black" : "bg-white border-black"
                                    }`}
                                />
                                <span className="text-[28px] text-[#F64848]">Too expensive after seeing in person</span>
                            </div>
                        </div>
                    )}
                    <div className="w-full flex justify-center mt-30">
                        <div className="flex justify-center items-center w-[536px] h-[52px] border-2 rounded-2xl cursor-pointer" onClick={goToNext}>
                            <button className="text-[32px] cursor-pointer" onClick={goToNext}>Submit</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
        </>
    )
}
