"use client";
import { NewCryptoForm } from "@/features/crypto-new";
import { useRouter } from "next/navigation";

const NewCryptoPage = () => {
  const router = useRouter();

  const handleSuccess = (data: any) => {
    console.log("New crypto created:", data);
    router.push("/");
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <NewCryptoForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </div>
    </div>
  );
};

export default NewCryptoPage;
