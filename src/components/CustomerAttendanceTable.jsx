import { extractCustomerAttendance } from "@/util";
import { format } from "date-fns";
import CustomerAttendanceTableUI from "./CustomerAttendanceTableUI";
import { Button } from "./ui/button";
import { ArrowUpDown } from "lucide-react";

function CustomerAttendanceTable({ monthData, day }) {
  const dateState = new Date(day);

  const currentMonth = format(dateState, "MMM");
  const currentYear = format(dateState, "yyyy");

  const customerAttendanceData = extractCustomerAttendance(monthData);

  const columns = [
    {
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="lg:text-lg"
          >
            No.
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      accessorKey: "id",
    },
    {
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="lg:text-lg"
          >
            Customer Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      accessorKey: "customerName",
    },
    ...Array.from({ length: 12 }, (_, i) => {
      const formattedMonth = format(
        new Date(parseFloat(currentYear), i, 1),
        "MMM",
      );

      return {
        header: formattedMonth,
        accessorKey: formattedMonth.toLowerCase(),
      };
    }),
  ];

  const formattedCustomerAttendanceData = Object.keys(
    customerAttendanceData,
  ).map((customerKey, i) => {
    const monthsAttendance = Array.from({ length: 12 }, (_, i) => {
      const formattedMonth = format(
        new Date(parseFloat(currentYear), i, 1),
        "MMM",
      );

      if (formattedMonth === currentMonth) {
        return {
          [formattedMonth.toLowerCase()]:
            customerAttendanceData[customerKey].join(", "),
        };
      }

      return {
        [formattedMonth.toLowerCase()]: "",
      };
    });

    return Object.assign(
      {
        id: i + 1,
        customerName: customerKey.split("-").join(" "),
      },
      ...monthsAttendance,
    );
  });

  return (
    <CustomerAttendanceTableUI
      data={formattedCustomerAttendanceData}
      columns={columns}
    />
  );
}

export default CustomerAttendanceTable;
