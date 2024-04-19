import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

function TotalMonthlySalesTable({ monthData, numberOfDaysInTheMonth }) {
  function calculateDayData(dayData) {
    const { todayCustomersInfo } = dayData;

    return Object.values(todayCustomersInfo).reduce(
      (previous, current) => {
        previous.totalProduct = (
          parseFloat(previous.totalProduct) +
          (parseFloat(current.productSales) || 0)
        ).toFixed(2);
        previous.totalCourse = (
          parseFloat(previous.totalCourse) + (parseFloat(current.course) || 0)
        ).toFixed(2);
        previous.totalOfTheDay = (
          parseFloat(previous.totalProduct) + parseFloat(previous.totalCourse)
        ).toFixed(2);
        previous.totalCash = (
          parseFloat(previous.totalCash) + (parseFloat(current.cash) || 0)
        ).toFixed(2);
        previous.totalCard = (
          parseFloat(previous.totalCard) + (parseFloat(current.card) || 0)
        ).toFixed(2);
        previous.totalMP = (
          parseFloat(previous.totalMP) + (parseFloat(current.mp) || 0)
        ).toFixed(2);

        if (current.vip10.includes("cash")) {
          previous.totalVIPCash = (
            parseFloat(previous.totalVIPCash) + (parseFloat(current.vip10) || 0)
          ).toFixed(2);
        } else {
          previous.totalVIPCash = parseFloat(previous.totalVIPCash).toFixed(2);
        }
        if (current.vip10.includes("card")) {
          previous.totalVIPCard = (
            parseFloat(previous.totalVIPCard) + (parseFloat(current.vip10) || 0)
          ).toFixed(2);
        } else {
          previous.totalVIPCard = parseFloat(previous.totalVIPCard).toFixed(2);
        }

        return { ...previous };
      },
      {
        totalProduct: (0).toFixed(2),
        totalCourse: (0).toFixed(2),
        totalOfTheDay: (0).toFixed(2),
        totalCash: (0).toFixed(2),
        totalCard: (0).toFixed(2),
        totalMP: (0).toFixed(2),
        totalVIPCash: (0).toFixed(2),
        totalVIPCard: (0).toFixed(2),
      },
    );
  }

  function calculateGrandTotal(monthData) {
    const monthCalculations = Object.keys(monthData).reduce(
      (previous, current) => {
        if (
          current === "totalSalesForEachDay" ||
          current === "id" ||
          current === "previousCashBalance"
        ) {
          return { ...previous };
        }

        const dayCalculations = calculateDayData(monthData[current]);

        previous.grandTotalProduct = (
          parseFloat(previous.grandTotalProduct) +
          parseFloat(dayCalculations.totalProduct)
        ).toFixed(2);
        previous.grandTotalCourse = (
          parseFloat(previous.grandTotalCourse) +
          parseFloat(dayCalculations.totalCourse)
        ).toFixed(2);
        previous.grandTotalOfTheDay = (
          parseFloat(previous.grandTotalProduct) +
          parseFloat(previous.grandTotalCourse)
        ).toFixed(2);
        previous.grandTotalCash = (
          parseFloat(previous.grandTotalCash) +
          parseFloat(dayCalculations.totalCash)
        ).toFixed(2);
        previous.grandTotalCard = (
          parseFloat(previous.grandTotalCard) +
          parseFloat(dayCalculations.totalCard)
        ).toFixed(2);
        previous.grandTotalMP = (
          parseFloat(previous.grandTotalMP) +
          parseFloat(dayCalculations.totalMP)
        ).toFixed(2);

        previous.grandTotalVIPCash = (
          parseFloat(previous.grandTotalVIPCash) +
          parseFloat(dayCalculations.totalVIPCash)
        ).toFixed(2);

        previous.grandTotalVIPCard = (
          parseFloat(previous.grandTotalVIPCard) +
          parseFloat(dayCalculations.totalVIPCard)
        ).toFixed(2);

        return { ...previous };
      },
      {
        grandTotalProduct: 0,
        grandTotalCourse: 0,
        grandTotalOfTheDay: 0,
        grandTotalCash: 0,
        grandTotalCard: 0,
        grandTotalMP: 0,
        grandTotalVIPCash: 0,
        grandTotalVIPCard: 0,
      },
    );

    return [
      "grandTotalProduct",
      "grandTotalCourse",
      "grandTotalOfTheDay",
      "grandTotalCash",
      "grandTotalCard",
      "grandTotalMP",
      "grandTotalVIPCash",
      "grandTotalVIPCard",
    ].map((key) => {
      return (
        <TableCell
          key={key}
          className={`${parseFloat(monthCalculations[key]) > 0 && "bg-green-300 text-green-700"}`}
        >
          {monthCalculations[key]}
        </TableCell>
      );
    });
  }

  return (
    <Table className="my-3 lg:text-lg">
      <TableHeader>
        <TableRow className="border-t">
          <TableHead colSpan={7} className="text-center"></TableHead>
          <TableHead colSpan={2} className="text-center">
            VIP
          </TableHead>
        </TableRow>
        <TableRow>
          <TableHead className="text-center">DATE</TableHead>
          <TableHead className="text-center">PRODUCT</TableHead>
          <TableHead className="text-center">COURSE</TableHead>
          <TableHead className="text-center">TOTAL</TableHead>
          <TableHead className="text-center">CASH</TableHead>
          <TableHead className="text-center">CARD</TableHead>
          <TableHead className="text-center">M.POINT(EW)</TableHead>
          <TableHead className="text-center">CASH</TableHead>
          <TableHead className="text-center">CARD</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="text-center">
        {Array.from({ length: numberOfDaysInTheMonth }, (_, i) => i + 1).map(
          (element) => {
            if (monthData[element]) {
              const {
                totalProduct,
                totalCourse,
                totalOfTheDay,
                totalCash,
                totalCard,
                totalMP,
                totalVIPCash,
                totalVIPCard,
              } = calculateDayData(monthData[element]);

              return (
                <TableRow key={`${numberOfDaysInTheMonth}_${element}`}>
                  <TableCell className="font-medium">{element}</TableCell>
                  <TableCell
                    className={`${parseFloat(totalProduct) > 0 && "bg-green-300 text-green-700"}`}
                  >
                    {totalProduct}
                  </TableCell>
                  <TableCell
                    className={`${parseFloat(totalCourse) > 0 && "bg-green-300 text-green-700"}`}
                  >
                    {totalCourse}
                  </TableCell>
                  <TableCell
                    className={`${parseFloat(totalOfTheDay) > 0 && "bg-green-300 text-green-700"}`}
                  >
                    {totalOfTheDay}
                  </TableCell>
                  <TableCell
                    className={`${parseFloat(totalCash) > 0 && "bg-green-300 text-green-700"}`}
                  >
                    {totalCash}
                  </TableCell>
                  <TableCell
                    className={`${parseFloat(totalCard) > 0 && "bg-green-300 text-green-700"}`}
                  >
                    {totalCard}
                  </TableCell>
                  <TableCell
                    className={`${parseFloat(totalMP) > 0 && "bg-green-300 text-green-700"}`}
                  >
                    {totalMP}
                  </TableCell>
                  <TableCell
                    className={`${parseFloat(totalVIPCash) > 0 && "bg-green-300 text-green-700"}`}
                  >
                    {totalVIPCash}
                  </TableCell>
                  <TableCell
                    className={`${parseFloat(totalVIPCard) > 0 && "bg-green-300 text-green-700"}`}
                  >
                    {totalVIPCard}
                  </TableCell>
                </TableRow>
              );
            }

            return (
              <TableRow key={`${numberOfDaysInTheMonth}_${element}`}>
                <TableCell className="font-medium">{element}</TableCell>
                <TableCell>0.00</TableCell>
                <TableCell>0.00</TableCell>
                <TableCell>0.00</TableCell>
                <TableCell>0.00</TableCell>
                <TableCell>0.00</TableCell>
                <TableCell>0.00</TableCell>
                <TableCell>0.00</TableCell>
                <TableCell>0.00</TableCell>
              </TableRow>
            );
          },
        )}
      </TableBody>
      <TableFooter className="bg-transparent text-center [&>tr]:last:border-b">
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>GST(EW)</TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>G. Total</TableCell>
          {calculateGrandTotal(monthData)}
        </TableRow>
      </TableFooter>
    </Table>
  );
}

export default TotalMonthlySalesTable;
