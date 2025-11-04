import React from "react";
import { format, parse, isBefore, isSameDay } from "date-fns";

interface Event {
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  color: string;
}

interface EventProps {
  day: Date;
  events: Event[];
  onClose: () => void;
}

const EventModal: React.FC<EventProps> = ({ day, events, onClose }) => {
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

  const getEventCollisions = (event: Event, allEvents: Event[]) => {
    return allEvents.filter(
      (otherEvent) => otherEvent !== event && doEventsCollide(event, otherEvent)
    );
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 "
        onClick={onClose}
      />
      <div className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white w-full max-w-md rounded-xl shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              Events on {format(day, "MMM dd, yyyy")}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
              aria-label="Close modal"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {events.length ? (
              events.map((ev, idx) => {
                const isPast = isEventPast(ev);
                const collisions = getEventCollisions(ev, events);
                const hasCollision = collisions.length > 0;

                return (
                  <div
                    key={idx}
                    className={`border rounded-lg mt-5 p-4 shadow-sm transition-all relative ${
                      hasCollision
                        ? "border-red-300 bg-red-50 ring-2 ring-red-400 ring-offset-2"
                        : "border-gray-200 bg-white hover:shadow-md"
                    }`}
                    style={{
                      borderLeftWidth: "4px",
                      borderLeftColor: hasCollision ? "#ef4444" : ev.color,
                      opacity: isPast ? 0.6 : 1,
                    }}
                  >
                    {hasCollision && (
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Conflict
                      </div>
                    )}

                    <p
                      className={`font-bold text-base mb-2 ${isPast ? "line-through decoration-2 text-gray-500" : "text-gray-900"}`}
                    >
                      {ev.title}
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p
                        className={`${isPast ? "line-through decoration-2 text-gray-400" : "text-gray-600"}`}
                      >
                        {ev.startTime} - {ev.endTime}
                      </p>
                    </div>

                    {hasCollision && (
                      <div className="mt-3 pt-3 border-t border-red-200">
                        <p className="text-xs font-semibold text-red-700 mb-1">
                          ⚠️ Conflicts with:{" "}
                        </p>
                        {collisions.map((conflictEvent, i) => (
                          <p key={i} className="text-xs text-red-600 ml-4">
                            • {conflictEvent.title} ({conflictEvent.startTime} -{" "}
                            {conflictEvent.endTime})
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <svg
                  className="w-16 h-16 text-gray-300 mx-auto mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-gray-500 font-medium">
                  No events for this day.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EventModal;
