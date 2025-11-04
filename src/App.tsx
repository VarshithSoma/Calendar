import "./App.css";
import Calendar from "./components/Calendar";
// import Header from "./components/Header";

function App() {
  return (
    <div className="flex h-screen w-full">
      {/* <Header /> */}
      <div className="flex-1 flex flex-col overflow-auto bg-neutral-50">
        <div className="p-0">
          <Calendar></Calendar>
        </div>
      </div>
    </div>
  );
}

export default App;
