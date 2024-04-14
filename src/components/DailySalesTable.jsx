import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import { CircleX, FilePenLine } from "lucide-react";

// const customers = [
//   {
//     cash: "",
//     card: "2176",
//     memberPoint: "",
//     customerName: "lim pei chee",
//     productSales: "608",
//     course: "1568",
//     invNo: "I0120301",
//     vip10: "",
//   },
//   {
//     cash: "",
//     card: "100",
//     memberPoint: "",
//     customerName: "saifuddin",
//     productSales: "",
//     course: "100",
//     invNo: "I0120302",
//     vip10: "",
//   },
//   {
//     cash: "",
//     card: "",
//     memberPoint: "",
//     customerName: "jacqueline",
//     productSales: "",
//     course: "",
//     invNo: "",
//     vip10: "",
//   },
//   {
//     cash: "",
//     card: "",
//     memberPoint: "",
//     customerName: "teh lee wah",
//     productSales: "",
//     course: "",
//     invNo: "",
//     vip10: "",
//   },
//   {
//     cash: "",
//     card: "",
//     memberPoint: "",
//     customerName: "nur hanisah",
//     productSales: "",
//     course: "",
//     invNo: "",
//     vip10: "",
//   },
// ];

// const totalSalesBeforeToday = 0;

function DailySalesTable({
  todayCustomersInfo,
  deleteCustomer,
  setEditId,
  totalSalesBeforeToday,
}) {
  const customers = Object.values(todayCustomersInfo);

  const totalCash = customers
    .reduce((previous, current) => {
      return previous + parseFloat(current.cash) || 0;
    }, 0)
    .toFixed(2);
  const totalCard = customers
    .reduce((previous, current) => {
      return previous + parseFloat(current.card) || 0;
    }, 0)
    .toFixed(2);
  const totalMemberPoint = customers
    .reduce((previous, current) => {
      return previous + parseFloat(current.mp) || 0;
    }, 0)
    .toFixed(2);
  const totalProductSales = customers
    .reduce((previous, current) => {
      return previous + parseFloat(current.productSales) || 0;
    }, 0)
    .toFixed(2);
  const totalCourse = customers
    .reduce((previous, current) => {
      return previous + parseFloat(current.course) || 0;
    }, 0)
    .toFixed(2);
  const totalVIP = customers
    .reduce((previous, current) => {
      return previous + parseFloat(current.vip10) || 0;
    }, 0)
    .toFixed(2);

  const totalOfTheDay = (
    parseFloat(totalProductSales) + parseFloat(totalCourse)
  ).toFixed(2);

  const accumulatedSales = (
    parseFloat(totalOfTheDay) + parseFloat(totalSalesBeforeToday)
  ).toFixed(2);

  function handleEditCustomer(id) {
    setEditId(id);
  }

  function handleDeleteCustomer(id) {
    if (window.confirm("Are you sure you want to delete the customer?")) {
      deleteCustomer(id);
    }
  }

  return (
    <Table className="my-3 lg:text-lg">
      <TableHeader>
        <TableRow>
          <TableHead>No.</TableHead>
          <TableHead>Cash</TableHead>
          <TableHead>Card</TableHead>
          <TableHead>MP</TableHead>
          <TableHead>Customer Name</TableHead>
          <TableHead>Product Sales</TableHead>
          <TableHead>Course</TableHead>
          <TableHead>Inv No.</TableHead>
          <TableHead>VIP RM 10</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((customer, i) => (
          <TableRow key={customer.customerName}>
            <TableCell className="font-medium">{i + 1}</TableCell>
            <TableCell>{customer.cash}</TableCell>
            <TableCell>{customer.card}</TableCell>
            <TableCell>{customer.memberPoint}</TableCell>
            <TableCell>{customer.customerName}</TableCell>
            <TableCell>{customer.productSales}</TableCell>
            <TableCell>{customer.course}</TableCell>
            <TableCell>{customer.invNo}</TableCell>
            <TableCell>{customer.vip10}</TableCell>
            <TableCell>
              <div className="flex flex-row gap-1 lg:flex-col ">
                <Button
                  onClick={() => handleEditCustomer(customer.id)}
                  className="h-7 w-7 bg-yellow-400 text-yellow-900 hover:bg-yellow-400/90 lg:h-10 lg:w-10"
                  size="icon"
                >
                  <FilePenLine className="h-5 w-5 lg:h-6 lg:w-6" />
                </Button>
                <Button
                  onClick={() => handleDeleteCustomer(customer.id)}
                  className=" h-7 w-7 bg-red-400 text-red-900 hover:bg-red-400/90 lg:h-10 lg:w-10"
                  size="icon"
                >
                  <CircleX className="h-5 w-5 lg:h-6 lg:w-6" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
        <TableRow>
          <TableCell colSpan={5}></TableCell>
          <TableCell>Total(a): {totalProductSales}</TableCell>
          <TableCell>Total(b): {totalCourse}</TableCell>
          <TableCell></TableCell>
          <TableCell>Total: {totalVIP}</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Amount received:</TableCell>
          <TableCell>Cash: {totalCash}</TableCell>
          <TableCell>Card: {totalCard}</TableCell>
          <TableCell>EW: {totalMemberPoint}</TableCell>
          <TableCell>CHQ:</TableCell>
          <TableCell>TOTAL(a+b): {totalOfTheDay}</TableCell>
          <TableCell colSpan={4}>
            Accumulated Sales: RM{accumulatedSales}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

export default DailySalesTable;
