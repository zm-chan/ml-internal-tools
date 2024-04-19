import { Button } from "@/components/ui/button";
import { add, format } from "date-fns";
import { useState } from "react";
import { LogOut, MoveRight } from "lucide-react";
import { MoveLeft } from "lucide-react";
import CalendarTable from "@/components/CalendarTable";
import { useNavigate, useParams } from "react-router-dom";
import useFetchDocs from "@/hooks/useFetchDocs";
import { getAllDaysInfo } from "@/services/apiFirebase";
import { extractBankIn, extractCustomers } from "@/util";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase";

function Calendar() {
  const { day } = useParams();
  const [currentDateState, setCurrentDateState] = useState(() => {
    if (day) {
      return new Date(day);
    } else {
      return new Date();
    }
  });

  const navigate = useNavigate();

  const dateString = currentDateState.toDateString();
  const formattedDate = format(currentDateState, "MMMM yyyy");

  const {
    data,
    isLoading: isFetchingLoading,
    error: isFetchingError,
  } = useFetchDocs({ getAllDaysInfo, dateString });

  const customersOfTheMonth = extractCustomers(data);
  const bankInOfTheMonth = extractBankIn(data);

  function calculateMonth(date, monthOperationValue) {
    return add(date, { months: monthOperationValue });
  }

  function updateMonth(updateMonthValue) {
    setCurrentDateState((previousDateState) => {
      return calculateMonth(previousDateState, updateMonthValue);
    });
  }

  let calendarTableContent = (
    <CalendarTable
      key={format(currentDateState, "MMM") + "-" + (data?.id || "initial")}
      currentDateState={currentDateState}
      customersOfTheMonth={customersOfTheMonth}
      bankInOfTheMonth={bankInOfTheMonth}
    />
  );

  if (isFetchingLoading || isFetchingError) {
    calendarTableContent = (
      <CalendarTable
        key={format(currentDateState, "MMM") + "-" + (data?.id || "initial")}
        currentDateState={currentDateState}
        customersOfTheMonth={false}
        bankInOfTheMonth={false}
      />
    );
  }

  function handleSignOut() {
    signOut(auth);
  }

  return (
    <section>
      <h2 className="text-center text-2xl font-semibold sm:text-3xl lg:text-4xl">
        {formattedDate}
      </h2>

      <Button
        variant="outline"
        onClick={handleSignOut}
        className="absolute right-3 top-1 flex h-7 items-center border-0 p-0 text-green-700 hover:bg-green-700 hover:text-white min-[480px]:gap-1 min-[480px]:border min-[480px]:border-green-700 min-[480px]:px-2 min-[480px]:shadow sm:right-3 sm:top-3 sm:gap-2 sm:px-3 sm:py-2 lg:h-10 lg:gap-3 lg:px-4 lg:py-2 lg:text-lg lg:shadow-md"
      >
        <span className="hidden min-[480px]:block">Sign Out</span>{" "}
        <LogOut className="min-[480px]:h-4 min-[480px]:w-4 lg:h-5 lg:w-5" />
      </Button>

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
        <Button
          onClick={() => navigate(`/cashaccount/${dateString}`)}
          className=" bg-yellow-400 text-yellow-900 hover:bg-yellow-400/90 lg:text-lg"
        >
          Cash Account
        </Button>
        <Button
          onClick={() => navigate(`/totalmonthlysales/${dateString}`)}
          className=" bg-sky-400 text-sky-900 hover:bg-sky-400/90 lg:text-lg"
        >
          Total Monthly Sales
        </Button>
        <Button
          onClick={() => navigate(`/customerattendance/${dateString}`)}
          className="lg:text-lg"
        >
          Customer Attendance
        </Button>
      </div>

      {isFetchingError ? (
        <p className="mt-1 text-center text-red-600">
          Error fetching data. Try to reload again.
        </p>
      ) : (
        <p className="invisible mt-1 text-center">Space for error purpose</p>
      )}

      {calendarTableContent}

      <ScrollToTopButton />
    </section>
  );
}

export default Calendar;
