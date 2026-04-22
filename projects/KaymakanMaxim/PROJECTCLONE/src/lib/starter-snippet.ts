export const starterSnippet = `type FeatureCardProps = {
  title: string;
  description: string;
};

export function FeatureCard({
  title,
  description,
}: FeatureCardProps) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm text-slate-300">{description}</p>
    </article>
  );
}`;
