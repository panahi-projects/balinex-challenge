"use client";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();
  const handleClick = () => {
    router.back();
  };
  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 text-secondary-600 cursor-pointer p-2 hover:text-secondary-800 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
      aria-label="Go back to previous page"
    >
      <span>بازگشت</span>
      <ArrowLeftIcon className="w-4 h-4" aria-hidden="true" />
    </button>
  );
};

export default BackButton;
