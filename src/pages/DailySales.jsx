import DailySalesTable from "@/components/DailySalesTable";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CustomerDialog from "@/components/CustomerDialog";
import BankInDialog from "@/components/BankInDialog";
import useFetchDoc from "@/hooks/useFetchDoc";
import { getDayInfo, setDayInfo } from "@/services/apiFirebase";
import useSetDoc from "@/hooks/useSetDoc";
import { isObjectEmpty } from "@/util";
import ScrollToTopButton from "@/components/ScrollToTopButton";

// const totalSalesBeforeToday = 0;

function DailySales() {
  const { day } = useParams();
  const dateState = new Date(day);

  // TODO: fetch totalSalesBeforeToday
  // data: { todayCustomersInfo = {}, todayBankInInfo = {} } = {},

  const {
    data: {
      dayData: { todayCustomersInfo = {}, todayBankInInfo = {} } = {},
      monthlyTotalSalesData = {},
    } = {},
    isLoading: isFetchingLoading,
    error: isFetchingError,
    setData,
    setRefetch,
  } = useFetchDoc({ getDayInfo, day });

  const {
    mutate,
    isLoading: isSettingLoading,
    error: isSettingError,
  } = useSetDoc({
    mutationFn: setDayInfo,
    onSuccess: () => setRefetch((prev) => !prev),
  });

  let fetchAndSetStates = (
    <p className="invisible mt-1 text-center">
      Space for fetching and setting purpose
    </p>
  );

  if (isFetchingLoading) {
    fetchAndSetStates = <p className="mt-1 text-center">Fetching data...</p>;
  }
  if (isFetchingError) {
    fetchAndSetStates = (
      <p className="mt-1 text-center text-red-600">
        Something went wrong with fetching data
      </p>
    );
  }

  if (isSettingLoading) {
    fetchAndSetStates = <p className="mt-1 text-center">Setting data...</p>;
  }
  if (isSettingError) {
    fetchAndSetStates = (
      <p className="mt-1 text-center text-red-600">
        Something went wrong with setting data
      </p>
    );
  }

  let totalSalesBeforeToday;

  if (isObjectEmpty(monthlyTotalSalesData)) {
    totalSalesBeforeToday = 0;
  } else {
    totalSalesBeforeToday = Object.keys(monthlyTotalSalesData).reduce(
      (previous, current) => {
        const currentValue =
          parseFloat(current) < parseFloat(format(dateState, "d"))
            ? parseFloat(monthlyTotalSalesData[current])
            : 0;

        return previous + currentValue;
      },
      0,
    );
  }

  // const [todayCustomersInfo, setTodayCustomersInfo] = useState({});
  // const [todayBankInInfo, setTodayBankInInfo] = useState({});
  // console.log(todayCustomersInfo);
  // console.log(todayBankInInfo);

  const [editId, setEditId] = useState(null);

  const [openCustomerDialog, setOpenCustomerDialog] = useState(false);
  const [openBankInDialog, setOpenBankInDialog] = useState(false);

  const navigate = useNavigate();

  function handleOpenDialog(dialogType) {
    if (dialogType === "customer") {
      setOpenCustomerDialog(true);
    }

    if (dialogType === "bankIn") {
      setOpenBankInDialog(true);
    }
  }

  function handleCloseCustomerDialog() {
    setOpenCustomerDialog(false);
    setEditId(null);
  }

  function handleCustomerInfo(customerInfo) {
    // setTodayCustomersInfo((prevState) => {
    //   return {
    //     ...prevState,
    //     [customerInfo.id]: customerInfo,
    //   };
    // });

    setData((prevState) => {
      const { dayData: { todayCustomersInfo = {} } = {} } = prevState;
      const updatedTodayCustomersInfo = {
        ...todayCustomersInfo,
        [customerInfo.id]: customerInfo,
      };

      const newDayData = {
        ...prevState.dayData,
        todayCustomersInfo: updatedTodayCustomersInfo,
      };

      return {
        ...prevState,
        dayData: newDayData,
      };
    });

    // for testing
    // const customerMock = {
    //   card: "2176",
    //   cash: "",
    //   course: "1568",
    //   customerName: "lim pei chee",
    //   id: "lim-pei-chee",
    //   invNo: "I0120301",
    //   mp: "",
    //   productSales: "608",
    //   vip10: "",
    // };

    // setTodayCustomersInfo((prevState) => {
    //   return {
    //     ...prevState,
    //     [customerMock.id]: customerMock,
    //   };
    // });

    handleCloseCustomerDialog();
  }
  function handleBankInInfo(bankInInfo) {
    // setTodayBankInInfo((prevState) => {
    //   return {
    //     ...prevState,
    //     ...bankInInfo,
    //   };
    // });

    setData((prevState) => {
      const updatedTodayBankInInfo = bankInInfo;

      const newDayData = {
        ...prevState.dayData,
        todayBankInInfo: updatedTodayBankInInfo,
      };

      return {
        ...prevState,
        dayData: newDayData,
      };
    });

    // for testing
    // const bankInMock = {
    //   amount: ["168", "76"],
    //   bankType: ["mbb", "mbb"],
    // };

    // setTodayBankInInfo((prevState) => {
    //   return {
    //     ...prevState,
    //     ...bankInMock,
    //   };
    // });

    setOpenBankInDialog(false);
  }

  async function handleSaveData() {
    const formattedData = {
      todayCustomersInfo,
      todayBankInInfo,
    };

    formattedData.todayTotalSales = Object.values(todayCustomersInfo)
      .reduce((previous, current) => {
        return (
          previous +
          (parseFloat(current.cash) || 0) +
          (parseFloat(current.card) || 0) +
          (parseFloat(current.mp) || 0)
        );
      }, 0)
      .toFixed(2);

    const updatedTotalSales = {
      ...monthlyTotalSalesData,
      [format(dateState, "d")]: formattedData.todayTotalSales,
    };

    // console.log(formattedData);

    mutate(dateState, { formattedData, updatedTotalSales });
  }

  function deleteCustomer(id) {
    // setTodayCustomersInfo((prevState) => {
    //   const { [id]: _, ...filteredCustomers } = prevState;

    //   return filteredCustomers;
    // });

    setData((prevState) => {
      const { dayData: { todayCustomersInfo = {} } = {} } = prevState;

      const { [id]: _, ...filteredCustomers } = todayCustomersInfo;

      const newDayData = {
        ...prevState.dayData,
        todayCustomersInfo: filteredCustomers,
      };

      return {
        ...prevState,
        dayData: newDayData,
      };
    });
  }

  function backToCalendar() {
    if (
      window.confirm("Have you saved the data before going back to calendar?")
    ) {
      navigate(`/calendar/${day}`);
    }
  }

  return (
    <section>
      <h2 className="text-center text-2xl font-semibold sm:text-3xl lg:text-4xl">
        Daily Sales Report
      </h2>
      <div className="mt-3 flex flex-col gap-3 md:flex-row md:justify-between md:gap-0">
        <p className="text-center md:text-start lg:text-lg">
          CENTER: <span className="font-semibold underline">Sri Rampai</span>
        </p>
        <div>
          <p className="text-center lg:text-lg">
            <span className="ms-1 underline">{format(dateState, "d")}</span>D
            <span className="ms-1 underline">{format(dateState, "M")}</span>M
            <span className="ms-1 underline">{format(dateState, "y")}</span>Y
          </p>
          <div className="flex justify-center lg:text-lg">
            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day, i) => {
              const dayOfTheWeek = dateState.getDay();

              return (
                <p key={day} className="me-2">
                  <span
                    className={`${i === dayOfTheWeek ? "rounded-full border-2 border-primary" : ""}`}
                  >
                    {day}
                  </span>
                  <span>{`${i === 6 ? "" : "/"}`}</span>
                </p>
              );
            })}
          </div>
        </div>
        <div className="text-center md:text-end lg:text-lg">
          <p>
            TARGET TODAY: RM<span className="ms-1 underline"></span>
          </p>
          <p>
            TOTAL SALES B/F: RM
            <span className="ms-1 font-semibold underline">
              {totalSalesBeforeToday.toFixed(2)}
            </span>
          </p>
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center md:gap-4">
        <Button
          onClick={backToCalendar}
          className=" bg-yellow-400 text-yellow-900 hover:bg-yellow-400/90 lg:text-lg"
        >
          Go Back To Calendar
        </Button>
        <Button
          onClick={() => handleOpenDialog("customer")}
          className=" bg-sky-400 text-sky-900 hover:bg-sky-400/90 lg:text-lg"
        >
          Add New Customer
        </Button>
        <Button
          onClick={() => handleOpenDialog("bankIn")}
          className="lg:text-lg"
        >
          Add Bank In
        </Button>
        <Button
          onClick={handleSaveData}
          disabled={isSettingLoading}
          className=" bg-red-400 text-red-900 hover:bg-red-400/90 lg:text-lg"
        >
          Save Data
        </Button>
      </div>

      {fetchAndSetStates}

      <DailySalesTable
        todayCustomersInfo={todayCustomersInfo}
        deleteCustomer={deleteCustomer}
        setEditId={setEditId}
        totalSalesBeforeToday={totalSalesBeforeToday}
      />
      <CustomerDialog
        openDialog={openCustomerDialog || !!editId}
        closeCustomerDialog={handleCloseCustomerDialog}
        handleCustomerInfo={handleCustomerInfo}
        editCustomerInfo={todayCustomersInfo[editId]}
      />
      <BankInDialog
        openDialog={openBankInDialog}
        setOpenDialog={setOpenBankInDialog}
        handleBankInInfo={handleBankInInfo}
        bankInInfo={todayBankInInfo}
      />

      <ScrollToTopButton />
    </section>
  );
}

export default DailySales;
