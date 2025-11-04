import React, { useEffect, useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  isSameDay,
} from "date-fns";
import CalendarGrid from "../utils/CalendarGrid";
import CalendarHeader from "../utils/CalendarHeader";
import WeekDays from "../utils/WeekDays";
import EventModal from "../components/Event";

interface Event {
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  color: string;
}

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dataFromChild, setDataFromChild] = useState<Event[]>([]);
  const [eventsData, setEventsData] = useState<Event[]>([]);
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
  };

  const handleCloseModal = () => {
    setSelectedDate(null);
  };
  const selectedDayEvents = selectedDate
    ? eventsData.filter((ev) => isSameDay(new Date(ev.date), selectedDate))
    : [];
  useEffect(() => {
    if (dataFromChild) {
      setEventsData((prevEvents) => [...prevEvents, ...dataFromChild]);
    }
  }, [dataFromChild]);
  const handleManualAdd = (newEvent: Event) => {
    setEventsData((prev) => [...prev, newEvent]);
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-10 px-4">
      <CalendarHeader
        currentDate={currentDate}
        onPrev={() => setCurrentDate(subMonths(currentDate, 1))}
        onNext={() => setCurrentDate(addMonths(currentDate, 1))}
        onDataUpdate={setDataFromChild}
        onManualAdd={handleManualAdd}
      />
      <WeekDays />
      <CalendarGrid
        startDate={startDate}
        endDate={endDate}
        monthStart={monthStart}
        events={eventsData}
        onDayClick={handleDayClick}
      />
      {selectedDate && (
        <EventModal
          day={selectedDate}
          events={selectedDayEvents}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Calendar;
