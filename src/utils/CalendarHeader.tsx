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
  const [isFormatModalOpen, setIsFormatModalOpen] = useState(false);

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

        <div className="flex items-center gap-3 shrink-0">
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
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 hover:border-neutral-400 transition-colors text-sm font-medium cursor-pointer"
            >
              <svg
                className="w-4 h-4"
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
              Upload JSON
            </label>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 hover:border-neutral-400 transition-colors text-sm font-medium cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Event
          </button>

          <button
            type="button"
            onClick={() => setIsFormatModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 hover:border-neutral-400 transition-colors text-sm font-medium"
            title="Show JSON format guide"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Help
          </button>
        </div>
      </div>
      <AddEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddEvent={handleModalSubmit}
      />

      <JsonFormatModal
        isOpen={isFormatModalOpen}
        onClose={() => setIsFormatModalOpen(false)}
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
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Create New Event</h3>
          <p className="text-sm text-gray-500 mt-1">
            Fill in the details for your event
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
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
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20 transition-all"
              required
            />
          </div>
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
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20 transition-all"
              required
            />
          </div>
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
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20 transition-all"
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
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20 transition-all"
                required
              />
            </div>
          </div>
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
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border-2 border-gray-300 px-5 py-2.5 font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-black px-5 py-2.5 font-semibold text-white hover:bg-neutral-800 shadow-lg shadow-black/20 transition-all"
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface JsonFormatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function JsonFormatModal({ isOpen, onClose }: JsonFormatModalProps) {
  if (!isOpen) return null;
  const jsonString = `[
  {
    "date": "2025-11-03",
    "startTime": "09:00",
    "endTime": "10:00",
    "title": "Team Standup Meeting",
    "color": "#3B82F6"
  },

  {
    "date": "2025-11-05",
    "startTime": "11:30",
    "endTime": "12:15",
    "title": "Client Call - Project Atlas",
    "color": "#10B981"
  },
  {
    "date": "2025-11-10",
    "startTime": "16:00",
    "endTime": "17:00",
    "title": "Backend Bug Fixing Sprint",
    "color": "#EF4444"
  },
]
`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200">
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
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900">
            JSON Format Guide
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Your file must be an array of event objects, like this:
          </p>
        </div>
        <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto text-sm">
          {jsonString}
        </pre>
      </div>
    </div>
  );
}
