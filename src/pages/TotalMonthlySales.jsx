import TotalMonthlySalesTable from "@/components/TotalMonthlySalesTable";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import useFetchDocs from "@/hooks/useFetchDocs";
import { getAllDaysInfo } from "@/services/apiFirebase";
import { getDaysInMonth } from "date-fns";
import { isObjectEmpty } from "@/util";
import ScrollToTopButton from "@/components/ScrollToTopButton";

function TotalMonthlySales() {
  const { day } = useParams();
  const dateState = new Date(day);
  const numberOfDaysInTheMonth = getDaysInMonth(dateState);

  const navigate = useNavigate();

  const {
    data,
    isLoading: isFetchingLoading,
    error: isFetchingError,
  } = useFetchDocs({ getAllDaysInfo, dateString: day });

  let content = null;

  if (isFetchingLoading) {
    content = <p className="my-3 text-center lg:text-lg">Fetching data...</p>;
  }
  if (isFetchingError) {
    content = (
      <p className="my-3 text-center text-red-600 lg:text-lg">
        Something went wrong with fetching data
      </p>
    );
  }

  if (!isObjectEmpty(data)) {
    content = (
      <TotalMonthlySalesTable
        monthData={data}
        numberOfDaysInTheMonth={numberOfDaysInTheMonth}
      />
    );
  }

  return (
    <section>
      <h2 className="text-center text-2xl font-semibold sm:text-3xl lg:text-4xl">
        Total Monthly Sales
      </h2>
      <div className="mt-5 flex flex-col sm:flex-row sm:justify-center">
        <Button
          onClick={() => navigate(`/calendar/${day}`)}
          className=" bg-yellow-400 text-yellow-900 hover:bg-yellow-400/90 lg:text-lg"
        >
          Go Back To Calendar
        </Button>
      </div>
      {content}

      <ScrollToTopButton />
    </section>
  );
}

export default TotalMonthlySales;
