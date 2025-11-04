import { format } from "date-fns";
import { useEffect, useState } from "react";
interface CalendarHeaderProps {
  currentDate: Date;
  onPrev: () => void;
  onNext: () => void;
  onDataUpdate: (newData: Event[]) => void;
}
interface NextBtn {
  fun: () => void;
  text: string;
  aria_label: string;
}

export default function CalendarHeader({
  currentDate,
  onPrev,
  onNext,
  onDataUpdate,
}: CalendarHeaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type === "application/json") {
        setSelectedFile(file);
        console.log("File selected:", file.name);
      } else {
        setSelectedFile(null);
        alert("Please select a valid .json file.");
      }
    }
  };

  useEffect(() => {
    if (selectedFile) {
      console.log("Processing file:", selectedFile.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const textContent = event.target?.result as string;
        try {
          const jsonData = JSON.parse(textContent);
          console.log(jsonData);
          onDataUpdate(jsonData);
        } catch (error) {
          console.log(error);
        }
      };
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        alert("Failed to read the file.");
      };
      reader.readAsText(selectedFile);
    }
  }, [selectedFile]);
  return (
    <div className="flex items-start justify-between mb-6 gap-6">
      <div>
        <h2 className="text-3xl font-bold text-neutral-900 mb-1 flex gap-10">
          {format(currentDate, "MMM yyyy")}
          <div className="flex items-center gap-2">
            <ArrowButton
              fun={onPrev}
              text=" &larr;"
              aria_label="Previous month"
            ></ArrowButton>
            <ArrowButton
              fun={onNext}
              text="&rarr;"
              aria_label="Next month"
            ></ArrowButton>
          </div>
        </h2>
        <p className="text-base font-light text-neutral-500 max-w-lg mb-4">
          Here are all your planned events. You will find information for each
          event, and you can also plan new ones.
        </p>
      </div>

      <div>
        <input
          type="file"
          id="jsonFile"
          accept="application/json"
          className="bg-black text-white px-5 py-2.5 rounded-lg font-medium hover:bg-neutral-800 transition-colors flex-shrink-0"
          onChange={handleFileChange} // <-- ADDED THIS
        ></input>
      </div>
    </div>
  );
}
function ArrowButton({ fun, text, aria_label }: NextBtn) {
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
