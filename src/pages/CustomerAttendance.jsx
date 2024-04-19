import ScrollToTopButton from "@/components/ScrollToTopButton";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { isObjectEmpty } from "@/util";
import useFetchDocs from "@/hooks/useFetchDocs";
import { getAllDaysInfo } from "@/services/apiFirebase";
import CustomerAttendanceTable from "@/components/CustomerAttendanceTable";

function CustomerAttendance() {
  const { day } = useParams();

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
    content = <CustomerAttendanceTable monthData={data} day={day} />;
  }

  return (
    <section>
      <h2 className="text-center text-2xl font-semibold sm:text-3xl lg:text-4xl">
        Customer Attendance
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

export default CustomerAttendance;
