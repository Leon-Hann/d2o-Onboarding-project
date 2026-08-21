type BrandHeaderProps = {
  className?: string;
};

export default function BrandHeader({ className }: BrandHeaderProps) {
  return (
    <div className={className}>
      <h1 className="text-3xl font-bold text-emerald-600">Veridian</h1>
      <p className="mt-1 text_muted">Admin Console</p>
    </div>
  );
}
