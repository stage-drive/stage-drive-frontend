type DashboardWidgetProps = {
  title: string;
  children: React.ReactNode;
};

export const DashboardWidget = ({ title, children }: DashboardWidgetProps) => {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  );
};
