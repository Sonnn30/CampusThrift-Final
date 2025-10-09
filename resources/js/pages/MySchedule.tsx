import * as React from "react";
import { useState, useEffect } from "react";
import { format, addMonths, subMonths } from "date-fns";
import { DayPicker } from "react-day-picker";
import Month from "./Month";
// @ts-ignore - dayjs types may be missing locally
import dayjs from "dayjs";
import { Inertia } from "@inertiajs/inertia";

type ScheduleEvent = {
    id: number | string;
    title: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:mm
    status?: string;
    color?: string;
}

type MyScheduleProps = {
    role: any;
    events?: ScheduleEvent[];
}

export default function MySchedule({role, events = []}: MyScheduleProps) {
    const [selected, setSelected] = useState(dayjs());
    const [daysInWeek, setDaysInWeek] = useState<any[]>([]);
    const [currMonth, setCurrMonth] = useState(new Date());

    useEffect(() => {
        const savedRole = localStorage.getItem("role");
    }, []);

    // events are provided by backend via Inertia props

    const eventDates = events.map((e) => new Date(e.date));
    useEffect(() => {
    const startOfWeek = dayjs(selected).startOf("isoWeek");
    const newDays = Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, "day"));
    setDaysInWeek(newDays);
    }, [selected]);

    const handleNext = () => setCurrMonth(addMonths(currMonth, 1));
    const handlePrev = () => setCurrMonth(subMonths(currMonth, 1));

  return (
    <div className="w-full h-full bg-[#ECEEDF]">
      <div className="flex justify-between">
        {/* LEFT PANEL */}
        <div className="flex-1 flex flex-col justify-center items-start border-r-3 border-[#BBDCE5]">
          {/* Header */}
          <div className="flex justify-center items-center w-full h-[500px]">
            <div className="flex flex-col justify-between items-center w-full h-[500px]">
              <div className="flex justify-center items-center w-full border-b-2 border-[#BBDCE5] h-[164px]">
                <div className="flex justify-between w-full px-10">
                  <h1 className="text-[28px]">Appointment Calendar</h1>
                  <div className="flex gap-2 ml-8">
                    <div
                      className="flex justify-center items-center bg-[#BBDCE5] hover:bg-[#9FCAD8] px-3 py-1 rounded-full w-full h-[40px] cursor-pointer"
                      onClick={handlePrev}
                    >
                      <img
                        src="/arrow-down.png"
                        alt="prev"
                        className="w-[15px] h-[15px] transform rotate-[90deg]"
                      />
                    </div>
                    <div
                      className="flex justify-center items-center bg-[#BBDCE5] hover:bg-[#9FCAD8] px-3 py-1 rounded-full w-full h-[40px] cursor-pointer"
                      onClick={handleNext}
                    >
                      <img
                        src="/arrow-up.png"
                        alt="next"
                        className="w-[15px] h-[15px] transform rotate-[90deg]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* DayPicker */}
              <div className="w-full h-full">
                <DayPicker
                  mode="single"
                  selected={selected.toDate()}
                  onSelect={(date) => setSelected(dayjs(date))}
                  month={currMonth}
                  onMonthChange={setCurrMonth}
                  formatters={{
                    formatWeekdayName: (date) => format(date, "EEE"),
                  }}
                  modifiers={{
                    today: new Date(),
                    hasEvent: eventDates,
                  }}
                  modifiersClassNames={{
                    today: "scale-x-62 scale-y-72 bg-blue-400 text-white rounded-full",
                    hasEvent: "scale-x-62 scale-y-72 bg-blue-200 text-black rounded-full",
                  }}
                  classNames={{
                    day_button:
                      "flex justify-center items-center p-4 w-[20px] h-[20px] hover:bg-[#BBDCE5] rounded-full hover:cursor-pointer transition-all duration-150",
                    root: "flex justify-center items-center text-[20px] w-full h-full",
                    nav: "hidden",
                    caption_label: "hidden",
                    day: "py-3 px-[18px]",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Appointment list */}
          <div className="flex items-center px-10 w-full h-[100px] border-t-3 border-b-2 border-[#BBDCE5]">
            <h1 className="text-[24px]">Appointment List</h1>
          </div>

          {events.map((e) => (
            <div
              key={e.id}
              className="flex justify-start items-center px-10 gap-5 border-b-3 border-[#BBDCE5] w-full h-[100px]"
            >
              <div className="flex justify-between items-center gap-3 w-full">
                <div>
                  <img src="/user.png" alt="user" className="w-[45px] h-[45px]" />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-[20px]">
                    <a href={`/${role}/TransactionDetail`}>{e.title}</a>
                  </h2>
                  <p className="text-[16px]">{format(new Date(e.date), "EEE, MM/dd/yyyy")}</p>
                </div>
                <div className="flex flex-col ml-20 gap-1">
                  <div className="flex justify-between items-center gap-2">
                    <img src="/clock.png" alt="clock" className="w-[25px] h-[25px]" />
                    <p className="text-[20px]">{e.time}</p>
                  </div>
                  <div className="flex justify-end">
                    {role === "Buyer" ? (
                      <p>Rejected</p>
                    ) : (
                      <div className="flex justify-between gap-2">
                        <div className="bg-[#68B143] w-[28px] h-[28px] flex justify-center items-center rounded-lg cursor-pointer" onClick={() => Inertia.post(`/Seller/appointments/${e.id}/confirm`)}>
                          <img src="/check.png" alt="check" className="w-[18px] h-[18px]" />
                        </div>
                        <div className="bg-[#F64848] w-[28px] h-[28px] flex justify-center items-center rounded-lg cursor-pointer" onClick={() => Inertia.post(`/Seller/appointments/${e.id}/reject`)}>
                          <img src="/cross.png" alt="cross" className="w-[16px] h-[16px]" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-center items-center w-full py-5 cursor-pointer">
            <div className="flex justify-center items-center w-[280px] h-[50px] bg-[#BBDCE5] rounded-xl">
              <button className="text-[20px] font-bold cursor-pointer">View All</button>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-[2]">
          <React.Fragment>
            <div className="flex justify-start items-center px-10 py-10 text-[28px]">
              {format(currMonth, "MMMM yyyy")}
            </div>
            <div className="flex flex-col h-[870px]">
              <Month daysInWeek={daysInWeek as any} events={events as any} role={role} />
            </div>
          </React.Fragment>
        </div>
      </div>
    </div>
  );
}
