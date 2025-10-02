import { useEffect, useState } from "react";
import { format } from "date-fns";
import  Picker  from "react-mobile-picker";

export default function CODTime(){
    const goToNext = () => {
        if (!date) return;
        localStorage.setItem("selectedTime", `${value.hour}:${value.minute}`);
        window.location.href = "/COD/location";
    }
    const goBack = () =>{
        window.location.href = "/COD/date"
    }
    const [date, setDate] = useState<Date | null>(null)
    useEffect(()=>{
        const stored = localStorage.getItem("selectedDate");
        if(stored){
            setDate(new Date(stored));
        }
    }, [])
    const [value, setValue] = useState({ hour: "12", minute: "30" });

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
                                <h1 className="text-[40px] font-bold">Select Time Page </h1>
                            </div>
                            <div className="flex justify-between ml-9 gap-3">
                                <img src="/calendar.png" alt="calendar" width={40} height={40}/>
                                <p className="text-[24px]">{date ? format(date, "dd/MM/yyyy") : "No date selected"}</p>
                            </div>
                            <div className="flex justify-between ml-9 gap-3">
                                <img src="/clock.png" alt="calendar" width={40} height={40}/>
                                <p className="text-[24px]">{value.hour}:{value.minute}</p>
                            </div>
                            <div className="flex justify-center items-center mt-40 rounded-xl ml-7 w-[491px] h-[68px] bg-[#BBDCE5] hover:cursor-pointer" onClick={goToNext}>
                                <button className="text-[32px] hover:cursor-pointer" onClick={goToNext}>Next</button>
                            </div>
                        </div>
                    </div>

                    <div className="flex-[1.2] flex flex-col items-start mt-8">
                        <div className="pl-10 flex justify-between gap-85">
                            <h1 className="text-[32px] font-bold">Select Time</h1>
                            <img src="/undo.png" alt="back" className="hover:cursor-pointer" width={46} height={46} onClick={goBack}/>
                        </div>
                        <div className="flex w-full h-full justify-center items-center">
                        <Picker
                            value={value}
                            onChange={setValue}
                            itemHeight={80}   // tinggi tiap item
                            height={400}      // 80 * 5 = 400px → tampil 5 angka
                        >
                            <Picker.Column name="hour">
                            {Array.from({ length: 24 }, (_, i) => (
                                <Picker.Item
                                key={i}
                                value={String(i).padStart(2, "0")}
                                className="text-[64px]"
                                >
                                {String(i).padStart(2, "0")}
                                </Picker.Item>
                            ))}
                            </Picker.Column>

                            <div className="flex justify-center items-center px-15">
                            <p className="text-[64px] font-bold">:</p>
                            </div>

                            <Picker.Column name="minute">
                            {Array.from({ length: 60 }, (_, i) => (
                                <Picker.Item
                                key={i}
                                value={String(i).padStart(2, "0")}
                                className="text-[64px]"
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

        </>
    )
}
