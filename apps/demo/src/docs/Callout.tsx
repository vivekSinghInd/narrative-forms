import type { ReactNode } from "react";

export default function Callout({
  type = "info",
  children,
}: {
  type?: "info" | "warning" | "tip";
  children: ReactNode;
}) {
  return <div className={`callout callout--${type}`}>{children}</div>;
}
