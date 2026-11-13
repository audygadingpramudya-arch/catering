const defaultBase = "http://localhost:5000";

export const API_BASE = (import.meta.env.PUBLIC_API_URL || defaultBase).replace(
  /\/$/,
  ""
);

export function assetUrl(path) {
  if (!path) {
    return "";
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  if (path.startsWith("/uploads/")) {
    return `${API_BASE}${path}`;
  }

  return path;
}

export async function api(path, options = {}) {
  const { body, headers, ...rest } = options;
  const config = {
    credentials: "include",
    ...rest,
    headers: { ...(headers || {}) }
  };

  if (body !== undefined && body !== null) {
    if (body instanceof FormData) {
      config.body = body;
    } else {
      config.headers["Content-Type"] = "application/json";
      config.body = typeof body === "string" ? body : JSON.stringify(body);
    }
  }

  const response = await fetch(`${API_BASE}${path}`, config);
  const text = await response.text();
  let payload = null;

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { message: text };
    }
  }

  if (!response.ok) {
    const error = new Error(payload?.message || "Terjadi kesalahan");
    error.status = response.status;
    throw error;
  }

  return payload;
}

export async function requireAdmin() {
  try {
    const payload = await api("/api/auth/me");
    return payload.admin;
  } catch (error) {
    if (error.status === 401) {
      window.location.href = "/admin/login";
      return null;
    }

    throw error;
  }
}

export async function logoutAdmin() {
  try {
    await api("/api/auth/logout", { method: "POST" });
  } catch {
    window.location.href = "/admin/login";
    return;
  }

  window.location.href = "/admin/login";
}

export function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(Number(value) || 0);
}

export function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function errorMessage(error) {
  return error instanceof Error ? error.message : "Terjadi kesalahan";
}

export function showToast(message, type = "success") {
  let container = document.querySelector(".admin-toast-container");

  if (!container) {
    container = document.createElement("div");
    container.className = "admin-toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `admin-toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add("visible"));

  setTimeout(() => {
    toast.classList.remove("visible");
    setTimeout(() => toast.remove(), 250);
  }, 3200);
}

export function setLoading(button, loading, label) {
  if (!button) {
    return;
  }

  if (loading) {
    button.dataset.originalLabel = button.textContent;
    button.disabled = true;
    button.textContent = label || "Menyimpan...";
  } else {
    button.disabled = false;
    button.textContent = button.dataset.originalLabel || button.textContent;
  }
}
