import { ArrowUpFromLine } from "lucide-react";
import { Button } from "./ui/button";

function ScrollToTopButton() {
  return (
    <Button
      size="icon"
      className="group fixed bottom-4 right-4 z-10 h-9 w-9 border-2 border-green-800 bg-transparent lg:h-10 lg:w-10"
      onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}
    >
      <ArrowUpFromLine className="h-5 w-5 text-green-800 group-hover:text-white lg:h-6 lg:w-6" />
    </Button>
  );
}

export default ScrollToTopButton;
