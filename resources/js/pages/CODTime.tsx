import { useEffect, useState } from "react";
import { format } from "date-fns";
import Picker from "react-mobile-picker";
import { router } from '@inertiajs/react';
import CODTimeRoute from '@/routes/CODTime';

interface Product {
    id: number;
    product_name: string;
    product_price: number;
    description: string;
    image?: string;
}

interface CODTimeProps {
    product: Product;
    selectedDate: string;
    availableTimes: string[];
}

export default function CODTime({ product, selectedDate, availableTimes }: CODTimeProps){
    const goToNext = () => {
        if (!date) return;

        const selectedTime = `${value.hour}:${value.minute}`;

        router.post(CODTimeRoute.store.url(), {
            time: selectedTime
        }, {
            onSuccess: () => {
                window.location.href = "/COD/location";
            },
            onError: (errors) => {
                console.error('Error submitting time:', errors);
                alert("An error occurred. Please try again.");
            }
        });
    }

    const goBack = () => {
        router.get('/COD/date', { product_id: product.id });
    }
    const [date, setDate] = useState<Date | null>(null)

    useEffect(() => {
        if (selectedDate) {
            setDate(new Date(selectedDate));
        }
    }, [selectedDate])
    const [value, setValue] = useState({ hour: "12", minute: "30" });

    return(
        <>
            <div className="flex flex-col justify-center items-center w-full min-h-screen p-4 sm:p-6 lg:p-10 bg-gray-50">
                {/* Header */}
                <div className="flex flex-col items-center mt-4 sm:mt-8 lg:mt-12 mb-6 sm:mb-8 lg:mb-10">
                    <h2 className="text-2xl sm:text-3xl lg:text-[40px] font-semibold text-gray-700">COD</h2>
                    <h1 className="text-3xl sm:text-4xl lg:text-[54px] font-bold text-center">Select your date & time</h1>
                </div>

                {/* Main Container */}
                <div className="flex flex-col lg:flex-row justify-center items-stretch w-full max-w-[1217px] lg:h-[698px] border-2 sm:border-4 border-[#BBDCE5] rounded-lg lg:rounded-none bg-white shadow-xl overflow-hidden">
                    {/* Left Panel - Info & Selection Display */}
                    <div className="flex-1 flex flex-col justify-between items-start p-6 sm:p-8 lg:p-10 border-b-2 lg:border-b-0 lg:border-r-4 border-[#BBDCE5]">
                        <div className="flex flex-col gap-6 sm:gap-8 w-full">
                            {/* Logo */}
                            <div className="flex justify-center lg:justify-start">
                                <img
                                    src="/LogoCampusThrift.png"
                                    alt="CampusThrift"
                                    className="w-[120px] sm:w-[150px] lg:w-[190px] h-auto"
                                />
                            </div>

                            {/* Title */}
                            <div>
                                <h1 className="text-2xl sm:text-3xl lg:text-[40px] font-bold text-gray-800">Select Time Page</h1>
                            </div>

                            {/* Selected Date Display */}
                            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <img
                                    src="/calendar.png"
                                    alt="calendar"
                                    className="w-8 h-8 sm:w-10 sm:h-10"
                                />
                                <p className="text-lg sm:text-xl lg:text-[24px] font-medium">
                                    {date ? format(date, "dd/MM/yyyy") : "No date selected"}
                                </p>
                            </div>

                            {/* Selected Time Display */}
                            <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <img
                                    src="/clock.png"
                                    alt="clock"
                                    className="w-8 h-8 sm:w-10 sm:h-10"
                                />
                                <p className="text-lg sm:text-xl lg:text-[24px] font-medium text-blue-700">
                                    {value.hour}:{value.minute}
                                </p>
                            </div>
                        </div>

                        {/* Next Button */}
                        <button
                            className="w-full mt-6 lg:mt-8 rounded-xl h-[56px] sm:h-[60px] lg:h-[68px] bg-[#BBDCE5] text-xl sm:text-2xl lg:text-[32px] font-semibold hover:bg-[#a8cbd6] hover:shadow-lg active:scale-[0.98] transition-all duration-200 cursor-pointer"
                            onClick={goToNext}
                        >
                            Next
                        </button>
                    </div>

                    {/* Right Panel - Time Picker */}
                    <div className="flex-1 lg:flex-[1.2] flex flex-col items-center lg:items-start p-6 sm:p-8 lg:p-10 bg-white">
                        <div className="w-full">
                            {/* Header with Back Button */}
                            <div className="flex justify-between items-center mb-6 sm:mb-8">
                                <h1 className="text-xl sm:text-2xl lg:text-[32px] font-bold">Select Time</h1>
                                <button
                                    onClick={goBack}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    title="Go Back"
                                >
                                    <img
                                        src="/undo.png"
                                        alt="back"
                                        className="w-8 h-8 sm:w-10 sm:h-10 lg:w-[46px] lg:h-[46px] cursor-pointer"
                                    />
                                </button>
                            </div>

                            {/* Time Picker */}
                            <div className="flex w-full justify-center items-center min-h-[300px] sm:min-h-[400px]">
                                <Picker
                                    value={value}
                                    onChange={setValue}
                                    itemHeight={60}   // Reduced for mobile
                                    height={300}      // 60 * 5 = 300px
                                    className="w-full"
                                >
                                    <Picker.Column name="hour">
                                        {Array.from({ length: 24 }, (_, i) => (
                                            <Picker.Item
                                                key={i}
                                                value={String(i).padStart(2, "0")}
                                                className="text-3xl sm:text-4xl lg:text-[64px] font-medium"
                                            >
                                                {String(i).padStart(2, "0")}
                                            </Picker.Item>
                                        ))}
                                    </Picker.Column>

                                    <div className="flex justify-center items-center px-4 sm:px-6 lg:px-15">
                                        <p className="text-3xl sm:text-4xl lg:text-[64px] font-bold text-gray-700">:</p>
                                    </div>

                                    <Picker.Column name="minute">
                                        {Array.from({ length: 60 }, (_, i) => (
                                            <Picker.Item
                                                key={i}
                                                value={String(i).padStart(2, "0")}
                                                className="text-3xl sm:text-4xl lg:text-[64px] font-medium"
                                            >
                                                {String(i).padStart(2, "0")}
                                            </Picker.Item>
                                        ))}
                                    </Picker.Column>
                                </Picker>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Helper Text (Mobile) */}
                <div className="lg:hidden mt-4 text-center text-sm text-gray-600">
                    <p>🕐 Scroll to select hour and minute</p>
                    <p className="mt-1">Choose your preferred time for COD</p>
                </div>
            </div>

        </>
    )
}
