import { Loader2 } from "lucide-react";
export default function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-24 text-gray-500">
      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
      Уншиж байна...
    </div>
  );
}
