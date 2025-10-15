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
            <div className="flex flex-col justify-center items-center w-full h-full gap-10 mb-20">
                <div className="flex flex-col items-center mt-20">
                    <h2 className="text-[40px]">COD</h2>
                    <h1 className="text-[54px]">Select your date & time</h1>
                </div>
                <div className="flex justify-center items-stretch w-[1217px] h-[698px] divide-x-4  divide-[#BBDCE5] border-4 border-[#BBDCE5]">
                    <div className="flex-1 flex justify-start items-start">
                        <div className="flex flex-col justify-between items-start gap-8">
                            <div className="">
                                <img src="/LogoCampusThrift.png" alt="CampusThrift" width={190} height={190} className="mt-10 ml-10"/>
                            </div>
                            <div className="ml-9.5">
                                <h1 className="text-[40px] font-bold">Select Date Page </h1>
                            </div>
                            <div className="flex justify-between ml-9 gap-3">
                                <img src="/calendar.png" alt="calendar" width={40} height={40}/>
                                <p className="text-[24px]">{selected ? format(selected, "dd/MM/yyyy") : "No date selected"}</p>
                            </div>

                            {/* Error message */}
                            {error && (
                                <div className="ml-9 mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                    {error}
                                </div>
                            )}

                            <div className="absolute flex justify-center items-center mt-[35%] rounded-xl ml-7 w-[491px] h-[68px] bg-[#BBDCE5] hover:cursor-pointer disabled:opacity-50" onClick={goToNext}>
                                <button
                                    className="text-[32px] hover:cursor-pointer disabled:cursor-not-allowed"
                                    onClick={goToNext}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Processing..." : "Next"}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex-[1.2] flex flex-col items-start mt-8 ">
                        <div className="pl-10">
                            <h1 className="text-[32px] font-bold">Select a Date</h1>
                                <DayPicker
                                    mode="single"
                                    selected={selected}
                                    onSelect={setSelected}
                                    disabled={{ before: new Date() }}
                                    formatters={{
                                        formatWeekdayName: (date) => format(date, "EEE"),
                                    }}
                                    classNames={{
                                        day_button: "w-[50px] h-[50px] hover:bg-[#BBDCE5] rounded-full hover:cursor-pointer",
                                        root: "text-[24px]",
                                        nav: "flex justify-between mt-8",
                                        nav_button_previous: "absolute left-0 top-1/2 -translate-y-1/2 z-10 w-100 h-100",
                                        nav_button_next: "absolute right-0 top-1/2 -translate-y-1/2 z-10 w-100 h-100",
                                        caption_label: "flex justify-center items-center -mt-8 mb-10",
                                        day: "p-3.5",
                                    }}
                                />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
