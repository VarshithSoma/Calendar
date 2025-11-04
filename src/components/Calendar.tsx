import React, { useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
} from "date-fns";
import CalendarHeader from "../utils/CalendarHeader";
import WeekDays from "../utils/WeekDays";

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  console.log(monthStart, monthEnd, startDate, endDate);

  return (
    <div className="w-full max-w-6xl mx-auto mt-10 px-4">
      <CalendarHeader
        currentDate={currentDate}
        onPrev={() => setCurrentDate(subMonths(currentDate, 1))}
        onNext={() => setCurrentDate(addMonths(currentDate, 1))}
      />
      <WeekDays />
    </div>
  );
};

export default Calendar;
