import { useNavigate, useParams } from "react-router-dom";
import useFetchDocs from "@/hooks/useFetchDocs";
import { getAllDaysInfo, setPreviousCashBalance } from "@/services/apiFirebase";
import { Button } from "@/components/ui/button";
import CashAccountTable from "@/components/CashAccountTable";
import { isObjectEmpty } from "@/util";
import { useState } from "react";
import CashBalanceDialog from "@/components/CashBalanceDialog";
import { set } from "date-fns";
import useSetDoc from "@/hooks/useSetDoc";
import ScrollToTopButton from "@/components/ScrollToTopButton";

// const previousCashBalance = 0;

function CashAccount() {
  const { day } = useParams();

  const navigate = useNavigate();

  const {
    data,
    isLoading: isFetchingLoading,
    error: isFetchingError,
    setData,
    setRefetch,
  } = useFetchDocs({ getAllDaysInfo, dateString: day });

  const {
    mutate,
    isLoading: isSettingLoading,
    error: isSettingError,
  } = useSetDoc({
    mutationFn: setPreviousCashBalance,
    onSuccess: () => setRefetch((prev) => !prev),
  });

  const [openCashBalanceDialog, setOpenCashBalanceDialog] = useState(false);

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
      <CashAccountTable
        monthData={data}
        previousCashBalance={data?.previousCashBalance?.amount || 0}
        day={day}
      />
    );
  }

  let settingState = (
    <p className="invisible mt-1 text-center">
      Space for fetching and setting purpose
    </p>
  );

  if (isSettingLoading) {
    settingState = <p className="mt-1 text-center">Setting data...</p>;
  }
  if (isSettingError) {
    settingState = (
      <p className="mt-1 text-center text-red-600">
        Something went wrong with setting data
      </p>
    );
  }

  function handleCashBalanceInfo(cashBalanceAmount) {
    setData((prevState) => {
      return {
        ...prevState,
        previousCashBalance: {
          amount: cashBalanceAmount,
        },
      };
    });

    setOpenCashBalanceDialog(false);
  }

  async function handleSaveData() {
    // console.log(data?.previousCashBalance?.amount || 0);
    mutate(day, { amount: data?.previousCashBalance?.amount || 0 });
  }

  return (
    <section>
      <h2 className="text-center text-2xl font-semibold sm:text-3xl lg:text-4xl">
        Cash Account
      </h2>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center md:gap-4">
        <Button
          onClick={() => navigate(`/calendar/${day}`)}
          className=" bg-yellow-400 text-yellow-900 hover:bg-yellow-400/90 lg:text-lg"
        >
          Go Back To Calendar
        </Button>
        <Button
          onClick={() => setOpenCashBalanceDialog(true)}
          className="lg:text-lg"
        >
          Add Previous Cash Balance
        </Button>
        <Button
          onClick={handleSaveData}
          className=" bg-red-400 text-red-900 hover:bg-red-400/90 lg:text-lg"
        >
          Save Data
        </Button>
      </div>

      {settingState}

      {content}

      <CashBalanceDialog
        openDialog={openCashBalanceDialog}
        setOpenDialog={setOpenCashBalanceDialog}
        handleCashBalanceInfo={handleCashBalanceInfo}
        previousCashBalance={data?.previousCashBalance?.amount || 0}
      />

      <ScrollToTopButton />
    </section>
  );
}

export default CashAccount;
