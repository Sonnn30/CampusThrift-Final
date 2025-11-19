import { useState } from "react"
import { useForm } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";
import axios from 'axios';
import useTranslation from "@/Hooks/useTranslation";

interface Transaction {
    date: string;
    buyer: string;
    buyer_id: number;
    seller_id: number;
    method: string;
    id: string;
    amount: string;
    success: boolean;
    appointment_id?: number;
}

export default function Profile({ role, profile }) {
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
    const [reportedUserId, setReportedUserId] = useState<number | null>(null)
    const [appointmentId, setAppointmentId] = useState<number | null>(null)

    const { props } = usePage<{
        role: string;
        profile: any;
        user: any;
        completedTransactions: Transaction[];
    }>();

    const user = props.auth?.user;
    const currentRole = (props.role ?? role ?? 'Buyer') as string;
    const profileData = props.profile ?? profile ?? {};
    const completedTransactions = props.completedTransactions || [];

    console.log(currentRole)
    console.log('Completed Transactions:', completedTransactions);

    const handleReportSubmit = async () => {
        const reasons = [];
        if (selected) reasons.push("Buyer didn't show up");
        if (selected2) reasons.push("Buyer asked to lower the price too much");
        if (selected3) reasons.push("Buyer changed meeting time/place suddenly");
        if (selected4) reasons.push("Safety concerns about the buyer");
        if (selected5) reasons.push("Buyer check too many but not serious");
        if (selected6) reasons.push("Buyer seemed suspicious");
        if (selected7) reasons.push("Buyer didn't follow the agreed COD location");
        if (selected8) reasons.push("Buyer didn't agree with product condition");

        if (reasons.length === 0) {
            alert("Please select at least one reason");
            return;
        }

        if (!reportedUserId) {
            alert("User information not available");
            return;
        }

        try {
            const locale = getLocale();
            if (reportedUserId && reportedUserId === user?.id) {
                alert("You cannot report yourself.");
                return;
            }

            const response = await axios.post(`/${locale}/Profile/${currentRole}/report`, {
                reported_id: reportedUserId,
                appointment_id: appointmentId,
                reasons: reasons,
                additional_notes: ""
            });

            console.log('Report submitted:', response.data);
            alert('Report submitted successfully!');
            setReported(false);

            // Reset selections
            setSelected(false);
            setSelected2(false);
            setSelected3(false);
            setSelected4(false);
            setSelected5(false);
            setSelected6(false);
            setSelected7(false);
            setSelected8(false);
        } catch (error) {
            console.error('Error submitting report:', error);
            alert('Failed to submit report');
        }
    };

    const getLocale = () => {
        const path = typeof window !== 'undefined' ? window.location.pathname : '';
        const match = path.match(/^\/([a-z]{2})\//);
        return match ? match[1] : 'id';
    };

    const { data, setData, post, processing, errors } = useForm({
        firstname: profileData?.firstname || "",
        lastname: profileData?.lastname || "",
        angkatan: profileData?.angkatan || "",
        university: profileData?.university || "",
        email: profileData?.email || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const locale = getLocale();
        post(`/${locale}/Profile/${currentRole}`, {
            onSuccess: () => {
                alert('Profile berhasil disimpan!');
            },
            onError: () => {
                alert('Gagal menyimpan profile');
            },
        });
    };
// axios.post('/Profile/Seller', data)
//      .then(res => console.log(res.data));
    const {t} = useTranslation()
    return(
        <>
            <div className="flex flex-col items-center justify-center gap-6 sm:gap-8 lg:gap-10 w-full min-h-screen py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8 bg-gray-50">
                {/* Header */}
                <div className="flex justify-between items-center w-full max-w-[1350px]">
                    <h1 className="text-2xl sm:text-3xl lg:text-[38px] font-semibold">{currentRole} {t('Profile')}</h1>
                    <img
                        src="/editblack.png"
                        alt="edit"
                        className="w-8 h-8 sm:w-10 sm:h-10 lg:w-[40px] lg:h-[40px] cursor-pointer hover:opacity-70 transition-opacity"
                        onClick={() => setIsHidden(!isHidden)}
                    />
                </div>

                {/* User Info Card */}
                <div className="flex flex-col sm:flex-row justify-between items-center w-full max-w-[1350px] min-h-[140px] sm:min-h-[161px] shadow-2xl rounded-2xl px-6 sm:px-8 lg:px-10 py-6 sm:py-4 bg-white gap-4 sm:gap-0">
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
                        <img src="/user.png" alt="user" className="w-20 h-20 sm:w-28 sm:h-28 lg:w-[123px] lg:h-[123px] rounded-full border-4 border-gray-200"/>
                        <div className="flex flex-col gap-1 text-center sm:text-left">
                            <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-bold">{user?.name}</h1>
                            <p className="text-lg sm:text-xl lg:text-[24px] text-gray-600">
                                {isHidden ? (
                                    <input type="text" placeholder="Angkatan"
                                        value={data.angkatan}
                                        onChange={(e) => setData("angkatan", e.target.value)}
                                        className="border-2 border-gray-300 rounded-lg p-2 w-full sm:w-auto text-base sm:text-lg focus:border-blue-500 focus:outline-none"
                                    />
                                ): (
                                    <span>{data.angkatan}</span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Personal Information Card */}
                <div className="flex flex-col gap-4 w-full max-w-[1350px] shadow-2xl rounded-2xl px-6 sm:px-8 lg:px-10 py-6 sm:py-8 bg-white">
                    <div className="flex justify-start">
                        <h1 className="text-2xl sm:text-3xl lg:text-[38px] font-bold">{t('Personal')}</h1>
                    </div>
                    <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8 lg:gap-20 xl:gap-80 py-4 sm:py-6 lg:py-10">
                        {/* Left Column */}
                        <div className="flex flex-col gap-8 sm:gap-12 lg:gap-20 text-base sm:text-xl lg:text-[24px] flex-1">
                            <div className="flex flex-col gap-2">
                                <p className="text-[#2A6C86] font-semibold">{t('First name')}</p>
                                {isHidden ? (
                                    <input type="text"
                                        value={data.firstname}
                                        onChange={(e) => setData("firstname", e.target.value)}
                                        className="border-2 border-gray-300 rounded-lg p-3 text-base sm:text-lg focus:border-blue-500 focus:outline-none"
                                    />
                                ): (
                                    <p className="text-gray-700">{data.firstname}</p>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="text-[#2A6C86] font-semibold">{t('Email address')}</p>
                                {isHidden ? (
                                    <input type="text"
                                        value={data.email}
                                        onChange={(e) => setData("email", e.target.value)}
                                        className="border-2 border-gray-300 rounded-lg p-3 text-base sm:text-lg focus:border-blue-500 focus:outline-none"
                                    />
                                ): (
                                    <p className="text-gray-700 break-all">{data.email}</p>
                                )}
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="flex flex-col gap-8 sm:gap-12 lg:gap-20 text-base sm:text-xl lg:text-[24px] flex-1">
                            <div className="flex flex-col gap-2">
                                <p className="text-[#2A6C86] font-semibold">{t('Last name')}</p>
                                {isHidden ? (
                                    <input type="text"
                                        value={data.lastname}
                                        onChange={(e) => setData("lastname", e.target.value)}
                                        className="border-2 border-gray-300 rounded-lg p-3 text-base sm:text-lg focus:border-blue-500 focus:outline-none"
                                    />
                                ): (
                                    <p className="text-gray-700">{data.lastname}</p>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="text-[#2A6C86] font-semibold">{t('University')}</p>
                                {isHidden ? (
                                    <input type="text"
                                        value={data.university}
                                        onChange={(e) => setData("university", e.target.value)}
                                        className="border-2 border-gray-300 rounded-lg p-3 text-base sm:text-lg focus:border-blue-500 focus:outline-none"
                                    />
                                ): (
                                    <p className="text-gray-700">{data.university}</p>
                                )}
                            </div>
                        </div>
                    </form>
                </div>

                {/* Credibility Card */}
                <div className="flex flex-col gap-4 w-full max-w-[1350px] shadow-2xl rounded-2xl px-6 sm:px-8 lg:px-10 py-6 sm:py-8 bg-white">
                    <div className="flex justify-start">
                        <h1 className="text-2xl sm:text-3xl lg:text-[38px] font-bold">{t('Credibility')}</h1>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 lg:gap-20 xl:gap-92 py-4 sm:py-6 lg:py-10">
                        {/* Left Column */}
                        <div className="flex flex-col gap-8 sm:gap-12 lg:gap-20 text-base sm:text-xl lg:text-[24px] flex-1">
                            <div className="flex flex-col gap-2">
                                <p className="text-[#2A6C86] font-semibold">{t('Item selled')}</p>
                                <p className="text-gray-700">n selled</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="text-[#2A6C86] font-semibold">{t('Response time')}</p>
                                <p className="text-gray-700">1 hour</p>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="flex flex-col gap-8 sm:gap-12 lg:gap-20 text-base sm:text-xl lg:text-[24px] flex-1">
                            <div className="flex flex-col gap-2">
                                <p className="text-[#2A6C86] font-semibold">{t('Status')}</p>
                                <p className="text-green-600 font-semibold">Online</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="text-[#2A6C86] font-semibold">{t('Account age')}</p>
                                <p className="text-gray-700">1 Year</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-3 w-full max-w-[1350px]">
                    {isHidden ? (
                        <div className="text-2xl sm:text-3xl lg:text-[42px] border-2 border-gray-300 w-full sm:w-[600px] lg:w-[800px] h-[70px] sm:h-[80px] lg:h-[90px] flex justify-center items-center rounded-3xl cursor-pointer hover:bg-gray-100 transition-colors bg-white" onClick={(e) => {
                            e.preventDefault();
                            handleSubmit(e);
                            setIsHidden(!isHidden);
                        }}>
                            <button type="submit" disabled={processing} className="cursor-pointer font-semibold" onClick={(e) => {
                                e.preventDefault();
                                handleSubmit(e);
                                setIsHidden(!isHidden);
                            }}>
                                {processing ? "Saving..." : "Update"}
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="w-full sm:w-[48%] lg:w-[670px] h-[60px] sm:h-[70px] lg:h-[75px] bg-[#8CF375] hover:bg-[#7BE363] flex justify-center items-center text-xl sm:text-2xl lg:text-[32px] rounded-3xl cursor-pointer border-2 border-gray-300 transition-colors" onClick={()=> setCompleted(!completed)}>
                                <button onClick={() => setCompleted(!completed)} className="cursor-pointer font-semibold">{t('Completed Transaction')}</button>
                            </div>
                            <div className="w-full sm:w-[48%] lg:w-[670px] h-[60px] sm:h-[70px] lg:h-[75px] bg-[#F64848] hover:bg-[#E53939] flex justify-center items-center text-xl sm:text-2xl lg:text-[32px] rounded-3xl cursor-pointer border-2 border-gray-300 transition-colors" onClick={()=> {
                                // Set default reported user (dari transaksi terakhir jika ada)
                                if (completedTransactions.length > 0) {
                                    const lastTransaction = completedTransactions[0];
                                    setReportedUserId(currentRole === 'Seller' ? lastTransaction.buyer_id : lastTransaction.seller_id);
                                    setAppointmentId(lastTransaction.appointment_id || null);
                                }
                                setReported(!reported);
                            }}>
                                <button onClick={() => {
                                    if (completedTransactions.length > 0) {
                                        const lastTransaction = completedTransactions[0];
                                        setReportedUserId(currentRole === 'Seller' ? lastTransaction.buyer_id : lastTransaction.seller_id);
                                        setAppointmentId(lastTransaction.appointment_id || null);
                                    }
                                    setReported(!reported);
                                }} className="cursor-pointer font-semibold">{t('Report')} {currentRole === 'Seller' ? 'Buyer' : 'Seller'}</button>
                            </div>
                        </>
                    )}
                </div>
                {/* Completed Transactions Modal */}
                {completed && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                        <div className="flex flex-col w-full max-w-[900px] max-h-[90vh] bg-[#BBDCE5] border-2 rounded-2xl sm:rounded-3xl overflow-hidden">
                            {/* Modal Header */}
                            <div className="w-full flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b-2 border-[#9FCAD8] bg-[#A8D2E0]">
                                <h1 className="text-xl sm:text-2xl lg:text-[32px] font-bold">{t('All Transaction')}</h1>
                                <button
                                    onClick={() => setCompleted(!completed)}
                                    className="w-8 h-8 sm:w-10 sm:h-10 flex justify-center items-center rounded-full hover:bg-[#9FCAD8] transition-colors"
                                >
                                    <img src="/cross.png" alt="close" className="w-4 h-4 sm:w-5 sm:h-5"/>
                                </button>
                            </div>

                            {/* Modal Content - Scrollable */}
                            <div className="flex-1 overflow-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                                {completedTransactions.length > 0 ? (
                                    <>
                                        {/* Desktop Table View (hidden on mobile) */}
                                        <div className="hidden md:block overflow-x-auto">
                                            <table className="w-full border-separate border-spacing-0">
                                                <thead>
                                                    <tr className="bg-[#9FCAD8]">
                                                        <th className="text-base lg:text-[24px] text-left px-3 py-3 font-bold rounded-tl-lg">Time</th>
                                                        <th className="text-base lg:text-[24px] text-left px-3 py-3 font-bold">Buyer</th>
                                                        <th className="text-base lg:text-[24px] text-left px-3 py-3 font-bold">Method</th>
                                                        <th className="text-base lg:text-[24px] text-left px-3 py-3 font-bold">ID</th>
                                                        <th className="text-base lg:text-[24px] text-left px-3 py-3 font-bold">Amount</th>
                                                        <th className="text-base lg:text-[24px] text-center px-3 py-3 font-bold rounded-tr-lg">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {completedTransactions.map((row, index) => (
                                                        <tr
                                                            key={index}
                                                            className={`${
                                                                index % 2 === 0 ? "bg-[#C9E3EB]" : "bg-[#BBDCE5]"
                                                            } hover:bg-[#A8D2E0] transition-colors`}
                                                        >
                                                            <td className="px-3 py-3 text-sm lg:text-base">{row.date}</td>
                                                            <td className="px-3 py-3 text-sm lg:text-base">{row.buyer}</td>
                                                            <td className="px-3 py-3 text-sm lg:text-base">{row.method}</td>
                                                            <td className="px-3 py-3 text-sm lg:text-base truncate max-w-[150px]">{row.id}</td>
                                                            <td className="px-3 py-3 text-sm lg:text-base">{row.amount}</td>
                                                            <td className="px-3 py-3 flex justify-center items-center">
                                                                {row.success ? (
                                                                    <div className="bg-green-500 w-6 h-6 lg:w-7 lg:h-7 rounded-full flex justify-center items-center shadow-md">
                                                                        <img src="/check.png" alt="success" className="w-3 h-3 lg:w-4 lg:h-4" />
                                                                    </div>
                                                                ) : (
                                                                    <div className="bg-red-500 w-6 h-6 lg:w-7 lg:h-7 rounded-full flex justify-center items-center shadow-md">
                                                                        <img src="/cross.png" alt="failed" className="w-3 h-3 lg:w-4 lg:h-4" />
                                                                    </div>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Mobile Card View (visible on mobile only) */}
                                        <div className="md:hidden flex flex-col gap-3">
                                            {completedTransactions.map((row, index) => (
                                                <div
                                                    key={index}
                                                    className="bg-white rounded-lg p-4 shadow-md border-2 border-[#9FCAD8]"
                                                >
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div className="flex-1">
                                                            <p className="text-xs text-gray-500 mb-1">Time</p>
                                                            <p className="text-sm font-semibold">{row.date}</p>
                                                        </div>
                                                        {row.success ? (
                                                            <div className="bg-green-500 w-8 h-8 rounded-full flex justify-center items-center shadow-md">
                                                                <img src="/check.png" alt="success" className="w-4 h-4" />
                                                            </div>
                                                        ) : (
                                                            <div className="bg-red-500 w-8 h-8 rounded-full flex justify-center items-center shadow-md">
                                                                <img src="/cross.png" alt="failed" className="w-4 h-4" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div>
                                                            <p className="text-xs text-gray-500">Buyer</p>
                                                            <p className="text-sm font-medium">{row.buyer}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500">Method</p>
                                                            <p className="text-sm font-medium">{row.method}</p>
                                                        </div>
                                                        <div className="col-span-2">
                                                            <p className="text-xs text-gray-500">Transaction ID</p>
                                                            <p className="text-sm font-medium truncate">{row.id}</p>
                                                        </div>
                                                        <div className="col-span-2">
                                                            <p className="text-xs text-gray-500">Amount</p>
                                                            <p className="text-base font-bold text-[#2A6C86]">{row.amount}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-gray-600">
                                        <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <p className="text-lg font-semibold">{t('No Completed Transaction')}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                {/* Report Modal */}
                {reported && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                        <div className="flex flex-col w-full max-w-[900px] max-h-[90vh] bg-white border-2 rounded-2xl sm:rounded-3xl overflow-hidden">
                            {/* Modal Header */}
                            <div className="w-full flex justify-between items-center px-4 sm:px-6 lg:px-10 py-4 sm:py-6 border-b-2 border-gray-200 bg-red-50">
                                <h1 className="text-2xl sm:text-3xl lg:text-[48px] font-bold text-[#F64848]">
                                    {t('Report')} {t(currentRole === 'Seller' ? 'Buyer' : 'Seller')}
                                </h1>
                                <button
                                    onClick={() => setReported(!reported)}
                                    className="w-8 h-8 sm:w-10 sm:h-10 flex justify-center items-center rounded-full hover:bg-gray-200 transition-colors"
                                >
                                    <img src="/cross.png" alt="close" className="w-4 h-4 sm:w-5 sm:h-5"/>
                                </button>
                            </div>

                            {/* Modal Content - Scrollable */}
                            <div className="flex-1 overflow-auto px-4 sm:px-6 lg:px-10 py-4 sm:py-6">
                                <h2 className="text-lg sm:text-xl lg:text-[32px] font-semibold mb-4 sm:mb-6">
                                    {t('Why')} {t(currentRole === 'Seller' ? 'Buyer' : 'Seller')}
                                </h2>

                                <div className="flex flex-col gap-3 sm:gap-4 lg:gap-5">
                                    {/* Reason 1 */}
                                    <div
                                        className="flex items-center gap-3 sm:gap-4 cursor-pointer p-2 sm:p-3 rounded-lg hover:bg-red-50 transition-colors"
                                        onClick={() => setSelected(!selected)}
                                    >
                                        <div
                                            className={`w-7 h-7 sm:w-8 sm:h-8 lg:w-[37px] lg:h-[37px] rounded-full border-2 lg:border-3 flex-shrink-0 transition-all ${
                                                selected ? "bg-blue-600 border-blue-700" : "bg-white border-gray-400"
                                            }`}
                                        >
                                            {selected && (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full"></div>
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-sm sm:text-lg lg:text-[24px] xl:text-[28px] text-[#F64848] font-medium">
                                            {t(currentRole === 'Seller' ? 'Buyer' : 'Seller')} {t("didn't show")}
                                        </span>
                                    </div>

                                    {/* Reason 2 */}
                                    <div
                                        className="flex items-center gap-3 sm:gap-4 cursor-pointer p-2 sm:p-3 rounded-lg hover:bg-red-50 transition-colors"
                                        onClick={() => setSelected2(!selected2)}
                                    >
                                        <div
                                            className={`w-7 h-7 sm:w-8 sm:h-8 lg:w-[37px] lg:h-[37px] rounded-full border-2 lg:border-3 flex-shrink-0 transition-all ${
                                                selected2 ? "bg-blue-600 border-blue-700" : "bg-white border-gray-400"
                                            }`}
                                        >
                                            {selected2 && (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full"></div>
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-sm sm:text-lg lg:text-[24px] xl:text-[28px] text-[#F64848] font-medium">
                                            {t(currentRole === 'Seller' ? 'Buyer' : 'Seller')} {t('Buyerprice')}
                                        </span>
                                    </div>

                                    {/* Reason 3 */}
                                    <div
                                        className="flex items-center gap-3 sm:gap-4 cursor-pointer p-2 sm:p-3 rounded-lg hover:bg-red-50 transition-colors"
                                        onClick={() => setSelected3(!selected3)}
                                    >
                                        <div
                                            className={`w-7 h-7 sm:w-8 sm:h-8 lg:w-[37px] lg:h-[37px] rounded-full border-2 lg:border-3 flex-shrink-0 transition-all ${
                                                selected3 ? "bg-blue-600 border-blue-700" : "bg-white border-gray-400"
                                            }`}
                                        >
                                            {selected3 && (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full"></div>
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-sm sm:text-lg lg:text-[24px] xl:text-[28px] text-[#F64848] font-medium">
                                            {t('Buyerchanged')}
                                        </span>
                                    </div>

                                    {/* Reason 4 */}
                                    <div
                                        className="flex items-center gap-3 sm:gap-4 cursor-pointer p-2 sm:p-3 rounded-lg hover:bg-red-50 transition-colors"
                                        onClick={() => setSelected4(!selected4)}
                                    >
                                        <div
                                            className={`w-7 h-7 sm:w-8 sm:h-8 lg:w-[37px] lg:h-[37px] rounded-full border-2 lg:border-3 flex-shrink-0 transition-all ${
                                                selected4 ? "bg-blue-600 border-blue-700" : "bg-white border-gray-400"
                                            }`}
                                        >
                                            {selected4 && (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full"></div>
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-sm sm:text-lg lg:text-[24px] xl:text-[28px] text-[#F64848] font-medium">
                                            {t('Buyersafety')} {t(currentRole === 'Seller' ? 'Buyer' : 'Seller')}
                                        </span>
                                    </div>

                                    {/* Reason 5 */}
                                    <div
                                        className="flex items-center gap-3 sm:gap-4 cursor-pointer p-2 sm:p-3 rounded-lg hover:bg-red-50 transition-colors"
                                        onClick={() => setSelected5(!selected5)}
                                    >
                                        <div
                                            className={`w-7 h-7 sm:w-8 sm:h-8 lg:w-[37px] lg:h-[37px] rounded-full border-2 lg:border-3 flex-shrink-0 transition-all ${
                                                selected5 ? "bg-blue-600 border-blue-700" : "bg-white border-gray-400"
                                            }`}
                                        >
                                            {selected5 && (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full"></div>
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-sm sm:text-lg lg:text-[24px] xl:text-[28px] text-[#F64848] font-medium">
                                            {t('Buyerserious')}
                                        </span>
                                    </div>

                                    {/* Reason 6 */}
                                    <div
                                        className="flex items-center gap-3 sm:gap-4 cursor-pointer p-2 sm:p-3 rounded-lg hover:bg-red-50 transition-colors"
                                        onClick={() => setSelected6(!selected6)}
                                    >
                                        <div
                                            className={`w-7 h-7 sm:w-8 sm:h-8 lg:w-[37px] lg:h-[37px] rounded-full border-2 lg:border-3 flex-shrink-0 transition-all ${
                                                selected6 ? "bg-blue-600 border-blue-700" : "bg-white border-gray-400"
                                            }`}
                                        >
                                            {selected6 && (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full"></div>
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-sm sm:text-lg lg:text-[24px] xl:text-[28px] text-[#F64848] font-medium">
                                            {t('Buyersuspicious')}
                                        </span>
                                    </div>

                                    {/* Reason 7 */}
                                    <div
                                        className="flex items-center gap-3 sm:gap-4 cursor-pointer p-2 sm:p-3 rounded-lg hover:bg-red-50 transition-colors"
                                        onClick={() => setSelected7(!selected7)}
                                    >
                                        <div
                                            className={`w-7 h-7 sm:w-8 sm:h-8 lg:w-[37px] lg:h-[37px] rounded-full border-2 lg:border-3 flex-shrink-0 transition-all ${
                                                selected7 ? "bg-blue-600 border-blue-700" : "bg-white border-gray-400"
                                            }`}
                                        >
                                            {selected7 && (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full"></div>
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-sm sm:text-lg lg:text-[24px] xl:text-[28px] text-[#F64848] font-medium">
                                            {t('Buyerlocation')}
                                        </span>
                                    </div>

                                    {/* Reason 8 */}
                                    <div
                                        className="flex items-center gap-3 sm:gap-4 cursor-pointer p-2 sm:p-3 rounded-lg hover:bg-red-50 transition-colors"
                                        onClick={() => setSelected8(!selected8)}
                                    >
                                        <div
                                            className={`w-7 h-7 sm:w-8 sm:h-8 lg:w-[37px] lg:h-[37px] rounded-full border-2 lg:border-3 flex-shrink-0 transition-all ${
                                                selected8 ? "bg-blue-600 border-black" : "bg-white border-gray-400"
                                            }`}
                                        >
                                            {selected8 && (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full"></div>
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-sm sm:text-lg lg:text-[24px] xl:text-[28px] text-[#F64848] font-medium">
                                            {t('Buyercondition')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="w-full flex justify-center px-4 sm:px-6 lg:px-10 py-4 sm:py-6 border-t-2 border-gray-200 bg-gray-50">
                                <button
                                    onClick={handleReportSubmit}
                                    className="w-full sm:w-auto min-w-[200px] sm:min-w-[300px] lg:min-w-[536px] h-[48px] sm:h-[52px] border-2 border-[#F64848] bg-[#F64848] hover:bg-[#E53939] text-white rounded-2xl text-lg sm:text-xl lg:text-[32px] font-bold cursor-pointer transition-colors shadow-md"
                                >
                                    Submit Report
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>

    )
}
