import { CryptoTable } from "@/features";

export default async function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const cryptoData = await fetch(`${baseUrl}/api/crypto`);
  const data = await cryptoData.json();
  console.log("data::: ", data.slice(0, 5));
  return (
    <div className="container text-primary my-4">
      <CryptoTable />
    </div>
  );
}
