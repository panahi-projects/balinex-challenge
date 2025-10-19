const CryptoPercentChange = ({ percentChange }: { percentChange: string }) => {
  return (
    <div
      className={`flex items-center justify-center w-16 p-1 rounded-full gap-1 ${percentChange.includes("-") ? "text-error-500 bg-error-500/10" : "text-success-500 bg-success-500/10"}`}
    >
      <span className="text-sm">%</span>
      <span dir="ltr" className="text-xs font-bold farsi-number">
        {percentChange}
      </span>
    </div>
  );
};

export default CryptoPercentChange;
