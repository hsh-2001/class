type Stat = {
  label: string;
  value: string;
};

type SectionItem = {
  title: string;
  description: string;
  meta?: string;
};

type AppPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  stats: Stat[];
  primaryTitle: string;
  primaryItems: SectionItem[];
  secondaryTitle: string;
  secondaryItems: SectionItem[];
};

export default function AppPage({
  description,
  eyebrow,
  primaryItems,
  primaryTitle,
  secondaryItems,
  secondaryTitle,
  stats,
  title,
}: AppPageProps) {
  return (
    <section className="grid gap-6">
      <div className="rounded-xl border border-black/10 bg-white/80 p-6 backdrop-blur dark:border-white/10 dark:bg-white/5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-slate-50">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
          {description}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-lg border border-black/10 bg-white/75 p-5 dark:border-white/10 dark:bg-white/5"
          >
            <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
            <p className="mt-3 text-2xl font-semibold text-slate-950 dark:text-slate-50">
              {stat.value}
            </p>
          </article>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section className="rounded-xl border border-black/10 bg-white/75 p-6 dark:border-white/10 dark:bg-white/5">
          <h2 className="text-lg font-semibold text-slate-950 dark:text-slate-50">
            {primaryTitle}
          </h2>
          <div className="mt-4 space-y-3">
            {primaryItems.map((item) => (
              <article
                key={`${primaryTitle}-${item.title}`}
                className="rounded-lg border border-black/10 bg-black/5 p-4 dark:border-white/10 dark:bg-white/5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-950 dark:text-slate-50">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      {item.description}
                    </p>
                  </div>
                  {item.meta && (
                    <span className="rounded-md bg-black/85 px-3 py-1 text-xs font-medium text-white dark:bg-white/90 dark:text-black">
                      {item.meta}
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-black/10 bg-white/75 p-6 dark:border-white/10 dark:bg-white/5">
          <h2 className="text-lg font-semibold text-slate-950 dark:text-slate-50">
            {secondaryTitle}
          </h2>
          <div className="mt-4 space-y-3">
            {secondaryItems.map((item) => (
              <article
                key={`${secondaryTitle}-${item.title}`}
                className="rounded-lg border border-black/10 bg-black/5 p-4 dark:border-white/10 dark:bg-white/5"
              >
                <h3 className="text-sm font-semibold text-slate-950 dark:text-slate-50">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {item.description}
                </p>
                {item.meta && (
                  <p className="mt-3 text-xs font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    {item.meta}
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
