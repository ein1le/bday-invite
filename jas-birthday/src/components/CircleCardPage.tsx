import type { ReactNode } from "react";
import { CircleBackground } from "./CircleBackground";
import { TextCard } from "./TextCard";

type CircleCardPageProps = {
  children: ReactNode;
  footer?: ReactNode;
  withCard?: boolean;
};

export function CircleCardPage({
  children,
  footer,
  withCard = true,
}: CircleCardPageProps) {
  return (
    <CircleBackground>
      {withCard ? <TextCard>{children}</TextCard> : children}
      {footer ? <div className="relative mt-6 w-full">{footer}</div> : null}
    </CircleBackground>
  );
}
