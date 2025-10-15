import { Button } from "@/shared";

const Authentication = () => {
  return (
    <div className="flex flex-row gap-2">
      <Button type="button" aria-label="Login" variant="info" size="medium">
        ورود
      </Button>
      <Button
        type="button"
        aria-label="Register"
        variant="secondary"
        size="medium"
      >
        ثبت نام
      </Button>
    </div>
  );
};

export default Authentication;
