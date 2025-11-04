import { format } from "date-fns";
import { useEffect, useState } from "react";
import AddEventModal from "../components/AddEventModel";

interface Event {
  date: string;
  title: string;
  time: string;
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

        <div className="flex flex-col items-end gap-3 flex-shrink-0">
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
