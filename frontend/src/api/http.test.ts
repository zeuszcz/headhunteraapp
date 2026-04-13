import { describe, expect, it, vi } from "vitest";
import { apiFetch } from "./http";

describe("apiFetch", () => {
  it("читает строковый detail из FastAPI", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 400,
          statusText: "Bad Request",
          text: () => Promise.resolve(JSON.stringify({ detail: "Email уже зарегистрирован" })),
        }),
      ),
    );
    await expect(apiFetch("/api/x", { auth: false })).rejects.toThrow("Email уже зарегистрирован");
    vi.unstubAllGlobals();
  });

  it("собирает массив validation errors", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 422,
          statusText: "Unprocessable",
          text: () =>
            Promise.resolve(
              JSON.stringify({
                detail: [{ msg: "field required" }, { msg: "invalid email" }],
              }),
            ),
        }),
      ),
    );
    await expect(apiFetch("/api/x", { auth: false })).rejects.toThrow("field required; invalid email");
    vi.unstubAllGlobals();
  });
});
