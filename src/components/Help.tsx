interface JsonFormatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JsonFormatModal({
  isOpen,
  onClose,
}: JsonFormatModalProps) {
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
