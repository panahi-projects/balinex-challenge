interface CardProps {
  children?: React.ReactNode;
}

const Card = ({ children }: CardProps) => {
  return (
    <div className="bg-card rounded-lg shadow-sm border border-gray-200 p-4">
      {children}
    </div>
  );
};

export default Card;
