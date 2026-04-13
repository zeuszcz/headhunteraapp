import type { JobApplication, JobApplicationCreate } from "./types";

const BASE = "/api/v1";

async function parseError(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { detail?: string | unknown };
    if (typeof data.detail === "string") {
      return data.detail;
    }
    return res.statusText;
  } catch {
    return res.statusText;
  }
}

export async function fetchApplications(): Promise<JobApplication[]> {
  const res = await fetch(`${BASE}/applications`);
  if (!res.ok) {
    throw new Error(await parseError(res));
  }
  return res.json() as Promise<JobApplication[]>;
}

export async function createApplication(
  body: JobApplicationCreate,
): Promise<JobApplication> {
  const res = await fetch(`${BASE}/applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(await parseError(res));
  }
  return res.json() as Promise<JobApplication>;
}

export async function deleteApplication(id: string): Promise<void> {
  const res = await fetch(`${BASE}/applications/${id}`, { method: "DELETE" });
  if (!res.ok && res.status !== 204) {
    throw new Error(await parseError(res));
  }
}
