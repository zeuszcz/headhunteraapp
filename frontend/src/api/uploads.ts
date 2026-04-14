import { apiFetch } from "./http";

export async function uploadAvatar(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await apiFetch<{ url: string }>("/api/v1/uploads/avatar", {
    method: "POST",
    body: fd,
  });
  return res.url;
}

export async function uploadObjectCover(objectId: string, file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await apiFetch<{ url: string }>(`/api/v1/uploads/objects/${objectId}/cover`, {
    method: "POST",
    body: fd,
  });
  return res.url;
}
