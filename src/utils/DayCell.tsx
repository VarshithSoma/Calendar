import React from "react";
import { format, isSameDay, isSameMonth, parse, isBefore } from "date-fns";

interface Event {
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  color: string;
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
  const now = new Date();
  const isEventPast = (event: Event) => {
    if (!isSameDay(new Date(event.date), now)) {
      return isBefore(new Date(event.date), now);
    }
    const endTime = parse(event.endTime, "HH:mm", new Date());
    const currentTime = parse(format(now, "HH:mm"), "HH:mm", new Date());
    return isBefore(endTime, currentTime);
  };

  const doEventsCollide = (event1: Event, event2: Event) => {
    if (!isSameDay(new Date(event1.date), new Date(event2.date))) {
      return false;
    }

    const start1 = parse(event1.startTime, "HH:mm", new Date());
    const end1 = parse(event1.endTime, "HH:mm", new Date());
    const start2 = parse(event2.startTime, "HH:mm", new Date());
    const end2 = parse(event2.endTime, "HH:mm", new Date());

    return (start1 < end2 && end1 > start2) || (start2 < end1 && end2 > start1);
  };
  const getEventCollisions = (event: Event) => {
    return dayEvents.filter(
      (otherEvent) => otherEvent !== event && doEventsCollide(event, otherEvent)
    );
  };
  const getLightColor = (hexColor: string) => {
    const hex = hexColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const lighten = (color: number) => Math.round(color + (255 - color) * 0.85);

    const newR = lighten(r);
    const newG = lighten(g);
    const newB = lighten(b);

    return `rgb(${newR}, ${newG}, ${newB})`;
  };
  const getBorderColor = (hexColor: string) => {
    const hex = hexColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `rgb(${r}, ${g}, ${b})`;
  };

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
        {eventsToShow.map((ev, i) => {
          const isPast = isEventPast(ev);
          const collisions = getEventCollisions(ev);
          const hasCollision = collisions.length > 0;

          return (
            <div
              key={i}
              className={`group p-2 rounded-md transition-all hover:shadow-sm relative ${
                hasCollision ? "ring-2 ring-red-400 ring-offset-1" : ""
              }`}
              style={{
                backgroundColor: hasCollision
                  ? "#fef2f2"
                  : isPast
                    ? "#f5f5f5"
                    : getLightColor(ev.color),
                borderLeft: `3px solid ${hasCollision ? "#ef4444" : getBorderColor(ev.color)}`,
                opacity: isPast ? 0.6 : 1,
              }}
            >
              {hasCollision && (
                <div
                  className="absolute -top-1.5 -right-1.5 bg-red-500 rounded-full p-1"
                  title="Time conflict!"
                >
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}

              <p className="font-bold leading-tight mb-0.5">
                <span
                  className={
                    isPast
                      ? "line-through decoration-2 text-neutral-500"
                      : "text-neutral-800"
                  }
                >
                  {ev.title}
                </span>
              </p>
              <p className="text-[11px] font-medium">
                <span
                  className={
                    isPast
                      ? "line-through decoration-2 text-neutral-400"
                      : "text-neutral-600"
                  }
                >
                  {ev.startTime} - {ev.endTime}
                </span>
              </p>
            </div>
          );
        })}
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
