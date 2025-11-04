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
      className={`p-4 min-h-[180px] relative flex flex-col font-sans
        ${isCurrentMonth ? "cursor-pointer hover:bg-neutral-50" : "bg-neutral-50/30"}
        ${isToday ? "bg-orange-50/40" : "bg-white"}
      `}
    >
      <div
        className={`h-0.5 w-full mb-2.5 ${isToday ? "bg-orange-500" : "bg-neutral-300"}`}
      />

      <div
        className={`text-3xl font-bold mb-3
          ${isToday ? "text-orange-500" : isCurrentMonth ? "text-neutral-800" : "text-neutral-400"}
        `}
      >
        {format(day, "dd")}
      </div>

      <div className="flex-1 space-y-2.5 text-xs">
        {eventsToShow.map((ev, i) => (
          <div key={i} className="group">
            <p
              className={`font-semibold leading-tight mb-0.5 ${
                isCurrentMonth ? "text-neutral-700" : "text-neutral-500"
              }`}
            >
              {ev.title}
            </p>
            <p className="text-neutral-500 text-[11px]">{ev.time}</p>
          </div>
        ))}
      </div>

      {remainingEventsCount > 0 && (
        <div className="mt-2.5 pt-1.5">
          <button className="text-[11px] font-semibold text-neutral-600 hover:text-neutral-800 underline">
            And {remainingEventsCount} more
          </button>
        </div>
      )}
    </div>
  );
};

export default DayCell;
