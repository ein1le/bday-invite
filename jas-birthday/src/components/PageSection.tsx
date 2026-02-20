import type { ReactNode } from "react";

type PageSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function PageSection({
  title,
  description,
  children,
}: PageSectionProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          {title}
        </h1>
        {description ? (
          <p className="text-sm text-slate-600">{description}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
}

