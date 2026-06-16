import { Campaign, Product } from "../types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333/api";

// NEXT_PUBLIC_ prefix is required for Next.js to expose the variable to the browser
function authHeaders(): HeadersInit {
  const token = process.env.NEXT_PUBLIC_API_TOKEN || "";
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 204) return undefined as unknown as T;
  const data = await res.json();
  if (!res.ok) {
    const message = data?.error || `Erro ${res.status}`;
    throw new Error(message);
  }
  return data as T;
}

export const api = {
  // ── Campaigns ──────────────────────────────────────────────────
  getCampaigns: async (): Promise<Campaign[]> => {
    const res = await fetch(`${API_BASE_URL}/campaigns`, {
      headers: authHeaders(),
    });
    return handleResponse<Campaign[]>(res);
  },

  createCampaign: async (campaign: Omit<Campaign, "id">): Promise<Campaign> => {
    const res = await fetch(`${API_BASE_URL}/campaigns`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(campaign),
    });
    return handleResponse<Campaign>(res);
  },

  updateCampaign: async (id: string, campaign: Partial<Campaign>): Promise<Campaign> => {
    const res = await fetch(`${API_BASE_URL}/campaigns/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(campaign),
    });
    return handleResponse<Campaign>(res);
  },

  deleteCampaign: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/campaigns/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    return handleResponse<void>(res);
  },

  // ── Products ───────────────────────────────────────────────────
  getProducts: async (): Promise<Product[]> => {
    const res = await fetch(`${API_BASE_URL}/products`, {
      headers: authHeaders(),
    });
    return handleResponse<Product[]>(res);
  },

  createProduct: async (product: Omit<Product, "id">): Promise<Product> => {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(product),
    });
    return handleResponse<Product>(res);
  },

  updateProduct: async (id: string, product: Partial<Product>): Promise<Product> => {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(product),
    });
    return handleResponse<Product>(res);
  },

  deleteProduct: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    return handleResponse<void>(res);
  },
};
