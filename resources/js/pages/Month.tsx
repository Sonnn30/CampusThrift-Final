import React from "react";
import dayjs from "dayjs";

export default function Month({ daysInWeek, events = [], role}: any) {
  // Debug: Log events to console
  console.log('=== MONTH COMPONENT DEBUG ===');
  console.log('Month component received events:', events);
  console.log('Month component received daysInWeek:', daysInWeek);
  console.log('Role:', role);
  console.log('Events count:', events.length);

  // Log each event details
  events.forEach((event: any, index: number) => {
    console.log(`Event ${index + 1}:`, {
      id: event.id,
      title: event.title,
      date: event.date,
      time: event.time,
      status: event.status,
      locations: event.locations
    });
  });

  // Log each day in daysInWeek
  daysInWeek.forEach((day: any, index: number) => {
    console.log(`Day ${index + 1}:`, {
      formatted: day.format("YYYY-MM-DD"),
      display: day.format("ddd DD")
    });
  });

  // Check if events match any days
  events.forEach((event: any) => {
    const eventDate = dayjs(event.date).format("YYYY-MM-DD");
    const matchingDay = daysInWeek.find((day: any) => day.format("YYYY-MM-DD") === eventDate);
    if (matchingDay) {
      console.log(`✅ Event matches day: ${eventDate} - ${event.title} at ${event.time}`);
    } else {
      console.log(`❌ Event does not match any day: ${eventDate} - ${event.title} at ${event.time}`);
    }
  });

  // Use all hours from 00:00 to 23:00
  // Use 24 hours labels but match any minute within the hour
  const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`);

  // Use daysInWeek from DayPicker
  const displayDays = daysInWeek;

  function getCurrentDayClass(day: any) {
    return day.format("DD-MM-YY") === dayjs().format("DD-MM-YY")
      ? "bg-blue-400 text-white rounded-full px-2 py-1"
      : "";
  }

  function getDayHeaderClass(day: any) {
    const targetDate = day.format("YYYY-MM-DD");
    const dayEvents = events.filter((e: any) => {
      const eventDate = dayjs(e.date).format("YYYY-MM-DD");
      return eventDate === targetDate;
    });

    if (dayEvents.length === 0) {
      return ""; // No appointments, default styling
    }

    // Check if there are any confirmed/approved appointments
    const hasConfirmed = dayEvents.some((e: any) => e.status === 'confirmed' || e.status === 'approved');
    if (hasConfirmed) {
      return "bg-green-400 text-white rounded-full px-2 py-1";
    }

    // Check if there are any rejected appointments
    const hasRejected = dayEvents.some((e: any) => e.status === 'rejected');
    if (hasRejected) {
      return "bg-red-400 text-white rounded-full px-2 py-1";
    }

    // Check if there are any pending appointments
    const hasPending = dayEvents.some((e: any) => e.status === 'pending');
    if (hasPending) {
      return "bg-gray-400 text-white rounded-full px-2 py-1";
    }

    // Check if there are any cancelled appointments
    const hasCancelled = dayEvents.some((e: any) => e.status === 'cancelled');
    if (hasCancelled) {
      return "bg-gray-500 text-white rounded-full px-2 py-1";
    }

    return ""; // Default styling
  }

  function getEventsForCell(day: any, hour: any) {
    const targetDate = day.format("YYYY-MM-DD");
    const matchingEvents = events.filter(
      (e: any) => {
        const eventDate = dayjs(e.date).format("YYYY-MM-DD");
        const eventTime = e.time.substring(0, 5); // HH:MM
        // Place any minute within the corresponding hour row
        const isSameHour = eventTime.substring(0, 2) === String(hour).substring(0, 2);
        const isMatch = eventDate === targetDate && isSameHour;

        if (isMatch) {
          console.log(`✅ MATCH FOUND: ${eventDate} === ${targetDate} && ${eventTime} === ${hour}`, e);
        }

        return isMatch;
      }
    );

    if (matchingEvents.length > 0) {
      console.log(`Found ${matchingEvents.length} events for ${targetDate} at ${hour}:`, matchingEvents);
    }

    return matchingEvents;
  }

  function getEventColor(status: any) {
    switch (status) {
      case 'pending':
        return 'bg-gray-400 text-white';
      case 'confirmed':
      case 'approved':
        return 'bg-green-500 text-white';
      case 'rejected':
        return 'bg-red-500 text-white';
      case 'cancelled':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-blue-400 text-white';
    }
  }

  function getCellBackgroundClass(day: any, hour: any) {
    const cellEvents = getEventsForCell(day, hour);

    if (cellEvents.length === 0) {
      return ""; // No appointments, default background
    }

    // Check if there are any confirmed/approved appointments
    const hasConfirmed = cellEvents.some((e: any) => e.status === 'confirmed' || e.status === 'approved');
    if (hasConfirmed) {
      return "bg-green-100"; // Light green background for confirmed/approved
    }

    // Check if there are any rejected appointments
    const hasRejected = cellEvents.some((e: any) => e.status === 'rejected');
    if (hasRejected) {
      return "bg-red-100"; // Light red background for rejected
    }

    // Check if there are any pending appointments
    const hasPending = cellEvents.some((e: any) => e.status === 'pending');
    if (hasPending) {
      return "bg-gray-100"; // Light gray background for pending
    }

    // Check if there are any cancelled appointments
    const hasCancelled = cellEvents.some((e: any) => e.status === 'cancelled');
    if (hasCancelled) {
      return "bg-gray-200"; // Darker gray background for cancelled
    }

    return ""; // Default background
  }
  function goToTransactionDetail(appointmentId: any){
    window.location.href = `/${role}/TransactionDetail?appointment_id=${appointmentId}`
  }


  return (
    <div className="w-full overflow-x-auto no-scrollbar">
      <div className="grid grid-cols-8 min-w-[900px]">
        {/* Header kolom jam */}
        <div className="sticky top-0 z-20 border-b-2 border-t-2 border-[#BBDCE5] flex justify-center items-center font-semibold h-[40px]">
          Hour
        </div>

        {/* Header hari */}
        {displayDays.map((day: any, i: any) => (
          <div
            key={i}
            className="sticky top-0 z-20 border-l-2 border-b-2 border-t-2 border-[#BBDCE5] flex justify-center items-center font-semibold h-[40px]"
          >
            <span className={getCurrentDayClass(day) || getDayHeaderClass(day)}>{day.format("ddd DD")}</span>
          </div>
        ))}

        {/* Isi tabel */}
        {hours.map((hour, i) => (
          <React.Fragment key={i}>
            {/* Kolom pertama: jam */}
            <div className="flex flex-col justify-end items-end h-[100px] p-2 text-center font-medium">
              {hour as string}
            </div>

            {/* Kolom hari */}
            {displayDays.map((day: any, j: any) => {
              const cellEvents = getEventsForCell(day, hour);
              const cellBackgroundClass = getCellBackgroundClass(day, hour);

              // Debug: Log cell events
              if (cellEvents.length > 0) {
                console.log(`Cell events for ${day.format('YYYY-MM-DD')} at ${hour}:`, cellEvents);
              }

              return (
                <div
                  key={`${i}-${j}`}
                  className={`relative border-l-2 border-b-2 h-[100px] border-[#BBDCE5] p-1 text-center ${cellBackgroundClass}`}
                >
                  {cellEvents.map((event: any) => (
                    <div
                      key={event.id}
                      className={`absolute top-1 left-1 right-1 ${getEventColor(event.status)} rounded-md text-sm p-2 shadow-md cursor-pointer hover:opacity-80 transition-opacity border-2 border-white`}
                      onClick={() => goToTransactionDetail(event.id)}
                    >
                      <div className="font-semibold truncate">{event.title}</div>
                      <div className="text-xs mt-1">{event.time}</div>
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
