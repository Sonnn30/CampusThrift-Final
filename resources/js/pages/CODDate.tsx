import React from "react";
import { format } from "date-fns";
import { DayPicker } from 'react-day-picker';
import { router } from '@inertiajs/react';
import CODDateRoute from '@/routes/CODDate';

interface Product {
    id: number;
    product_name: string;
    product_price: number;
    description: string;
    image?: string;
}

interface CODDateProps {
    product: Product;
}

export default function CODDate({ product }: CODDateProps){
    const [selected, setSelected] = React.useState<Date>();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const goToNext = () => {
        if(!selected){
            setError("Please select a date");
            return;
        }

        // Check if selected date is after today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if(selected <= today){
            setError("Please select a date after today");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        router.post(CODDateRoute.store.url(), {
            product_id: product.id,
            date: format(selected, 'yyyy-MM-dd')
        }, {
            onSuccess: () => {
                setIsSubmitting(false);
            },
            onError: (errors) => {
                setIsSubmitting(false);
                if(errors.date){
                    setError(errors.date);
                } else if(errors.product_id){
                    setError(errors.product_id);
                } else {
                    setError("An error occurred. Please try again.");
                }
            }
        });
    }

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
                                <h1 className="text-2xl sm:text-3xl lg:text-[40px] font-bold text-gray-800">Select Date Page</h1>
                            </div>

                            {/* Selected Date Display */}
                            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <img
                                    src="/calendar.png"
                                    alt="calendar"
                                    className="w-8 h-8 sm:w-10 sm:h-10"
                                />
                                <p className="text-lg sm:text-xl lg:text-[24px] font-medium">
                                    {selected ? format(selected, "dd/MM/yyyy") : "No date selected"}
                                </p>
                            </div>

                            {/* Error message */}
                            {error && (
                                <div className="p-3 sm:p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm sm:text-base">
                                    ⚠️ {error}
                                </div>
                            )}
                        </div>

                        {/* Next Button */}
                        <button
                            className={`w-full mt-6 lg:mt-8 rounded-xl h-[56px] sm:h-[60px] lg:h-[68px] bg-[#BBDCE5] text-xl sm:text-2xl lg:text-[32px] font-semibold transition-all duration-200 ${
                                isSubmitting
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'hover:bg-[#a8cbd6] hover:shadow-lg active:scale-[0.98] cursor-pointer'
                            }`}
                            onClick={goToNext}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Processing..." : "Next"}
                        </button>
                    </div>

                    {/* Right Panel - Calendar */}
                    <div className="flex-1 lg:flex-[1.2] flex flex-col items-center lg:items-start p-6 sm:p-8 lg:p-10 bg-white">
                        <div className="w-full">
                            <h1 className="text-xl sm:text-2xl lg:text-[32px] font-bold mb-4 sm:mb-6 text-center lg:text-left">Select a Date</h1>
                            <div className="flex justify-center lg:justify-start">
                                <DayPicker
                                    mode="single"
                                    selected={selected}
                                    onSelect={setSelected}
                                    disabled={{ before: new Date() }}
                                    formatters={{
                                        formatWeekdayName: (date) => format(date, "EEE"),
                                    }}
                                    classNames={{
                                        day_button: "w-[40px] h-[40px] sm:w-[45px] sm:h-[45px] lg:w-[50px] lg:h-[50px] hover:bg-[#BBDCE5] rounded-full hover:cursor-pointer transition-colors",
                                        selected: "bg-[#BBDCE5] text-white font-bold",
                                        root: "text-base sm:text-lg lg:text-[24px]",
                                        nav: "flex justify-between mt-4 sm:mt-6 lg:mt-8",
                                        nav_button_previous: "absolute left-0 top-1/2 -translate-y-1/2 z-10 hover:bg-gray-100 rounded-full p-2 transition-colors",
                                        nav_button_next: "absolute right-0 top-1/2 -translate-y-1/2 z-10 hover:bg-gray-100 rounded-full p-2 transition-colors",
                                        caption_label: "flex justify-center items-center -mt-6 sm:-mt-8 lg:-mt-10 font-semibold",
                                        day: "p-2 sm:p-2.5 lg:p-3.5",
                                        month: "w-full",
                                        month_caption: "flex justify-center relative mb-4",
                                        weeks: "mt-4",
                                        weekdays: "flex justify-around mb-2",
                                        weekday: "w-[40px] sm:w-[45px] lg:w-[50px] text-center font-medium text-gray-600",
                                        week: "flex justify-around",
                                        day_button_disabled: "opacity-30 cursor-not-allowed",
                                        day_button_today: "border-2 border-[#BBDCE5] font-bold",
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Helper Text (Mobile) */}
                <div className="lg:hidden mt-4 text-center text-sm text-gray-600">
                    <p>📅 Select a date from the calendar above</p>
                    <p className="mt-1">Choose a date after today to continue</p>
                </div>
            </div>
        </>
    )
}
