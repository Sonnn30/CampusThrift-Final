import React from "react";
import dayjs from "dayjs";

export default function Month({ daysInWeek, events = [], role}) {
  const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`);

  function getCurrentDayClass(day) {
    return day.format("DD-MM-YY") === dayjs().format("DD-MM-YY")
      ? "bg-blue-400 text-white rounded-full px-2 py-1"
      : "";
  }

  function getEventsForCell(day, hour) {
    const targetDate = day.format("YYYY-MM-DD");
    return events.filter(
      (e) => e.date === targetDate && e.time === hour
    );
  }
    function goToTransactionDetail(){
        const role = localStorage.getItem("role") || "Buyer";
        window.location.href = `/${role}/TransactionDetail`
    }


  return (
    <div className="w-full overflow-x-auto no-scrollbar">
      <div className="grid grid-cols-8 min-w-[900px]">
        {/* Header kolom jam */}
        <div className="sticky top-0 z-20 border-b-2 border-t-2 border-[#BBDCE5] flex justify-center items-center font-semibold h-[40px]">
          Hour
        </div>

        {/* Header hari */}
        {daysInWeek.map((day, i) => (
          <div
            key={i}
            className="sticky top-0 z-20 border-l-2 border-b-2 border-t-2 border-[#BBDCE5] flex justify-center items-center font-semibold h-[40px]"
          >
            <span className={getCurrentDayClass(day)}>{day.format("ddd DD")}</span>
          </div>
        ))}

        {/* Isi tabel */}
        {hours.map((hour, i) => (
          <React.Fragment key={i}>
            {/* Kolom pertama: jam */}
            <div className="flex flex-col justify-end items-end h-[100px] p-2 text-center font-medium">
              {hour}
            </div>

            {/* Kolom hari */}
            {daysInWeek.map((day, j) => {
              const cellEvents = getEventsForCell(day, hour);
              return (
                <div
                  key={`${i}-${j}`}
                  className="relative border-l-2 border-b-2 h-[100px] border-[#BBDCE5] p-1 text-center"
                >
                  {cellEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`absolute top-1 left-1 right-1 ${event.color} rounded-md text-sm p-1 shadow-md cursor-pointer`}
                      onClick={goToTransactionDetail}
                    >
                      <div className="font-semibold">{event.title}</div>
                      <div className="text-xs">{event.time}</div>
                    </div>
                  ))}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
