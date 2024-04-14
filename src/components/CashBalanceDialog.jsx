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

function CashBalanceDialog({
  openDialog,
  setOpenDialog,
  id,
  handleBankInInfo,
}) {
  function handleFormSubmit(event) {
    event.preventDefault();

    const isCancelButton =
      event.currentTarget.classList.contains("bg-background");

    if (isCancelButton) return setOpenDialog(false);
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="max-h-96 overflow-y-scroll p-3 min-[480px]:max-h-fit min-[480px]:overflow-y-auto sm:max-w-xl sm:p-6">
        <DialogHeader>
          <DialogTitle className="lg:text-2xl">Customer Info</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleFormSubmit}>
          <div className="flex flex-col gap-1">
            <Label htmlFor="cashBalance">Previous Cash Balance</Label>
            <Input id="cashBalance" name="cashBalance" className="lg:text-lg" />
          </div>

          <DialogFooter className="mt-6">
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

export default CashBalanceDialog;
