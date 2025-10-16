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
    <div className="w-full min-h-screen bg-[#ECEEDF] p-4 sm:p-6 lg:p-0">
      <div className="flex flex-col lg:flex-row max-w-[1920px] mx-auto">
        {/* LEFT PANEL - Calendar & Appointments */}
        <div className="w-full lg:w-[500px] xl:w-[600px] flex flex-col bg-white lg:border-r-4 border-[#BBDCE5] shadow-lg lg:shadow-none">
          {/* Calendar Header */}
          <div className="flex flex-col w-full">
            <div className="flex justify-between items-center w-full border-b-2 border-[#BBDCE5] px-4 sm:px-6 lg:px-10 py-4 sm:py-6">
              <h1 className="text-xl sm:text-2xl lg:text-[28px] font-bold">Appointment Calendar</h1>
              <div className="flex gap-2">
                <button
                  className="flex justify-center items-center bg-[#BBDCE5] hover:bg-[#9FCAD8] px-3 py-2 rounded-full w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] cursor-pointer transition-colors"
                  onClick={handlePrev}
                >
                  <img
                    src="/arrow-down.png"
                    alt="prev"
                    className="w-[12px] h-[12px] sm:w-[15px] sm:h-[15px] transform rotate-[90deg]"
                  />
                </button>
                <button
                  className="flex justify-center items-center bg-[#BBDCE5] hover:bg-[#9FCAD8] px-3 py-2 rounded-full w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] cursor-pointer transition-colors"
                  onClick={handleNext}
                >
                  <img
                    src="/arrow-up.png"
                    alt="next"
                    className="w-[12px] h-[12px] sm:w-[15px] sm:h-[15px] transform rotate-[90deg]"
                  />
                </button>
              </div>
            </div>

            {/* DayPicker Calendar */}
            <div className="w-full px-2 sm:px-4 py-4">
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
                  today: "bg-blue-400 text-white rounded-full font-bold",
                  pendingEvent: "bg-gray-400 text-white rounded-full font-bold",
                  confirmedEvent: "bg-green-500 text-white rounded-full font-bold",
                  rejectedEvent: "bg-red-500 text-white rounded-full font-bold",
                }}
                classNames={{
                  day_button:
                    "flex justify-center items-center w-[32px] h-[32px] sm:w-[36px] sm:h-[36px] hover:bg-[#BBDCE5] rounded-full hover:cursor-pointer transition-all duration-150",
                  root: "flex justify-center items-center text-base sm:text-lg lg:text-[20px] w-full",
                  nav: "hidden",
                  caption_label: "hidden",
                  day: "p-2 sm:p-3",
                  months: "w-full",
                  month: "w-full",
                  month_grid: "w-full",
                  weekdays: "flex justify-around w-full mb-2",
                  weekday: "text-sm sm:text-base font-semibold text-gray-600",
                  week: "flex justify-around w-full",
                }}
              />
            </div>

            {/* Legend */}
            <div className="px-4 sm:px-6 lg:px-10 pb-4 flex flex-wrap gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
                <span>Today</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                <span>Pending</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span>Confirmed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span>Rejected</span>
              </div>
            </div>
          </div>

          {/* Appointment List */}
          <div className="flex items-center px-4 sm:px-6 lg:px-10 py-4 border-t-2 border-b-2 border-[#BBDCE5] bg-gray-50">
            <h1 className="text-lg sm:text-xl lg:text-[24px] font-bold">Appointment List</h1>
          </div>

          {/* Appointments */}
          <div className="flex-1 overflow-y-auto max-h-[400px] lg:max-h-none">
            {displayedEvents.length > 0 ? (
              displayedEvents.map((e: any) => (
                <div
                  key={e.id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 sm:px-6 lg:px-10 py-4 border-b-2 border-[#BBDCE5] hover:bg-gray-50 transition-colors gap-3 sm:gap-4"
                >
                  {/* User Avatar & Name */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="flex flex-col items-center gap-1">
                      <img src="/user.png" alt="user" className="w-10 h-10 sm:w-[45px] sm:h-[45px] rounded-full border-2 border-gray-300" />
                      {e.buyer_name && role === "Seller" && (
                        <p className="text-xs sm:text-[14px] font-bold text-center">{e.buyer_name}</p>
                      )}
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base sm:text-lg lg:text-[22px] font-semibold truncate">
                      <a href={`/${role}/TransactionDetail?appointment_id=${e.id}`} className="hover:text-blue-600 transition-colors">
                        {e.title}
                      </a>
                    </h2>
                    <p className="text-sm sm:text-base lg:text-[20px] text-gray-600">
                      {format(new Date(e.date), "EEE, MM/dd/yyyy")}
                    </p>
                  </div>

                  {/* Time & Actions */}
                  <div className="flex flex-col gap-2 items-end">
                    <div className="flex items-center gap-2">
                      <img src="/clock.png" alt="clock" className="w-5 h-5 sm:w-[25px] sm:h-[25px]" />
                      <p className="text-lg sm:text-xl lg:text-[25px] font-semibold">{e.time}</p>
                    </div>

                    {/* Status/Actions */}
                    {role === "Buyer" ? (
                      <span className={`flex justify-center items-center rounded text-xs sm:text-sm lg:text-[16px] px-3 py-1.5 font-bold ${
                        e.status === 'confirmed' ? 'bg-green-200 text-green-800' :
                        e.status === 'rejected' ? 'bg-red-200 text-red-800' :
                        e.status === 'completed' ? 'bg-blue-200 text-blue-800' :
                        'bg-yellow-200 text-yellow-800'
                      }`}>
                        {e.status ? e.status.charAt(0).toUpperCase() + e.status.slice(1) : 'Pending'}
                      </span>
                    ) : (
                      <div className="flex gap-2">
                        {e.status === 'pending' ? (
                          <>
                            <button
                              className="bg-[#68B143] w-7 h-7 sm:w-[28px] sm:h-[28px] flex justify-center items-center rounded-lg cursor-pointer hover:bg-green-600 transition-colors"
                              onClick={() => handleStatusUpdate(e.id, 'confirmed')}
                              title="Confirm"
                            >
                              <img src="/check.png" alt="check" className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                            </button>
                            <button
                              className="bg-[#F64848] w-7 h-7 sm:w-[28px] sm:h-[28px] flex justify-center items-center rounded-lg cursor-pointer hover:bg-red-600 transition-colors"
                              onClick={() => handleStatusUpdate(e.id, 'rejected')}
                              title="Reject"
                            >
                              <img src="/cross.png" alt="cross" className="w-4 h-4 sm:w-[16px] sm:h-[16px]" />
                            </button>
                          </>
                        ) : (
                          <span className={`flex justify-center items-center rounded text-xs sm:text-sm lg:text-[16px] px-3 py-1.5 font-bold ${
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
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-lg">No appointments scheduled</p>
              </div>
            )}
          </div>

          {/* View All Button */}
          {backendEvents.length > 3 && (
            <div className="flex justify-center items-center w-full py-4 border-t-2 border-[#BBDCE5]">
              <button
                className="flex justify-center items-center w-[200px] sm:w-[280px] h-[44px] sm:h-[50px] bg-[#BBDCE5] rounded-xl hover:bg-[#9FCAD8] transition-colors duration-200 text-base sm:text-[20px] font-bold"
                onClick={() => setShowAllAppointments(!showAllAppointments)}
              >
                {showAllAppointments ? 'Show Less' : `View All (${backendEvents.length})`}
              </button>
            </div>
          )}
        </div>

        {/* RIGHT PANEL - Month View */}
        <div className="flex-1 bg-white mt-4 lg:mt-0 rounded-lg lg:rounded-none shadow-lg lg:shadow-none">
          <div className="flex justify-between items-center px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-10 border-b-2 lg:border-b-0 border-[#BBDCE5]">
            <h2 className="text-xl sm:text-2xl lg:text-[28px] font-bold">
              {format(currMonth, "MMMM yyyy")}
            </h2>
            <div className="lg:hidden flex gap-2">
              <button
                className="flex justify-center items-center bg-[#BBDCE5] hover:bg-[#9FCAD8] px-3 py-2 rounded-full w-[36px] h-[36px] cursor-pointer transition-colors"
                onClick={handlePrev}
              >
                <img src="/arrow-down.png" alt="prev" className="w-[12px] h-[12px] transform rotate-[90deg]" />
              </button>
              <button
                className="flex justify-center items-center bg-[#BBDCE5] hover:bg-[#9FCAD8] px-3 py-2 rounded-full w-[36px] h-[36px] cursor-pointer transition-colors"
                onClick={handleNext}
              >
                <img src="/arrow-up.png" alt="next" className="w-[12px] h-[12px] transform rotate-[90deg]" />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[600px] h-[500px] sm:h-[600px] lg:h-[870px]">
              <Month daysInWeek={daysInWeek} events={backendEvents} role={role} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
