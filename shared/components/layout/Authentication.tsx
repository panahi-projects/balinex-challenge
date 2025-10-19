import { Button } from "@/shared";

const Authentication = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-2 w-full lg:w-auto">
      <Button
        type="button"
        aria-label="Login"
        variant="info"
        size="medium"
        className="w-full lg:w-auto"
      >
        ورود
      </Button>
      <Button
        type="button"
        aria-label="Register"
        variant="secondary"
        size="medium"
        className="w-full lg:w-auto"
      >
        ثبت نام
      </Button>
    </div>
  );
};

export default Authentication;
