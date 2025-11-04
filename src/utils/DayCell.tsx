import React from "react";
import { format, isSameDay, isSameMonth } from "date-fns";

interface Event {
  date: string;
  title: string;
  time: string;
}

interface DayCellProps {
  day: Date;
  monthStart: Date;
  events: Event[];
  onDayClick: () => void;
}

const DayCell: React.FC<DayCellProps> = ({
  day,
  monthStart,
  events,
  onDayClick,
}) => {
  const dayEvents = events.filter((ev) => isSameDay(new Date(ev.date), day));
  const eventsToShow = dayEvents.slice(0, 2);
  const remainingEventsCount = dayEvents.length - eventsToShow.length;
  const isToday = isSameDay(day, new Date());
  const isCurrentMonth = isSameMonth(day, monthStart);

  return (
    <div
      onClick={onDayClick}
      className={`
        border-t border-neutral-200 p-3 h-40 relative group
        flex flex-col
        ${isCurrentMonth ? "cursor-pointer hover:bg-neutral-50" : "text-neutral-400"}
        ${isToday ? "bg-orange-50" : ""}
      `}
    >
      <span
        className={`text-lg font-semibold ${isToday ? "text-orange-600" : ""}`}
      >
        {format(day, "dd")}
      </span>

      <div className="mt-2 space-y-1 text-sm overflow-hidden">
        {eventsToShow.map((ev, i) => (
          <div
            key={i}
            className="bg-white p-2 shadow rounded border border-neutral-200"
          >
            <p className="font-medium truncate">{ev.title}</p>
          </div>
        ))}
      </div>
      {remainingEventsCount > 0 && (
        <div className="text-xs text-blue-600 font-semibold pt-1 hover:underline mt-auto">
          + {remainingEventsCount} more
        </div>
      )}
    </div>
  );
};

export default DayCell;
