import React, { useState, useEffect } from "react";
import { format, addMonths, subMonths } from "date-fns";
import { DayPicker } from "react-day-picker";
import Month from "./Month";
import dayjs from "dayjs";
import { router } from "@inertiajs/react";

export default function MySchedule({role, appointments, events}: any) {
    // Read ?date=YYYY-MM-DD from URL to focus calendar week after redirect
    const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const initialDateParam = urlParams.get('date');

    const [selected, setSelected] = useState(dayjs(initialDateParam || undefined));
    const [daysInWeek, setDaysInWeek] = useState<any[]>([]);
    const [currMonth, setCurrMonth] = useState(new Date());
    const [showAllAppointments, setShowAllAppointments] = useState(false);

    useEffect(() => {
        const savedRole = localStorage.getItem("role");
    }, []);

    // Handle appointment status update for sellers
    const handleStatusUpdate = (appointmentId: any, status: any) => {
        router.patch(`/Seller/appointment/${appointmentId}/status`, {
            status: status
        }, {
            onSuccess: () => {
                alert(`Appointment ${status} successfully!`);
                window.location.reload();
            },
            onError: (errors) => {
                console.error('Error updating appointment:', errors);
                alert("An error occurred. Please try again.");
            }
        });
    };

    // Use events from backend, fallback to empty array if not provided
    const backendEvents = events || [];

    // Limit displayed appointments to 3 unless showAllAppointments is true
    const displayedEvents = showAllAppointments ? backendEvents : backendEvents.slice(0, 3);

    // Create separate arrays for different appointment statuses
    const pendingDates = backendEvents
        .filter((e: any) => e.status === 'pending')
        .map((e: any) => new Date(e.date));

    const confirmedDates = backendEvents
        .filter((e: any) => e.status === 'confirmed')
        .map((e: any) => new Date(e.date));

    const rejectedDates = backendEvents
        .filter((e: any) => e.status === 'rejected')
        .map((e: any) => new Date(e.date));
    useEffect(() => {
    const startOfWeek = dayjs(selected).startOf("week");
    const newDays = Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, "day"));
    setDaysInWeek(newDays);
    }, [selected]);

    const handleNext = () => setCurrMonth(addMonths(currMonth, 1));
    const handlePrev = () => setCurrMonth(subMonths(currMonth, 1));

  return (
    <div className="w-full h-full bg-[#ECEEDF]">
      <div className="flex justify-between">
        {/* LEFT PANEL */}
        <div className="flex-1 flex flex-col items-start border-r-3 border-[#BBDCE5] ">
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
                    pendingEvent: pendingDates,
                    confirmedEvent: confirmedDates,
                    rejectedEvent: rejectedDates,
                  }}
                  modifiersClassNames={{
                    today: "scale-x-62 scale-y-72 bg-blue-400 text-white rounded-full",
                    pendingEvent: "scale-x-62 scale-y-72 bg-gray-400 text-white rounded-full",
                    confirmedEvent: "scale-x-62 scale-y-72 bg-green-500 text-white rounded-full",
                    rejectedEvent: "scale-x-62 scale-y-72 bg-red-500 text-white rounded-full",
                  }}
                  classNames={{
                    day_button:
                      "flex justify-center items-center p-4 w-[30px] h-[30px] hover:bg-[#BBDCE5] rounded-full hover:cursor-pointer transition-all duration-150",
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

          {displayedEvents.map((e: any) => (
            <div
              key={e.id}
              className="flex justify-start items-center px-10  border-b-3 border-[#BBDCE5] w-full h-[100px]"
            >
              <div className="flex justify-between items-center gap-10 w-full">
                <div className="flex flex-col items-start justify-center gap-1">
                  <img src="/user.png" alt="user" className="w-[45px] h-[45px]" />
                  {e.buyer_name && role === "Seller" && (
                    <p className="text-[14px] font-bold">{e.buyer_name}</p>
                  )}
                </div>
                <div className="flex flex-col w-[300px]">
                  <h2 className="text-[22px]">
                    <a href={`/${role}/TransactionDetail?appointment_id=${e.id}`}>{e.title}</a>
                  </h2>
                  <p className="text-[20px]">{format(new Date(e.date), "EEE, MM/dd/yyyy")}</p>

                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center gap-2">
                    <img src="/clock.png" alt="clock" className="w-[25px] h-[25px]" />
                    <p className="text-[25px]">{e.time}</p>
                  </div>
                  <div className="flex justify-end">
                    {role === "Buyer" ? (
                      <div className="flex flex-col items-end gap-1">
                        <span className={`flex justify-center items-center rounded text-[16px] w-[100px] h-[30px] font-bold ${
                          e.status === 'confirmed' ? 'bg-green-200 text-green-800' :
                          e.status === 'rejected' ? 'bg-red-200 text-red-800' :
                          e.status === 'completed' ? 'bg-blue-200 text-blue-800' :
                          'bg-yellow-200 text-yellow-800'
                        }`}>
                          {e.status ? e.status.charAt(0).toUpperCase() + e.status.slice(1) : 'Pending'}
                        </span>
                      </div>
                    ) : (
                      <div className="flex justify-between gap-2">
                        {e.status === 'pending' ? (
                          <>
                            <div
                              className="bg-[#68B143] w-[28px] h-[28px] flex justify-center items-center rounded-lg cursor-pointer"
                              onClick={() => handleStatusUpdate(e.id, 'confirmed')}
                            >
                              <img src="/check.png" alt="check" className="w-[18px] h-[18px]" />
                            </div>
                            <div
                              className="bg-[#F64848] w-[28px] h-[28px] flex justify-center items-center rounded-lg cursor-pointer"
                              onClick={() => handleStatusUpdate(e.id, 'rejected')}
                            >
                              <img src="/cross.png" alt="cross" className="w-[16px] h-[16px]" />
                            </div>
                          </>
                        ) : (
                          <span className={`flex justify-center items-center rounded text-[16px] w-[100px] h-[30px] font-bold ${
                            e.status === 'confirmed' ? 'bg-green-200 text-green-800' :
                            e.status === 'completed' ? 'bg-blue-200 text-blue-800' :
                            'bg-red-200 text-red-800'
                          }`}>
                            {e.status ? e.status.charAt(0).toUpperCase() + e.status.slice(1) : 'Pending'}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {backendEvents.length > 3 && (
            <div className="flex justify-center items-center w-full py-5 cursor-pointer">
              <div
                className="flex justify-center items-center w-[280px] h-[50px] bg-[#BBDCE5] rounded-xl hover:bg-[#9FCAD8] transition-colors duration-200"
                onClick={() => setShowAllAppointments(!showAllAppointments)}
              >
                <button className="text-[20px] font-bold cursor-pointer">
                  {showAllAppointments ? 'Show Less' : 'View All'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-[2] ">
          <React.Fragment>
            <div className="flex justify-start items-center px-10 py-10 text-[28px]">
              {format(currMonth, "MMMM yyyy")}
            </div>
            <div className="flex flex-col h-[870px]">
              <Month daysInWeek={daysInWeek} events={backendEvents} role={role} />
            </div>
          </React.Fragment>
        </div>
      </div>
    </div>
  );
}
