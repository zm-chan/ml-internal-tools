import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";
import { useState } from "react";

function CashBalanceDialog({
  openDialog,
  setOpenDialog,
  handleCashBalanceInfo,
  previousCashBalance,
}) {
  const [error, setError] = useState(false);

  function handleFormSubmit(event) {
    event.preventDefault();

    const isCancelButton =
      event.currentTarget.classList.contains("bg-background");

    if (isCancelButton) return setOpenDialog(false);

    const formData = new FormData(event.target);

    const cashBalanceData = formData.get("cashBalance").trim();

    const cashBalanceArray = cashBalanceData.split(",");

    // more than 1 amount
    if (cashBalanceArray.length > 1) {
      return setError(true);
    }

    // amount is not a number
    if (isNaN(cashBalanceData)) {
      return setError(true);
    }

    const formattedCashBalance = parseFloat(cashBalanceData) || 0;

    setError(false);

    handleCashBalanceInfo(formattedCashBalance);
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="lg:text-2xl">Customer Info</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleFormSubmit}>
          <div className="flex flex-col gap-1 lg:gap-3 lg:text-lg">
            <Label htmlFor="cashBalance">Previous Cash Balance</Label>
            <Input
              id="cashBalance"
              name="cashBalance"
              defaultValue={previousCashBalance}
              className="lg:text-lg"
            />
          </div>

          {error ? (
            <p className="mt-1 text-red-600">
              Input invalid, please check again!
            </p>
          ) : (
            <p className="invisible mt-1">Space for error purpose</p>
          )}

          <DialogFooter className="mt-5 gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={handleFormSubmit}
              className="lg:text-lg"
            >
              Cancel
            </Button>
            <Button type="submit" className="lg:text-lg">
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CashBalanceDialog;
