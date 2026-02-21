import type { ReactNode } from "react";

type PageSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
  align?: "left" | "center";
};

export function PageSection({
  title,
  description,
  children,
  align = "left",
}: PageSectionProps) {
  return (
    <div className="space-y-6">
      <div className={`space-y-2 ${align === "center" ? "text-center" : ""}`}>
        <h1 className="text-2xl font-semibold tracking-tight">
          {title}
        </h1>
        {description ? (
          <p className="text-sm">{description}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
}
