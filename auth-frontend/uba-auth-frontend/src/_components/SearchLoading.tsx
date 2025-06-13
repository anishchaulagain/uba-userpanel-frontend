import { Loader2 } from "lucide-react";

export const SearchLoading = () => (
  <div className="flex items-center justify-center py-4">
    <Loader2 className="h-5 w-5 animate-spin text-blue-600 mr-2" />
    <span className="text-sm text-gray-600">Searching...</span>
  </div>
);