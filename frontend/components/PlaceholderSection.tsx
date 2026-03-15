interface PlaceholderSectionProps {
  title: string;
  children?: React.ReactNode;
}

export function PlaceholderSection({ title, children }: PlaceholderSectionProps) {
  return (
    <section className="rounded border p-4">
      <h2 className="text-lg font-medium">{title}</h2>
      {children}
    </section>
  );
}
