import React from "react";
import { format } from "date-fns";
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
  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <div className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white w-full max-w-md rounded-xl shadow-lg">
        <div className="p-5">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800">
              Events on {format(day, "MMM dd, yyyy")}
            </h3>

            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 text-2xl leading-none"
              aria-label="Close modal"
            >
              &times;
            </button>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {events.length ? (
              events.map((ev, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg p-3 shadow-sm border-l-4"
                  style={{ borderLeftColor: ev.color }}
                >
                  <p className="font-medium text-gray-900">{ev.title}</p>

                  <p className="text-sm text-gray-600">
                    {ev.startTime} - {ev.endTime}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No events for this day.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EventModal;
