type Props = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

export function Section({ title, children, className = "" }: Props) {
  return (
    <section className={className}>
      <h2 className="mb-6 text-2xl font-bold">{title}</h2>
      {children}
    </section>
  );
}
