import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { isObjectEmpty } from "@/util";
import { Fragment } from "react";

const cardJSX = <span className="text-red-700">(C)</span>;

function CashAccountTable({ monthData, previousCashBalance, day }) {
  const dateState = new Date(day);
  const month = format(dateState, "M");
  const year = format(dateState, "yyyy");

  function mapDataToTable(monthData, componentPreviousCashBalance) {
    const { id, totalSalesForEachDay, previousCashBalance, ...realMonthData } =
      monthData;

    const setTemporaryKeyToEachDay = Object.keys(realMonthData).map(
      (dayKey) => {
        // For sorting purpose
        realMonthData[dayKey].temporaryKey = parseFloat(dayKey);
        return { ...realMonthData[dayKey] };
      },
    );

    // console.log(setTemporaryKeyToEachDay);

    const daysWithTransaction = setTemporaryKeyToEachDay.filter((dayData) => {
      return (
        parseFloat(dayData.todayTotalSales) > 0 ||
        !isObjectEmpty(dayData.todayBankInInfo)
      );
    });

    // console.log(daysWithTransaction);

    const sortDaysWithSales = daysWithTransaction.sort(
      (a, b) => a.temporaryKey - b.temporaryKey,
    );

    // console.log(sortDaysWithSales);

    let temporaryCashBalance = componentPreviousCashBalance;

    const daysWithSalesJSX = sortDaysWithSales.map((dayData) => {
      const { todayCustomersInfo, todayBankInInfo } = dayData;

      // Only bank in, no customers payment
      if (
        isObjectEmpty(todayCustomersInfo) &&
        !isObjectEmpty(todayBankInInfo)
      ) {
        return (
          <Fragment key={`${dayData.temporaryKey}_${month}_${year}`}>
            <TableRow>
              <TableCell className="font-semibold">{`${dayData.temporaryKey}/${month}/${year}`}</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell className="border-y border-red-500"></TableCell>
              <TableCell className="border-y border-red-500"></TableCell>
              <TableCell className="border-y border-red-500"></TableCell>
              <TableCell className="border-y border-red-500"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell className="text-red-700">Bal</TableCell>
              <TableCell className="text-red-700">
                RM {temporaryCashBalance.toFixed(2)}
              </TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
            {todayBankInInfo.bankType.map((bank, i) => {
              temporaryCashBalance -= parseFloat(todayBankInInfo.amount[i]);

              return (
                <TableRow
                  key={`${dayData.temporaryKey}_${month}_${year}_${bank}_${i}`}
                >
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell>{`${dayData.temporaryKey}/${month}/${year} ${bank}`}</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>
                    RM {`${todayBankInInfo.amount[i].toFixed(2)}`}
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              );
            })}
            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell className="border-t border-red-500 text-red-700">
                RM {temporaryCashBalance.toFixed(2)}
              </TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <span className="invisible">For table consistency</span>
              </TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell className="border-t border-red-500"></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </Fragment>
        );
      }

      // When there's customer payment

      // Remove those customers without payment but others did
      const customersWithPaymentOnThatDay = Object.values(
        todayCustomersInfo,
      ).filter((customer) => {
        return (
          !!parseFloat(customer.card) ||
          !!parseFloat(customer.cash) ||
          !!parseFloat(customer.mp)
        );
      });

      // Customers with payment

      let temporaryVIP10CardTotal = 0;
      let temporaryVIP10CashTotal = 0;
      let temporaryProductsTotal = 0;
      let temporaryCourseTotal = 0;
      let temporaryCardTotal = 0;
      let temporaryCashTotal = 0;
      let temporaryMPTotal = 0;
      let temporaryCardCashMPTotal = 0;

      const customerPaymentJSX = customersWithPaymentOnThatDay.map(
        (customer, i) => {
          temporaryProductsTotal += parseFloat(customer.productSales) || 0;
          temporaryCourseTotal += parseFloat(customer.course) || 0;
          temporaryCardTotal += parseFloat(customer.card) || 0;
          temporaryCashTotal += parseFloat(customer.cash) || 0;
          temporaryMPTotal += parseFloat(customer.mp) || 0;

          // Vip10 JSX
          let vip10JSX;

          if (customer.vip10 === "") {
            vip10JSX = "";
          } else if (customer.vip10.includes("card")) {
            vip10JSX = <p>10.00{cardJSX}</p>;
            temporaryVIP10CardTotal += 10;
            temporaryCardTotal += 10;
          } else if (customer.vip10.includes("cash")) {
            vip10JSX = <p>10.00</p>;
            temporaryVIP10CashTotal += 10;
            temporaryCashTotal += 10;
          }

          // Product and Course JSX
          const paymentMethodsAndAmount = [
            parseFloat(customer.mp) || 0,
            parseFloat(customer.cash) || 0,
            parseFloat(customer.card) || 0,
          ];
          const typeOfProductsAndAmount = [
            parseFloat(customer.productSales) || 0,
            parseFloat(customer.course) || 0,
          ];

          // console.log(paymentMethodsAndAmount, typeOfProductsAndAmount);

          // 3 types of payment for 2 types of product
          const paymentDeduction = [
            [0, 0, 0],
            [0, 0, 0],
          ];
          const skipMatchedPayment = [];

          typeOfProductsAndAmount.forEach((typeOfProductAndAmount, i) => {
            let productSuccessfullyDeducted = false;

            // if there's no payment on the product
            if (typeOfProductAndAmount === 0) {
              return;
            }

            paymentMethodsAndAmount.forEach((paymentMethodAndAmount, j) => {
              if (
                productSuccessfullyDeducted ||
                skipMatchedPayment.includes(j)
              ) {
                return;
              }

              if (typeOfProductAndAmount === paymentMethodAndAmount) {
                paymentDeduction[i][j] = paymentMethodAndAmount;
                productSuccessfullyDeducted = true;
                skipMatchedPayment.push(j);
              } else if (typeOfProductAndAmount < paymentMethodAndAmount) {
                paymentDeduction[i][j] = typeOfProductAndAmount;
                paymentMethodAndAmount =
                  paymentMethodAndAmount - typeOfProductAndAmount;
                productSuccessfullyDeducted = true;
              } else if (typeOfProductAndAmount > paymentMethodAndAmount) {
                paymentDeduction[i][j] = paymentMethodAndAmount;
                typeOfProductAndAmount =
                  typeOfProductAndAmount - paymentMethodAndAmount;
                skipMatchedPayment.push(j);
              }
            });
          });

          // console.log(paymentDeduction);

          const productSalesJSX = paymentDeduction[0].map(
            (productSalesPayment, i) => {
              // console.log(
              //   `${dayData.temporaryKey}_${month}_${year}-${customer.customerName}-${i}-productSales`,
              // );
              if (productSalesPayment === 0) {
                return (
                  <p
                    key={`${dayData.temporaryKey}_${month}_${year}-${customer.customerName}-${i}-productSales`}
                  ></p>
                );
              }

              if (i === 0) {
                return (
                  <p
                    key={`${dayData.temporaryKey}_${month}_${year}-${customer.customerName}-${i}-productSales`}
                  >
                    MP {productSalesPayment.toFixed(2)}
                  </p>
                );
              }

              if (i === 1) {
                return (
                  <p
                    key={`${dayData.temporaryKey}_${month}_${year}-${customer.customerName}-${i}-productSales`}
                  >
                    {productSalesPayment.toFixed(2)}
                  </p>
                );
              }

              if (i === 2) {
                return (
                  <p
                    key={`${dayData.temporaryKey}_${month}_${year}-${customer.customerName}-${i}-productSales`}
                  >
                    {productSalesPayment.toFixed(2)}
                    {cardJSX}
                  </p>
                );
              }
            },
          );

          const courseJSX = paymentDeduction[1].map((coursePayment, i) => {
            // console.log(
            //   `${dayData.temporaryKey}_${month}_${year}-${customer.customerName}-${i}-course`,
            // );
            if (coursePayment === 0) {
              return (
                <p
                  key={`${dayData.temporaryKey}_${month}_${year}-${customer.customerName}-${i}-course`}
                ></p>
              );
            }

            if (i === 0) {
              return (
                <p
                  key={`${dayData.temporaryKey}_${month}_${year}-${customer.customerName}-${i}-course`}
                >
                  MP {coursePayment.toFixed(2)}
                </p>
              );
            }

            if (i === 1) {
              return (
                <p
                  key={`${dayData.temporaryKey}_${month}_${year}-${customer.customerName}-${i}-course`}
                >
                  {coursePayment.toFixed(2)}
                </p>
              );
            }

            if (i === 2) {
              return (
                <p
                  key={`${dayData.temporaryKey}_${month}_${year}-${customer.customerName}-${i}-course`}
                >
                  {coursePayment.toFixed(2)}
                  {cardJSX}
                </p>
              );
            }
          });

          return (
            <TableRow
              key={`${dayData.temporaryKey}_${month}_${year}-${customer.customerName}`}
            >
              <TableCell className="font-semibold">
                {i === 0 ? `${dayData.temporaryKey}/${month}/${year}` : ""}
              </TableCell>
              <TableCell>{customer.customerName}</TableCell>
              <TableCell>{customer.invNo}</TableCell>
              <TableCell>{vip10JSX}</TableCell>
              <TableCell></TableCell>
              <TableCell>{productSalesJSX}</TableCell>
              <TableCell>{courseJSX}</TableCell>
            </TableRow>
          );
        },
      );

      const totalSeparateJSX = (
        <TableRow>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell className="border-y border-red-500">
            {(temporaryVIP10CardTotal + temporaryVIP10CashTotal).toFixed(2)}
          </TableCell>
          <TableCell className="border-y border-red-500"></TableCell>
          <TableCell className="border-y border-red-500">
            {temporaryProductsTotal.toFixed(2)}
          </TableCell>
          <TableCell className="border-y border-red-500">
            {temporaryCourseTotal.toFixed(2)}
          </TableCell>
        </TableRow>
      );

      let cardTotalOfTheDayJSX = null;

      if (temporaryCardTotal) {
        cardTotalOfTheDayJSX = (
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Card: {temporaryCardTotal.toFixed(2)}</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        );
      }
      let cashTotalOfTheDayJSX = null;
      if (temporaryCashTotal) {
        cashTotalOfTheDayJSX = (
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Cash: {temporaryCashTotal.toFixed(2)}</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        );
      }
      let mpTotalOfTheDayJSX = null;
      if (temporaryMPTotal) {
        mpTotalOfTheDayJSX = (
          <TableRow>
            <TableCell></TableCell>
            <TableCell>EW: {temporaryMPTotal.toFixed(2)}</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        );
      }

      temporaryCardCashMPTotal =
        temporaryCardTotal + temporaryCashTotal + temporaryMPTotal;

      const totalCardCashMPJSX = (
        <TableRow>
          <TableCell></TableCell>
          <TableCell>Total: {temporaryCardCashMPTotal.toFixed(2)}</TableCell>
          <TableCell></TableCell>
          <TableCell className="text-red-700">Bal</TableCell>
          <TableCell
            className={`text-red-700 ${!temporaryCashTotal && isObjectEmpty(todayBankInInfo) && "border-t border-red-500"}`}
          >
            RM {temporaryCashBalance.toFixed(2)}
          </TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
        </TableRow>
      );

      let cashPaymentJSX = null;
      if (temporaryCashTotal) {
        temporaryCashBalance += temporaryCashTotal;

        cashPaymentJSX = (
          <>
            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell className="text-red-700">+</TableCell>
              <TableCell className="text-red-700">
                RM {temporaryCashTotal.toFixed(2)}
              </TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell className="border-t border-red-500 text-red-700">
                RM {temporaryCashBalance.toFixed(2)}
              </TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </>
        );
      }

      let bankInJSX = null;
      if (!isObjectEmpty(todayBankInInfo)) {
        const eachBankInJSX = todayBankInInfo.bankType.map((bank, i) => {
          temporaryCashBalance -= parseFloat(todayBankInInfo.amount[i]);

          return (
            <TableRow
              key={`${dayData.temporaryKey}_${month}_${year}_${bank}_${i}`}
            >
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell>{`${dayData.temporaryKey}/${month}/${year} ${bank}`}</TableCell>
              <TableCell>-</TableCell>
              <TableCell>
                RM {`${todayBankInInfo.amount[i].toFixed(2)}`}
              </TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          );
        });

        const updatedCashBalanceJSX = (
          <TableRow>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell className="border-t border-red-500 text-red-700">
              RM {temporaryCashBalance.toFixed(2)}
            </TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        );

        bankInJSX = (
          <>
            {eachBankInJSX}
            {updatedCashBalanceJSX}
          </>
        );
      }

      const whiteSpaceJSX = (
        <TableRow>
          <TableCell>
            <span className="invisible">For table consistency</span>
          </TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell className="border-t border-red-500"></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
        </TableRow>
      );

      return (
        <Fragment key={`${dayData.temporaryKey}_${month}_${year}`}>
          {customerPaymentJSX}
          {totalSeparateJSX}
          {cardTotalOfTheDayJSX}
          {cashTotalOfTheDayJSX}
          {mpTotalOfTheDayJSX}
          {totalCardCashMPJSX}
          {cashPaymentJSX}
          {bankInJSX}
          {whiteSpaceJSX}
        </Fragment>
      );

      // return (
      //   <Fragment key={`${dayData.temproraryKey}-cashAccount`}>
      //     {daysWithSalesJSX}
      //   </Fragment>
      // );
    });

    return daysWithSalesJSX;
  }

  return (
    <Table className="my-3 lg:text-lg">
      <TableHeader>
        <TableRow className="border-t">
          <TableHead className="text-center">DATE</TableHead>
          <TableHead className="text-center">NAME</TableHead>
          <TableHead className="text-center">INVOICE</TableHead>
          <TableHead className="text-center">VIP</TableHead>
          <TableHead className="text-center">SHE&apos;S MINE</TableHead>
          <TableHead className="text-center">PRODUCTS</TableHead>
          <TableHead className="text-center">COURSE</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="text-center">
        {mapDataToTable(monthData, previousCashBalance)}
      </TableBody>
    </Table>
  );
}

export default CashAccountTable;
