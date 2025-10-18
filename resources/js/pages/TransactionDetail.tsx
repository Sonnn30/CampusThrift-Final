import { useMemo, useState } from "react"
import { router, usePage } from "@inertiajs/react"

type TxnRow = {
    time: string;
    buyer: string;
    method: string;
    id: string;
    appointment_id?: number;
    appointment_code?: string;
    amount: number;
    status: string;
    date?: string;
    location?: string;
    item?: string;
    seller?: string;
    image?: string | null;
}

export default function TransactionDetail({ role, transactions = [] as TxnRow[] }: any){
    const page = usePage<any>();
    const serverRole = page.props.role || role || "Buyer";
    const rows: TxnRow[] = page.props.transactions || transactions || [];
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
        // Seller chat dengan buyer dari transaksi pertama
        const buyerId = rows[0]?.buyer_id;
        if (buyerId) {
            window.location.href = `/Seller/chat/${buyerId}`;
        } else {
            alert('Buyer information not available');
        }
    }
    const goToNextS = () =>{
        // Buyer chat dengan seller dari transaksi pertama
        const sellerId = rows[0]?.seller_id;
        if (sellerId) {
            window.location.href = `/Buyer/chat/${sellerId}`;
        } else {
            alert('Seller information not available');
        }
    }

    const goToNext = () =>{
        const appointmentId = rows[0]?.appointment_id;
        if (!appointmentId) return;
        const rolePath = serverRole === 'Seller' ? '/Seller/TransactionDetail/deal' : '/Buyer/TransactionDetail/deal';
        router.post(rolePath, { appointment_id: appointmentId }, {
            preserveScroll: true,
            onSuccess: () => {
                alert('Deal submitted. If the other party also confirms, this will complete.');
                // If seller and both parties already dealt, backend redirects to ConfirmPage with query
                // We keep default Inertia behavior to follow redirects.
            },
            onError: () => {
                alert('Failed to submit.');
            }
        });
    }
    function goToProfileB(){
        window.location.href = `/Buyer/Profile`
    }
    function goToProfileS(){
        window.location.href = `/Seller/Profile`
    }
    const currency = useMemo(() => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }), []);

    return(
        <>
            <div className="flex justify-center items-center w-full min-h-screen py-6 px-4 sm:py-10 sm:px-8">
                <div className="relative flex flex-col w-full max-w-[948px] min-h-[800px] sm:min-h-[1130px] bg-[#BBDCE5] rounded-xl gap-6 sm:gap-10 p-4 sm:p-8">
                    {/* Status Badge */}
                    <div className="flex justify-end h-12 sm:h-[60px]">
                        {rows[0] && (
                            <div className={`flex justify-center items-center w-32 sm:w-[170px] h-8 sm:h-[37px] mt-6 sm:mt-12 mr-4 sm:mr-12 rounded-4xl ${
                                rows[0].status === 'confirmed' ? 'bg-[#68B143]' : rows[0].status === 'rejected' ? 'bg-[#F64848]' : 'bg-[#9BC0E6]'
                            }`}>
                                <p className="text-sm sm:text-[20px] text-white">{rows[0].status?.charAt(0).toUpperCase() + rows[0].status?.slice(1) || 'Pending'}</p>
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col justify-center items-start px-4 sm:px-8 lg:px-40 gap-4 sm:gap-8">
                        {/* Product Image and Price */}
                        <div className="flex flex-col sm:flex-row justify-start items-center gap-4 sm:gap-5 w-full">
                            <img src={rows[0]?.image || '/shoes.jpg'} alt="product" className="w-32 h-28 sm:w-[185px] sm:h-[169px] rounded-2xl object-cover"/>
                            <p className="text-2xl sm:text-3xl lg:text-[40px] font-bold">{currency.format(Number(rows[0]?.amount || 0))}</p>
                        </div>

                        {/* Transaction Details */}
                        <div className="flex flex-col justify-center items-start gap-4 sm:gap-8 w-full">
                            <h1 className="text-xl sm:text-2xl lg:text-[32px] font-bold">ID: {rows[0]?.appointment_code || rows[0]?.id || '-'}</h1>
                            <div className="flex flex-col lg:flex-row justify-between gap-6 sm:gap-8 lg:gap-30 w-full">
                                <div className="flex flex-col gap-3 sm:gap-5 w-full lg:w-auto">
                                    <div className="flex flex-col w-full lg:w-[300px]">
                                        <p className="text-sm sm:text-[20px] font-bold">Item</p>
                                        <h1 className="text-lg sm:text-xl lg:text-[28px]">{rows[0]?.item || '-'}</h1>
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-sm sm:text-[20px] font-bold">Time</p>
                                        <h1 className="text-lg sm:text-xl lg:text-[28px]">{rows[0]?.time || '-'}</h1>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <p className="text-sm sm:text-[20px] font-bold">Location</p>
                                        <h1 className="text-sm sm:text-base lg:text-[16px]">{rows[0]?.location || '-'}</h1>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3 sm:gap-5 w-full lg:w-auto">
                                    <div className="flex flex-col">
                                        <p className="text-sm sm:text-[20px] font-bold">Method</p>
                                        <h1 className="text-lg sm:text-xl lg:text-[28px]">{rows[0]?.method || '-'}</h1>
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-sm sm:text-[20px] font-bold">Date</p>
                                        <h1 className="text-lg sm:text-xl lg:text-[28px]">{rows[0]?.date || '-'}</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* User Profiles */}
                    <div className="flex flex-col sm:flex-row justify-center gap-8 sm:gap-16 lg:gap-80 mt-4">
                        {/* Buyer Profile */}
                        <div className="flex flex-col justify-center items-center cursor-pointer">
                            <div className="w-full flex flex-col justify-center items-center" onClick={goToProfileB}>
                                <img src="/user.png" alt="user" className="w-12 h-12 sm:w-[63px] sm:h-[63px]"/>
                                <p className="text-sm sm:text-[20px] mt-2">{rows[0]?.buyer || 'Buyer'}</p>
                                <div className="flex text-xl sm:text-3xl mt-1">
                                    {stars.map((s) => (
                                        <span key={s} className="text-[#FFC107]">{s <= Math.floor(selectedRating) ? "★" : "☆"}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-[#9BC0E6] w-12 h-12 sm:w-[60px] sm:h-[60px] flex justify-center items-center rounded-full mt-3 hover:cursor-pointer transition-colors hover:bg-[#7aa8d1]" onClick={goToNextB}>
                                <button onClick={goToNextB}><img src="/chat.png" alt="chat" className="w-6 h-6 sm:w-[38px] sm:h-[38px] hover:cursor-pointer"/></button>
                            </div>
                        </div>

                        {/* Seller Profile */}
                        <div className="flex flex-col justify-center items-center cursor-pointer">
                            <div className="w-full flex flex-col justify-center items-center" onClick={goToProfileS}>
                                <img src="/user.png" alt="user" className="w-12 h-12 sm:w-[63px] sm:h-[63px]"/>
                                <p className="text-sm sm:text-[20px] mt-2">{rows[0]?.seller || 'Seller'}</p>
                                <div className="flex text-xl sm:text-3xl mt-1">
                                    {stars.map((s) => (
                                        <span key={s} className="text-[#FFC107]">{s <= Math.floor(selectedRating) ? "★" : "☆"}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-[#9BC0E6] w-12 h-12 sm:w-[60px] sm:h-[60px] flex justify-center items-center rounded-full mt-3 hover:cursor-pointer transition-colors hover:bg-[#7aa8d1]" onClick={goToNextS}>
                                <button><img src="/chat.png" alt="chat" className="w-6 h-6 sm:w-[38px] sm:h-[38px] hover:cursor-pointer" onClick={goToNextS}/></button>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 sm:mt-8">
                        <div className="flex w-full h-full justify-center">
                            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-5 w-full max-w-4xl">
                                {rows[0].status !== 'pending' && rows[0].status !== 'rejected' ? (
                                    <>
                                        <div className="flex justify-center items-center w-full sm:w-[441px] h-12 sm:h-[52px] bg-[#76DD5F] rounded-2xl hover:cursor-pointer transition-colors hover:bg-[#5cb85c]" onClick={goToNext}>
                                            <button className="text-lg sm:text-xl lg:text-[32px] hover:cursor-pointer font-medium" onClick={goToNext}>Deal</button>
                                        </div>
                                        <div className="flex justify-center items-center w-full sm:w-[441px] h-12 sm:h-[52px] bg-[#F64848] rounded-2xl hover:cursor-pointer transition-colors hover:bg-[#d63a3a]" onClick={() => setPop(!pop)}>
                                            <button className="text-lg sm:text-xl lg:text-[32px] hover:cursor-pointer font-medium" onClick={() =>setPop(!pop)}>Not Deal</button>
                                        </div>
                                    </>
                                ) : ("")}
                            </div>
                        </div>
                    </div>
                </div>
            {pop &&(
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="flex flex-col justify-start items-start p-4 sm:p-6 lg:p-10 w-full max-w-[838px] max-h-[90vh] overflow-y-auto bg-white border-3 rounded-3xl">
                        {serverRole == "Seller" ? (
                            <div className="flex flex-col justify-between gap-3 sm:gap-5 mt-8 sm:mt-20 w-full">
                                <h1 className="text-xl sm:text-2xl lg:text-[32px] mb-3 sm:mb-5 font-bold">Reason Not Dealing</h1>
                                <div className="flex items-center gap-2 cursor-pointer">
                                    <div
                                        onClick={() => setSelected(!selected)}
                                        className={`w-6 h-6 sm:w-[37px] sm:h-[37px] rounded-full border-3 ${
                                        selected ? "bg-blue-600 border-black" : "bg-white border-black"
                                        }`}
                                    />
                                    <span className="text-sm sm:text-lg lg:text-[28px] text-[#F64848]">Buyer didn't show up</span>
                                </div>
                                <div className="flex items-center gap-2 cursor-pointer">
                                    <div
                                        onClick={() => setSelected2(!selected2)}
                                        className={`w-6 h-6 sm:w-[37px] sm:h-[37px] rounded-full border-3 ${
                                        selected2 ? "bg-blue-600 border-black" : "bg-white border-black"
                                        }`}
                                    />
                                    <span className="text-sm sm:text-lg lg:text-[28px] text-[#F64848]">Buyer asked to lower the price too much</span>
                                </div>
                                <div className="flex items-center gap-2 cursor-pointer">
                                    <div
                                        onClick={() => setSelected3(!selected3)}
                                        className={`w-6 h-6 sm:w-[37px] sm:h-[37px] rounded-full border-3 ${
                                        selected3 ? "bg-blue-600 border-black" : "bg-white border-black"
                                        }`}
                                    />
                                    <span className="text-sm sm:text-lg lg:text-[28px] text-[#F64848]">Buyer changed meeting time/place suddenly</span>
                                </div>
                                <div className="flex items-center gap-2 cursor-pointer">
                                    <div
                                        onClick={() => setSelected4(!selected4)}
                                        className={`w-6 h-6 sm:w-[37px] sm:h-[37px] rounded-full border-3 ${
                                        selected4 ? "bg-blue-600 border-black" : "bg-white border-black"
                                        }`}
                                    />
                                    <span className="text-sm sm:text-lg lg:text-[28px] text-[#F64848]">Safety concerns about the buyer</span>
                                </div>
                                <div className="flex items-center gap-2 cursor-pointer">
                                    <div
                                        onClick={() => setSelected5(!selected5)}
                                        className={`w-6 h-6 sm:w-[37px] sm:h-[37px] rounded-full border-3 ${
                                        selected5 ? "bg-blue-600 border-black" : "bg-white border-black"
                                        }`}
                                    />
                                    <span className="text-sm sm:text-lg lg:text-[28px] text-[#F64848]">Buyer check too many but not serious</span>
                                </div>
                                <div className="flex items-center gap-2 cursor-pointer">
                                    <div
                                        onClick={() => setSelected6(!selected6)}
                                        className={`w-6 h-6 sm:w-[37px] sm:h-[37px] rounded-full border-3 ${
                                        selected6 ? "bg-blue-600 border-black" : "bg-white border-black"
                                        }`}
                                    />
                                    <span className="text-sm sm:text-lg lg:text-[28px] text-[#F64848]">Buyer seemed suspicious</span>
                                </div>
                                <div className="flex items-center gap-2 cursor-pointer">
                                    <div
                                        onClick={() => setSelected7(!selected7)}
                                        className={`w-6 h-6 sm:w-[37px] sm:h-[37px] rounded-full border-3 ${
                                        selected7 ? "bg-blue-600 border-black" : "bg-white border-black"
                                        }`}
                                    />
                                    <span className="text-sm sm:text-lg lg:text-[28px] text-[#F64848]">Buyer didn't follow the agreed COD location</span>
                                </div>
                                <div className="flex items-center gap-2 cursor-pointer">
                                    <div
                                        onClick={() => setSelected8(!selected8)}
                                        className={`w-6 h-6 sm:w-[37px] sm:h-[37px] rounded-full border-3 ${
                                        selected8 ? "bg-blue-600 border-black" : "bg-white border-black"
                                        }`}
                                    />
                                    <span className="text-sm sm:text-lg lg:text-[28px] text-[#F64848]">Buyer didn't agree with product condition</span>
                                </div>
                            </div>
                        ):(
                            <div className="flex flex-col justify-between gap-3 sm:gap-5 mt-8 sm:mt-20 w-full">
                                <h1 className="text-xl sm:text-2xl lg:text-[32px] mb-3 sm:mb-5 font-bold">Reason Not Dealing</h1>
                                <div className="flex items-center gap-2 cursor-pointer">
                                    <div
                                        onClick={() => setSelected(!selected)}
                                        className={`w-6 h-6 sm:w-[37px] sm:h-[37px] rounded-full border-3 ${
                                        selected ? "bg-blue-600 border-black" : "bg-white border-black"
                                        }`}
                                    />
                                    <span className="text-sm sm:text-lg lg:text-[28px] text-[#F64848]">Found cheaper elsewhere</span>
                                </div>
                                <div className="flex items-center gap-2 cursor-pointer">
                                    <div
                                        onClick={() => setSelected2(!selected2)}
                                        className={`w-6 h-6 sm:w-[37px] sm:h-[37px] rounded-full border-3 ${
                                        selected2 ? "bg-blue-600 border-black" : "bg-white border-black"
                                        }`}
                                    />
                                    <span className="text-sm sm:text-lg lg:text-[28px] text-[#F64848]">Fake Product</span>
                                </div>
                                <div className="flex items-center gap-2 cursor-pointer">
                                    <div
                                        onClick={() => setSelected3(!selected3)}
                                        className={`w-6 h-6 sm:w-[37px] sm:h-[37px] rounded-full border-3 ${
                                        selected3 ? "bg-blue-600 border-black" : "bg-white border-black"
                                        }`}
                                    />
                                    <span className="text-sm sm:text-lg lg:text-[28px] text-[#F64848]">Item not as expected</span>
                                </div>
                                <div className="flex items-center gap-2 cursor-pointer">
                                    <div
                                        onClick={() => setSelected4(!selected4)}
                                        className={`w-6 h-6 sm:w-[37px] sm:h-[37px] rounded-full border-3 ${
                                        selected4 ? "bg-blue-600 border-black" : "bg-white border-black"
                                        }`}
                                    />
                                    <span className="text-sm sm:text-lg lg:text-[28px] text-[#F64848]">Item quality not good</span>
                                </div>
                                <div className="flex items-center gap-2 cursor-pointer">
                                    <div
                                        onClick={() => setSelected5(!selected5)}
                                        className={`w-6 h-6 sm:w-[37px] sm:h-[37px] rounded-full border-3 ${
                                        selected5 ? "bg-blue-600 border-black" : "bg-white border-black"
                                        }`}
                                    />
                                    <span className="text-sm sm:text-lg lg:text-[28px] text-[#F64848]">Wrong size / type</span>
                                </div>
                                <div className="flex items-center gap-2 cursor-pointer">
                                    <div
                                        onClick={() => setSelected6(!selected6)}
                                        className={`w-6 h-6 sm:w-[37px] sm:h-[37px] rounded-full border-3 ${
                                        selected6 ? "bg-blue-600 border-black" : "bg-white border-black"
                                        }`}
                                    />
                                    <span className="text-sm sm:text-lg lg:text-[28px] text-[#F64848]">Safety concerns</span>
                                </div>
                                <div className="flex items-center gap-2 cursor-pointer">
                                    <div
                                        onClick={() => setSelected7(!selected7)}
                                        className={`w-6 h-6 sm:w-[37px] sm:h-[37px] rounded-full border-3 ${
                                        selected7 ? "bg-blue-600 border-black" : "bg-white border-black"
                                        }`}
                                    />
                                    <span className="text-sm sm:text-lg lg:text-[28px] text-[#F64848]">Payment Issues</span>
                                </div>
                                <div className="flex items-center gap-2 cursor-pointer">
                                    <div
                                        onClick={() => setSelected8(!selected8)}
                                        className={`w-6 h-6 sm:w-[37px] sm:h-[37px] rounded-full border-3 ${
                                        selected8 ? "bg-blue-600 border-black" : "bg-white border-black"
                                        }`}
                                    />
                                    <span className="text-sm sm:text-lg lg:text-[28px] text-[#F64848]">Too expensive after seeing in person</span>
                                </div>
                            </div>
                        )}
                        <div className="w-full flex justify-center mt-8 sm:mt-30">
                            <div className="flex justify-center items-center w-full sm:w-[536px] h-12 sm:h-[52px] border-2 rounded-2xl cursor-pointer transition-colors hover:bg-gray-50" onClick={goToNext}>
                                <button className="text-lg sm:text-xl lg:text-[32px] cursor-pointer font-medium" onClick={goToNext}>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
        </>
    )
}
