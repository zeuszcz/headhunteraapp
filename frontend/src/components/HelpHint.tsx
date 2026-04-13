import { useState, type ReactNode } from "react";
import { Modal } from "./Modal";

type HelpHintProps = {
  label?: string;
  title: string;
  children: ReactNode;
};

/** Кнопка «?» открывает модалку со справкой. */
export function HelpHint({ label = "Подробнее", title, children }: HelpHintProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className="help-hint"
        onClick={() => setOpen(true)}
        aria-label={label}
        title={label}
      >
        ?
      </button>
      <Modal open={open} title={title} onClose={() => setOpen(false)}>
        <div className="help-hint__content">{children}</div>
      </Modal>
    </>
  );
}
