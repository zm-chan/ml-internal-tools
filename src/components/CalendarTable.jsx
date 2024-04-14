import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";

import { useNavigate } from "react-router-dom";

function CalendarTable({ currentDateState }) {
  const navigate = useNavigate();

  function handleSelectDay(day, notSameMonth) {
    if (notSameMonth) {
      return;
    }
    navigate(`/dailysales/${day.toDateString()}`);
  }

  function renderDays() {
    const days = [];
    let startDate = startOfWeek(startOfMonth(currentDateState));

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center text-2xl font-bold text-teal-700">
          {format(addDays(startDate, i), "EEE")}
        </div>,
      );
    }

    return <div className="mb-3 hidden xl:grid xl:grid-cols-7">{days}</div>;
  }

  function renderCells() {
    const monthStart = startOfMonth(currentDateState);
    const monthEnd = endOfMonth(currentDateState);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = [];
    let day = startDate;

    while (day <= endDate) {
      const displayDate = format(day, "d");
      const displayDay = format(day, "EEE");

      const cloneDay = day;

      const notSameMonth = !isSameMonth(day, monthStart);

      days.push(
        <div
          key={day}
          className={`min-h-48 space-x-3 rounded-sm bg-white text-xl font-bold  sm:space-x-2 ${notSameMonth ? "text-gray-300" : "text-teal-700"}`}
          onClick={() => handleSelectDay(cloneDay, notSameMonth)}
        >
          <span className="xl:hidden">{displayDay}</span>
          <span>{displayDate}</span>
        </div>,
      );

      day = addDays(day, 1);
    }

    return (
      <div className="grid gap-y-4 min-[480px]:grid-cols-2 min-[480px]:gap-x-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 xl:gap-x-3">
        {days}
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-md bg-primary/30 p-4">
      {renderDays()}
      {renderCells()}
    </div>
  );
}

export default CalendarTable;
