"use client";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();
  const handleClick = () => {
    router.back();
  };
  return (
    <div
      onClick={handleClick}
      className="flex items-center gap-2 text-secondary-600 cursor-pointer p-2"
    >
      <span>بازگشت</span>
      <ArrowLeftIcon className="w-4 h-4" />
    </div>
  );
};

export default BackButton;
