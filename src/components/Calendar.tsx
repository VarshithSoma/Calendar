import React, { useState } from "react";
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
  title: string;
  time: string;
}

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const events: Event[] = [
    {
      date: "2020-01-03",
      title: "Review workplace safety",
      time: "11:00 – 11:30 AM",
    },
    {
      date: "2020-01-03",
      title: "Review workplace safety",
      time: "11:00 – 11:30 AM",
    },
    {
      date: "2020-01-03",
      title: "Review workplace safety",
      time: "11:00 – 11:30 AM",
    },
    {
      date: "2025-11-03",
      title: "Team alignment",
      time: "Begins in 52 min",
    },
    {
      date: "2025-11-03",
      title: "Team alignment",
      time: "Begins in 52 min",
    },
    {
      date: "2025-11-03",
      title: "Team alignment",
      time: "Begins in 52 min",
    },
  ];
  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
  };

  const handleCloseModal = () => {
    setSelectedDate(null);
  };
  const selectedDayEvents = selectedDate
    ? events.filter((ev) => isSameDay(new Date(ev.date), selectedDate))
    : [];

  return (
    <div className="w-full max-w-6xl mx-auto mt-10 px-4">
      <CalendarHeader
        currentDate={currentDate}
        onPrev={() => setCurrentDate(subMonths(currentDate, 1))}
        onNext={() => setCurrentDate(addMonths(currentDate, 1))}
      />
      <WeekDays />
      <CalendarGrid
        startDate={startDate}
        endDate={endDate}
        monthStart={monthStart}
        events={events}
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
