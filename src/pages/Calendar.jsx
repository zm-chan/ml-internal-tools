import { Button } from "@/components/ui/button";
import { add, format } from "date-fns";
import { useState } from "react";
import { MoveRight } from "lucide-react";
import { MoveLeft } from "lucide-react";
import CalendarTable from "@/components/CalendarTable";
import { useParams } from "react-router-dom";

function Calendar() {
  const { day } = useParams();
  const [currentDateState, setCurrentDateState] = useState(() => {
    if (day) {
      return new Date(day);
    } else {
      return new Date();
    }
  });
  const formattedDate = format(currentDateState, "MMMM yyyy");

  function calculateMonth(date, monthOperationValue) {
    return add(date, { months: monthOperationValue });
  }

  function updateMonth(updateMonthValue) {
    if (window.confirm("Have you saved the data before changing month?")) {
      setCurrentDateState((previousDateState) => {
        return calculateMonth(previousDateState, updateMonthValue);
      });
    }
  }

  return (
    <section>
      <h2 className="text-center text-2xl font-semibold sm:text-3xl lg:text-4xl">
        {formattedDate}
      </h2>
      <div className="mt-4 flex justify-center gap-8">
        <Button
          variant="outline"
          onClick={() => updateMonth(-1)}
          className="flex items-center gap-2 border border-cyan-500 leading-none text-cyan-500 hover:bg-cyan-500 hover:text-cyan-100 lg:text-lg"
        >
          <MoveLeft />
          {format(calculateMonth(currentDateState, -1), "MMMM")}
        </Button>
        <Button
          variant="outline"
          onClick={() => updateMonth(+1)}
          className="flex items-center gap-2 border border-cyan-500 leading-none text-cyan-500 hover:bg-cyan-500 hover:text-cyan-100 lg:text-lg"
        >
          {format(calculateMonth(currentDateState, +1), "MMMM")}
          <MoveRight />
        </Button>
      </div>
      <div className="mt-4 flex flex-col justify-center gap-2 sm:flex-row lg:gap-4">
        <Button className=" bg-yellow-400 text-yellow-900 hover:bg-yellow-400/90 lg:text-lg">
          Cash Account
        </Button>
        <Button className=" bg-sky-400 text-sky-900 hover:bg-sky-400/90 lg:text-lg">
          Total Monthly Sales
        </Button>
        <Button className="lg:text-lg">Customer Attendance</Button>
      </div>
      <CalendarTable currentDateState={currentDateState} />
    </section>
  );
}

export default Calendar;
