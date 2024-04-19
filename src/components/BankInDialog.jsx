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

function BankInDialog({
  openDialog,
  setOpenDialog,
  handleBankInInfo,
  bankInInfo,
}) {
  const [error, setError] = useState(false);

  function closeDialog() {
    setOpenDialog(false);
    setError(false);
  }

  function handleFormSubmit(event) {
    event.preventDefault();

    const isCancelButton =
      event.currentTarget.classList.contains("bg-background");

    if (isCancelButton) return closeDialog();

    const formData = new FormData(event.target);

    const amountData = formData.get("amount");
    const bankTypeData = formData.get("bankType");

    const amountArray = amountData.split(",");
    const bankTypeArray = bankTypeData.split(",");

    // different length
    if (amountArray.length !== bankTypeArray.length) {
      return setError(true);
    }

    // any amount is not a number
    if (amountArray.some((value) => isNaN(value))) {
      return setError(true);
    }

    // amount is a number but bank is empty
    if (
      !amountArray.some((value) => isNaN(value)) &&
      amountArray.every((value) => !!parseFloat(value)) &&
      bankTypeArray.some((value) => value.length === 0)
    ) {
      return setError(true);
    }

    setError(false);

    // if both are empty values
    if (
      amountArray.every((value) => value.length === 0) &&
      bankTypeArray.every((value) => value.length === 0)
    ) {
      return handleBankInInfo({});
    }

    const formattedAmount = amountArray.map((value) =>
      parseFloat(value.trim()),
    );
    const formattedBankType = bankTypeArray.map((value) => value.trim());

    handleBankInInfo({ amount: formattedAmount, bankType: formattedBankType });
  }

  return (
    <Dialog open={openDialog} onOpenChange={closeDialog}>
      <DialogContent className="sm:max-w-[425px] lg:max-w-fit">
        <DialogHeader>
          <DialogTitle className="lg:text-2xl">Bank In Info</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleFormSubmit}>
          <div className="grid grid-cols-2 gap-3  lg:text-lg">
            <div className="flex flex-col gap-1">
              <Label htmlFor="amount">Bank In Amount</Label>
              <Input
                id="amount"
                name="amount"
                defaultValue={bankInInfo?.amount?.join(", ") || ""}
                className="lg:text-lg"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="bankType">Type Of Bank</Label>
              <Input
                id="bankType"
                name="bankType"
                defaultValue={bankInInfo?.bankType?.join(", ") || ""}
                className="lg:text-lg"
              />
            </div>
          </div>

          {error ? (
            <p className="mt-1 text-red-600">
              Input invalid, please check again!
            </p>
          ) : (
            <p className="invisible mt-1">Space for error purpose</p>
          )}

          <DialogFooter className="mt-6 gap-2 sm:gap-0 lg:space-x-3">
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

export default BankInDialog;
