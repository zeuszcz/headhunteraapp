import { useRef, useState } from "react";

type Props = {
  label: string;
  imageUrl: string | null;
  onPickFile: (file: File) => void;
  onRemove: () => void;
  disabled?: boolean;
};

export function AvatarUploadField({ label, imageUrl, onPickFile, onRemove, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [err, setErr] = useState<string | null>(null);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setErr(null);
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(f.type)) {
      setErr("Нужен JPEG, PNG или WebP");
      return;
    }
    if (f.size > 2 * 1024 * 1024) {
      setErr("Файл больше 2 МБ");
      return;
    }
    onPickFile(f);
  }

  return (
    <div className="avatar-upload">
      <div className="avatar-upload__label">{label}</div>
      <div className="avatar-upload__row">
        <div className="avatar-upload__preview">
          {imageUrl ? <img src={imageUrl} alt="" /> : <div className="avatar-upload__placeholder" aria-hidden />}
        </div>
        <div className="avatar-upload__actions">
          <button
            type="button"
            className="btn btn--secondary btn--sm"
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
          >
            Загрузить фото
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="avatar-upload__file-input"
            tabIndex={-1}
            onChange={onChange}
            aria-label={label}
          />
          {imageUrl ? (
            <button type="button" className="btn btn--ghost btn--sm" disabled={disabled} onClick={onRemove}>
              Убрать
            </button>
          ) : null}
        </div>
      </div>
      {err ? <p className="form-error" style={{ margin: "0.35rem 0 0", fontSize: "0.85rem" }}>{err}</p> : null}
      <p className="muted avatar-upload__hint">JPEG, PNG или WebP, до 2 МБ</p>
    </div>
  );
}
