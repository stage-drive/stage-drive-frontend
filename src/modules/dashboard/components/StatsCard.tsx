type StatsCardProps = {
  title: string;
  value: string;
};

export const StatsCard = ({ title, value }: StatsCardProps) => {
  return (
    <div>
      <h3>{title}</h3>
      <strong>{value}</strong>
    </div>
  );
};
