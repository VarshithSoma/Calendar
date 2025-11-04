import { format } from "date-fns";
import { useEffect, useState } from "react";
import isValidEventArray from "./checkFunction";
import JsonFormatModal from "../components/Help";
import AddEventModal from "../components/InputHandler";

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
      let jsonData: unknown;
      try {
        const text = event.target?.result as string;
        jsonData = JSON.parse(text);
      } catch (error) {
        console.log(error);
        alert(
          "Error parsing JSON. The file seems to be malformed or corrupted."
        );
        return;
      }
      if (isValidEventArray(jsonData)) {
        onDataUpdate(jsonData);
      } else {
        console.error(
          "JSON validation failed. Data does not match Event format.",
          jsonData
        );
        alert(
          "JSON data is not in the correct format. \n\n" +
            "Please ensure it is an array of objects, and each object has: \n" +
            "• date (string)\n" +
            "• startTime (string)\n" +
            "• endTime (string)\n" +
            "• title (string)\n" +
            "• color (string)"
        );
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
