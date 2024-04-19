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

function CalendarTable({
  currentDateState,
  customersOfTheMonth,
  bankInOfTheMonth,
}) {
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
          onClick={() => handleSelectDay(cloneDay, notSameMonth)}
          className="flex min-h-48 flex-col justify-between rounded-sm bg-white"
        >
          <div className="flex items-center justify-between p-3">
            <p
              className={`space-x-3 text-xl font-bold  sm:space-x-2 ${notSameMonth ? "text-gray-300" : "text-teal-700"}`}
            >
              <span className="xl:hidden">{displayDay}</span>
              <span>{displayDate}</span>
            </p>
            {bankInOfTheMonth &&
              bankInOfTheMonth[displayDate] &&
              !notSameMonth && (
                <p className="rounded bg-amber-300 px-2 py-1 text-amber-700">
                  Bank In
                </p>
              )}
          </div>

          {customersOfTheMonth &&
            customersOfTheMonth[displayDate] &&
            !notSameMonth && (
              <div className="space-y-2 p-3">
                {customersOfTheMonth[displayDate].map((customersOfTheDay) => {
                  return (
                    <div
                      key={customersOfTheDay.split(" ").join("-")}
                      className="rounded bg-sky-300 py-1 text-center text-sky-700 lg:text-lg"
                    >
                      {customersOfTheDay}
                    </div>
                  );
                })}
              </div>
            )}
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
    <div className="mt-6 rounded-md bg-primary/30 p-4 md:mt-4">
      {renderDays()}
      {renderCells()}
    </div>
  );
}

export default CalendarTable;
