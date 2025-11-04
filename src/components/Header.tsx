export default function Header() {
  const menu = [{ label: "Calendar" }, { label: "Tasks" }];

  return (
    <div className="h-screen border-gray-300  flex flex-col transition-all duration-300">
      <div className="flex flex-col mt-5 space-y-2">
        {menu.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-4 cursor-pointer px-4 py-3 hover:bg-neutral-100
            transition rounded-lg"
          >
            <span className="text-sm font-bold p-10">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
