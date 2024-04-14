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

function CustomerDialog({
  openDialog,
  closeCustomerDialog,
  handleCustomerInfo,
  editCustomerInfo,
}) {
  const [error, setError] = useState(false);

  function closeCustomerDialogAndError() {
    closeCustomerDialog();
    setError(false);
  }

  function handleFormSubmit(event) {
    event.preventDefault();

    const isCancelButton =
      event.currentTarget.classList.contains("bg-background");

    if (isCancelButton) {
      return closeCustomerDialogAndError();
    }

    const formData = new FormData(event.target);

    const cashData = formData.get("cash");
    const cardData = formData.get("card");
    const mpData = formData.get("mp");
    const vip10Data = formData.get("vip10");

    const arrayHasNaN = [cashData, cardData, mpData, vip10Data]
      .map((data) => {
        const cleanedData = data.trim();

        if (cleanedData === "") {
          return 0;
        } else {
          return parseFloat(cleanedData);
        }
      })
      .some((value) => isNaN(value));

    if (arrayHasNaN) {
      return setError(true);
    }

    const customerNameData = formData.get("customerName");

    // TODO: must uncomment it
    if (customerNameData === "" || customerNameData.length < 5) {
      return setError(true);
    }

    const formDataObject = {};

    for (const [key, value] of formData.entries()) {
      formDataObject[key] = value;
    }

    formDataObject.id = formData
      .get("customerName")
      .toLowerCase()
      .split(" ")
      .join("-");

    setError(false);
    handleCustomerInfo(formDataObject);
  }

  return (
    <Dialog open={openDialog} onOpenChange={closeCustomerDialogAndError}>
      <DialogContent className="max-h-96 overflow-y-scroll p-3 min-[480px]:max-h-fit min-[480px]:overflow-y-auto sm:max-w-xl sm:p-6 lg:max-w-2xl lg:p-8">
        <DialogHeader>
          <DialogTitle className="lg:text-2xl">Customer Info</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleFormSubmit}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:text-lg">
            <div className="flex flex-col gap-1">
              <Label htmlFor="cash">Cash</Label>
              <Input
                id="cash"
                name="cash"
                defaultValue={editCustomerInfo?.cash || ""}
                className="lg:text-lg"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="card">Card</Label>
              <Input
                id="card"
                name="card"
                defaultValue={editCustomerInfo?.card || ""}
                className="lg:text-lg"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="mp">MP</Label>
              <Input
                id="mp"
                name="mp"
                defaultValue={editCustomerInfo?.mp || ""}
                className="lg:text-lg"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="vip10">VIP 10</Label>
              <Input
                id="vip10"
                name="vip10"
                defaultValue={editCustomerInfo?.vip10 || ""}
                className="lg:text-lg"
              />
            </div>
          </div>
          <div className="mt-3 grid gap-y-3 min-[480px]:grid-cols-2 min-[480px]:gap-3 lg:text-lg">
            <div className="flex flex-col gap-1">
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                name="customerName"
                defaultValue={editCustomerInfo?.customerName || ""}
                className="lg:text-lg"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="productSales">Product Sales</Label>
              <Input
                id="productSales"
                name="productSales"
                defaultValue={editCustomerInfo?.productSales || ""}
                className="lg:text-lg"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="course">Course</Label>
              <Input
                id="course"
                name="course"
                defaultValue={editCustomerInfo?.course || ""}
                className="lg:text-lg"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="invNo">Inv No</Label>
              <Input
                id="invNo"
                name="invNo"
                defaultValue={editCustomerInfo?.invNo || ""}
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

export default CustomerDialog;
