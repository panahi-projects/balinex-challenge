import { Button } from "@/shared";
import { Loader2 } from "lucide-react";

interface ViewMoreButtonProps {
  onClick: () => void;
  isLoading: boolean;
  hasMore: boolean;
  totalLoaded: number;
  className?: string;
}

const ViewMoreButton = ({
  onClick,
  isLoading,
  hasMore,
  totalLoaded,
  className = "",
}: ViewMoreButtonProps) => {
  const handleClick = () => {
    onClick();
  };

  if (!hasMore) {
    return (
      <div className="text-center py-6">
        <p className="text-secondary-text text-sm">
          تمام {totalLoaded} ارز دیجیتال نمایش داده شده است
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-6">
      <Button
        onClick={handleClick}
        disabled={isLoading}
        className={`min-w-[140px] h-12 ${className}`}
        variant="secondary"
        size="small"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            در حال بارگذاری...
          </>
        ) : (
          <>
            مشاهده بیشتر
            <span className="mr-2 text-xs opacity-70">
              ({totalLoaded} مورد)
            </span>
          </>
        )}
      </Button>
    </div>
  );
};

export default ViewMoreButton;
