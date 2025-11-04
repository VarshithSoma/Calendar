import { format } from "date-fns";
import { useEffect, useState } from "react";

interface Event {
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  color: string;
}

interface CalendarHeaderProps {
  currentDate: Date;
  onPrev: () => void;
  onNext: () => void;
  onDataUpdate: (newData: Event[]) => void;
  onManualAdd: (newEvent: Event) => void;
}

interface ArrowButtonProps {
  fun: () => void;
  text: string;
  aria_label: string;
}

export default function CalendarHeader({
  currentDate,
  onPrev,
  onNext,
  onDataUpdate,
  onManualAdd,
}: CalendarHeaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      if (file.type === "application/json") {
        setSelectedFile(file);
      } else {
        setSelectedFile(null);
        alert("Please select a valid .json file.");
      }
    }

    event.target.value = "";
  };

  useEffect(() => {
    if (!selectedFile) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const jsonData = JSON.parse(text) as Event[];
        onDataUpdate(jsonData);
      } catch (error) {
        console.log(error);
        alert("Error parsing JSON. Check file format.");
      }
    };

    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      alert("Failed to read the file.");
    };

    reader.readAsText(selectedFile);
  }, [selectedFile, onDataUpdate]);

  const handleModalSubmit = (newEvent: Event) => {
    onManualAdd(newEvent);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex items-start justify-between mb-6 gap-6">
        <div>
          <h2 className="text-3xl font-bold text-neutral-900 mb-1 flex gap-10">
            {format(currentDate, "MMM yyyy")}
            <div className="flex items-center gap-2">
              <ArrowButton fun={onPrev} text="←" aria_label="Previous month" />
              <ArrowButton fun={onNext} text="→" aria_label="Next month" />
            </div>
          </h2>

          <p className="text-base font-light text-neutral-500 max-w-lg mb-4">
            Here are all your planned events. You will find information for each
            event, and you can also plan new ones.
          </p>
        </div>

        <div className="flex flex-col items-end gap-3 shrink-0">
          <div className="relative inline-block">
            <input
              type="file"
              id="jsonFile"
              accept="application/json"
              className="hidden"
              onChange={handleFileChange}
            />
            <label
              htmlFor="jsonFile"
              className="bg-black text-white px-5 py-2.5 rounded-lg font-medium hover:bg-neutral-800 transition-colors cursor-pointer inline-flex items-center gap-2"
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
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <div>Choose JSON File</div>
            </label>
          </div>

          <div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
            >
              + Add Event Manually
            </button>
          </div>
        </div>
      </div>

      <AddEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddEvent={handleModalSubmit}
      />
    </>
  );
}

function ArrowButton({ fun, text, aria_label }: ArrowButtonProps) {
  return (
    <button
      onClick={fun}
      className="flex items-center justify-center p-2 h-10 w-10 rounded-md border border-neutral-300 text-lg hover:bg-neutral-100 active:bg-neutral-200 transition-colors"
      aria-label={aria_label}
    >
      {text}
    </button>
  );
}

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEvent: (newEvent: Event) => void;
}

function AddEventModal({ isOpen, onClose, onAddEvent }: AddEventModalProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [color, setColor] = useState("#3b82f6");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !date || !startTime || !endTime) {
      alert("Please fill out all fields.");
      return;
    }

    onAddEvent({ title, date, startTime, endTime, color });

    setTitle("");
    setDate("");
    setStartTime("");
    setEndTime("");
    setColor("#3b82f6");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
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

        {/* Header */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Create New Event</h3>
          <p className="text-sm text-gray-500 mt-1">
            Fill in the details for your event
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title Field */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Event Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Team Meeting"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              required
            />
          </div>

          {/* Date Field */}
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              required
            />
          </div>

          {/* Time Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="startTime"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Start Time
              </label>
              <input
                type="time"
                id="startTime"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                required
              />
            </div>

            <div>
              <label
                htmlFor="endTime"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                End Time
              </label>
              <input
                type="time"
                id="endTime"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                required
              />
            </div>
          </div>

          {/* Color Picker */}
          <div>
            <label
              htmlFor="color"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Event Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                id="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-12 w-20 rounded-lg border border-gray-300 cursor-pointer"
                required
              />
              <span className="text-sm text-gray-600 font-mono">{color}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg bg-gray-100 px-5 py-2.5 font-semibold text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2.5 font-semibold text-white hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30 transition-all"
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
