import type { ReactNode } from "react";

type Props = {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  fullWidth?: boolean;
};

export function DetailFactRow({ icon, label, value, fullWidth }: Props) {
  return (
    <div className={`object-detail__fact${fullWidth ? " object-detail__fact--full" : ""}`}>
      <span className="object-detail__fact-icon">{icon}</span>
      <div className="object-detail__fact-body">
        <span className="object-detail__fact-label">{label}</span>
        <span className="object-detail__fact-value">{value}</span>
      </div>
    </div>
  );
}
