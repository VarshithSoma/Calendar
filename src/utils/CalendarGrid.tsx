import React from "react";
import { addDays } from "date-fns";
import DayCell from "./DayCell";
interface Event {
  date: string;
  title: string;
  time: string;
}

interface CalendarGridProps {
  startDate: Date;
  endDate: Date;
  monthStart: Date;
  events: Event[];
  onDayClick: (day: Date) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  startDate,
  endDate,
  monthStart,
  events,
  onDayClick,
}) => {
  const rows = [];
  let day = startDate;
  while (day <= endDate) {
    const days = [];
    const weekStartDate = day;
    for (let i = 0; i < 7; i++) {
      const anDay = day;
      days.push(
        <DayCell
          key={anDay.toISOString()}
          day={anDay}
          monthStart={monthStart}
          events={events}
          onDayClick={() => onDayClick(anDay)}
        />
      );

      day = addDays(day, 1);
    }

    rows.push(
      <div className="grid grid-cols-7 " key={weekStartDate.toISOString()}>
        {days}
      </div>
    );
  }

  return <div>{rows}</div>;
};

export default CalendarGrid;
