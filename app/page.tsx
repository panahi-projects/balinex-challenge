import { CryptoTable } from "@/features";

export default async function Home() {
  return (
    <div className="container text-primary my-4">
      <CryptoTable />
    </div>
  );
}
