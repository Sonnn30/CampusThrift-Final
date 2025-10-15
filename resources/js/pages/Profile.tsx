import { useState } from "react"
import { useForm } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";
import axios from 'axios';

export default function Profile({role , profile}){
    const [completed, setCompleted] = useState(false)
    const [reported, setReported] = useState(false)
    const [selected, setSelected] = useState(false)
    const [selected2, setSelected2] = useState(false)
    const [selected3, setSelected3] = useState(false)
    const [selected4, setSelected4] = useState(false)
    const [selected5, setSelected5] = useState(false)
    const [selected6, setSelected6] = useState(false)
    const [selected7, setSelected7] = useState(false)
    const [selected8, setSelected8] = useState(false)
    const [isHidden, setIsHidden] = useState(false)
    const { props } = usePage();
    const user = props.auth?.user;
    console.log(role)
    function goToChat() {
        window.location.href = `/${role}/chat`
    }

    const { data, setData, post, processing, errors } = useForm({
        firstname: profile?.firstname || "",
        lastname: profile?.lastname || "",
        angkatan: profile?.angkatan || "",
        university: profile?.university || "",
        email: profile?.email || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/Profile/${role}`);
        axios.post(`/Profile/${role}`, data)
        .then(res => {
            console.log(res.data);
            alert('Profile berhasil disimpan!');
        })
        .catch(err => {
            console.error(err.response?.data);
            alert('Gagal menyimpan profile');
        });
    };
// axios.post('/Profile/Seller', data)
//      .then(res => console.log(res.data));

    return(
        <>
            <div className="flex flex-col items-center justify-center gap-10 w-full h-full py-10">
                <div className="flex justify-between items-center w-full px-25">
                    <h1 className="text-[38px] font-semibold">{role} Profile</h1>
                    <img
                        src="/editblack.png"
                        alt="edit"
                        className="w-[40px] h-[40px] cursor-pointer"
                        onClick={() => setIsHidden(!isHidden)}
                    />
                </div>

                <div className="flex justify-between items-center w-[1350px] h-[161px] shadow-2xl rounded-2xl px-10">
                    <div className="flex justify-between items-center gap-5">
                        <img src="/user.png" alt="user"  className="w-[123px] h-[123px]"/>
                        <div className="flex flex-col gap-1">
                            <h1 className="text-[36px]">{user?.name}</h1>
                            <p className="text-[24px]">
                                {isHidden ? (
                                    <input type="text" placeholder="Angkatan"
                                        value={data.angkatan}
                                        onChange={(e) => setData("angkatan", e.target.value)}
                                        className="border rounded-lg p-2"
                                    />
                                ): (
                                    <span>{data.angkatan}</span>
                                )}
                            </p>
                        </div>
                    </div>
                    <img src="/chat2.png" alt="chat2" className="w-[82px] h-[82px] cursor-pointer" onClick={goToChat}/>
                </div>
                <div className="flex flex-col gap-1 w-[1350px] h-[507px] shadow-2xl rounded-2xl px-10">
                    <div className="flex justify-start p-10">
                        <h1 className="text-[38px]">Personal Information</h1>
                    </div>
                    <form onSubmit={handleSubmit} className="flex gap-80 items-center py-10 px-15">
                        <div className="flex flex-col gap-20 text-[24px]">
                            <div className="flex flex-col gap-1">
                                <p className="text-[#2A6C86]">First name</p>
                                {isHidden ? (
                                    <input type="text"
                                        value={data.firstname}
                                        onChange={(e) => setData("firstname", e.target.value)}
                                        className="border rounded-lg p-2"
                                    />
                                ): (
                                    <p>{data.firstname}</p>
                                )}
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-[#2A6C86]">Email address</p>
                                {isHidden ? (
                                    <input type="text"
                                        value={data.email}
                                        onChange={(e) => setData("email", e.target.value)}
                                        className="border rounded-lg p-2"
                                    />
                                ): (
                                    <p>{data.email}</p>
                                )}
                            </div>

                        </div>
                        <div className="flex flex-col gap-20 text-[24px]">
                            <div className="flex flex-col gap-1">
                                <p className="text-[#2A6C86]">Last name</p>
                                {isHidden ? (
                                    <input type="text"
                                        value={data.lastname}
                                        onChange={(e) => setData("lastname", e.target.value)}
                                        className="border rounded-lg p-2"
                                    />
                                ): (
                                    <p>{data.lastname}</p>
                                )}
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-[#2A6C86]">University</p>
                                {isHidden ? (
                                    <input type="text"
                                        value={data.university}
                                        onChange={(e) => setData("university", e.target.value)}
                                        className="border rounded-lg p-2"
                                    />
                                ): (
                                    <p>{data.university}</p>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
                <div className="flex flex-col gap-1 w-[1350px] h-[480px] shadow-2xl rounded-2xl px-10">
                    <div className="flex justify-start p-10">
                        <h1 className="text-[38px]">Credibility</h1>
                    </div>
                    <div className="flex gap-92 items-center py-10 px-15">
                        <div className="flex flex-col gap-20 text-[24px]">
                            <div className="flex flex-col gap-1">
                                <p className="text-[#2A6C86]">Item selled</p>
                                <p>n selled</p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-[#2A6C86]">Response time</p>
                                <p>1 hour</p>

                            </div>

                        </div>
                        <div className="flex flex-col gap-20 text-[24px]">
                            <div className="flex flex-col gap-1">
                                <p className="text-[#2A6C86]">Status</p>
                                <p>Online</p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-[#2A6C86]">Account age</p>
                                <p>1 Year</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between gap-3">
                    {isHidden ? (
                    <div className="text-[42px] border-2 w-[800px] h-[90px] flex justify-center items-center rounded-3xl cursor-pointer" onClick={(e) => {
                            e.preventDefault();
                            handleSubmit(e);
                            setIsHidden(!isHidden);
                        }}>
                        <button type="submit" disabled={processing} className="cursor-pointer" onClick={(e) => {
                            e.preventDefault();
                            handleSubmit(e);
                            setIsHidden(!isHidden);
                        }}>
                            {processing ? "Saving..." : "Update"}
                        </button>
                    </div>
                    ) : (
                        <>
                            <div className="w-[670px] h-[75px] bg-[#8CF375] flex justify-center items-center text-[32px] rounded-3xl cursor-pointer border-2" onClick={()=> setCompleted(!completed)}>
                                <button onClick={() => setCompleted(!completed)} className="cursor-pointer">Completed Transaction</button>
                            </div>
                            <div className="w-[670px] h-[75px] bg-[#F64848] flex justify-center items-center text-[32px] rounded-3xl cursor-pointer border-2" onClick={()=> setReported(!reported)}>
                                <button onClick={() => setReported(!reported)} className="cursor-pointer">Report Seller</button>
                            </div>
                        </>
                    )}
                </div>
                {completed && (
                    <div className="absolute flex flex-col justify-center w-[900px] h-[800px] bg-[#BBDCE5] border-2 rounded-3xl">
                        <div className="w-full h-[100px] mt-10 flex justify-beetween items-center gap-130 px-15 py-10 text-[32px]">
                            <h1>All Transactions</h1>
                            <button onClick={() => setCompleted(!completed)}><img src="/cross.png" alt="back" className="w-[20px] h-[20px]"/></button>

                        </div>
                        <div className="flex justify-center items-start px-15 py-10 w-full h-full">
                            <table className="w-full border-separate">
                                <thead>
                                    <th className="text-[28px] text-left">Time</th>
                                    <th className="text-[28px] text-left">Buyer</th>
                                    <th className="text-[28px] text-left">Method</th>
                                    <th className="text-[28px] text-left">ID</th>
                                    <th className="text-[28px] text-left">Amount</th>
                                </thead>
                                <tbody>
                                    {[
                                        {date: "Aug 6, 2025", buyer: "Dane John", method: "COD", id: "INV202508069876", amount: "Rp 200.000", success: true },
                                        {date: "Aug 6, 2025", buyer: "Dane John", method: "COD", id: "INV202508069876", amount: "Rp 200.000", success: false },
                                        {date: "Aug 6, 2025", buyer: "Dane John", method: "COD", id: "INV202508069876", amount: "Rp 200.000", success: true },
                                        {date: "Aug 6, 2025", buyer: "Dane John", method: "COD", id: "INV202508069876", amount: "Rp 200.000", success: false },
                                        {date: "Aug 6, 2025", buyer: "Dane John", method: "COD", id: "INV202508069876", amount: "Rp 200.000", success: true },
                                        {date: "Aug 6, 2025", buyer: "Dane John", method: "COD", id: "INV202508069876", amount: "Rp 200.000", success: false },
                                        {date: "Aug 6, 2025", buyer: "Dane John", method: "COD", id: "INV202508069876", amount: "Rp 200.000", success: true },
                                        {date: "Aug 6, 2025", buyer: "Dane John", method: "COD", id: "INV202508069876", amount: "Rp 200.000", success: false },
                                        {date: "Aug 6, 2025", buyer: "Dane John", method: "COD", id: "INV202508069876", amount: "Rp 200.000", success: true },
                                        {date: "Aug 6, 2025", buyer: "Dane John", method: "COD", id: "INV202508069876", amount: "Rp 200.000", success: false },
                                        {date: "Aug 6, 2025", buyer: "Dane John", method: "COD", id: "INV202508069876", amount: "Rp 200.000", success: true },
                                        {date: "Aug 6, 2025", buyer: "Dane John", method: "COD", id: "INV202508069876", amount: "Rp 200.000", success: false },
                                        {date: "Aug 6, 2025", buyer: "Dane John", method: "COD", id: "INV202508069876", amount: "Rp 200.000", success: true },
                                    ].map((row, index) => (
                                        <tr
                                            key={index}
                                            className={`${
                                            index % 2 === 0 ? "bg-[#C9E3EB]" : "bg-[#BBDCE5]"
                                        } border-b border-[#9FCAD8] hover:bg-[#A8D2E0] transition`}
                                        >
                                            <td className="w-[130px] px-2">{row.date}</td>
                                            <td className="w-[120px] px-2">{row.buyer}</td>
                                            <td className="w-[130px] px-2">{row.method}</td>
                                            <td className="w-[170px] px-2">{row.id}</td>
                                            <td className="w-[170px] px-2">{row.amount}</td>
                                            <td className="py-2 px-4 flex justify-center items-center">
                                                {row.success ? (
                                                <div className="bg-green-500 w-6 h-6 rounded-full flex justify-center items-center">
                                                    <img src="/check.png" alt="check" className="w-3 h-3" />
                                                </div>
                                                ) : (
                                                <div className="bg-red-500 w-6 h-6 rounded-full flex justify-center items-center">
                                                    <img src="/cross.png" alt="cross" className="w-3 h-3" />
                                                </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                        </div>
                    </div>
                )}
                {reported && (
                     <div className="absolute flex flex-col justify-center items-start w-[900px] h-[800px] px-10 bg-white border-2 rounded-3xl">
                        <h1 className="text-[48px]">Report Seller</h1>
                      <div className="flex flex-col justify-between gap-5 mt-10 px-3">
                            <h1 className="text-[32px] mb-2">Why you report this seller?</h1>
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
                            <div className="w-full flex justify-center mt-10">
                                <div className="flex justify-center items-center w-[536px] h-[52px] border-2 rounded-2xl cursor-pointer" onClick={() => {setReported(!reported)}}>
                                    <button className="text-[32px] cursor-pointer" onClick={() => {setReported(!reported)}}>Submit</button>
                                </div>
                            </div>
                    </div>
                )}
            </div>
        </>

    )
}
