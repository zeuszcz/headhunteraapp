import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";

describe("App", () => {
  it("показывает главную страницу с заголовком", async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <ThemeProvider>
              <App />
            </ThemeProvider>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>,
    );
    expect(await screen.findByRole("heading", { name: /рынок труда/i })).toBeInTheDocument();
  });
});
