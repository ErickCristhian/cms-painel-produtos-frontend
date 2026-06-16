"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Product, Campaign } from "@/types";
import { api } from "@/services/api";

interface ProductFormProps {
  initialData?: Product;
  isEdit?: boolean;
}

export default function ProductForm({ initialData, isEdit }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    brand: "",
    lowestPrice: 0,
    currentPrice: 0,
    lastPrice: 0,
    imageUrl: "",
    title: "",
    accessLink: "",
    campaignId: "",
  });

  useEffect(() => {
    const fetchCampaigns = async () => {
      const data = await api.getCampaigns();
      setCampaigns(data);
      if (!isEdit && data.length > 0 && !formData.campaignId) {
        setFormData(prev => ({ ...prev, campaignId: data[0].id }));
      }
    };
    fetchCampaigns();
  }, [isEdit, formData.campaignId]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        brand: initialData.brand,
        lowestPrice: initialData.lowestPrice,
        currentPrice: initialData.currentPrice,
        lastPrice: initialData.lastPrice || 0,
        imageUrl: initialData.imageUrl,
        title: initialData.title,
        accessLink: initialData.accessLink,
        campaignId: initialData.campaignId,
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.campaignId) {
      alert("Selecione uma campanha");
      return;
    }

    let payload = { ...formData };

    // Regra: se o menor preço for maior que o preço atual, ajusta para o preço atual
    if (payload.lowestPrice > payload.currentPrice) {
      payload.lowestPrice = payload.currentPrice;
      setFormData(prev => ({ ...prev, lowestPrice: payload.currentPrice }));
    }

    // Regra: se for edição e o preço mudou, salva o histórico do preço anterior
    if (isEdit && initialData && payload.currentPrice !== initialData.currentPrice) {
      payload.lastPrice = initialData.currentPrice;
      setFormData(prev => ({ ...prev, lastPrice: payload.lastPrice }));
    }

    setLoading(true);
    try {
      if (isEdit && initialData) {
        await api.updateProduct(initialData.id, payload);
      } else {
        await api.createProduct(payload);
      }
      router.push("/products");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar produto.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-2xl max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="md:col-span-2">
          <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
            Nome do Produto
          </label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-2">
            Título
          </label>
          <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
        </div>

        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-slate-300 mb-2">
            Marca
          </label>
          <input type="text" id="brand" name="brand" value={formData.brand} onChange={handleChange} required className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">
            Descrição
          </label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows={3} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none" />
        </div>

        <div>
          <label htmlFor="lowestPrice" className="block text-sm font-medium text-slate-300 mb-2">
            Menor Preço {isEdit && <span className="text-xs text-slate-500">(Apenas Leitura)</span>}
          </label>
          <input 
            type="number" 
            step="0.01" 
            id="lowestPrice" 
            name="lowestPrice" 
            value={formData.lowestPrice} 
            onChange={handleChange} 
            required 
            disabled={isEdit}
            className={`w-full border rounded-lg px-4 py-2.5 transition-all focus:outline-none ${isEdit ? "bg-slate-800/50 border-slate-700/50 text-slate-400 cursor-not-allowed" : "bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"}`} 
          />
        </div>

        <div>
          <label htmlFor="currentPrice" className="block text-sm font-medium text-slate-300 mb-2">
            Preço Atual
          </label>
          <input type="number" step="0.01" id="currentPrice" name="currentPrice" value={formData.currentPrice} onChange={handleChange} required className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
        </div>

        <div>
          <label htmlFor="lastPrice" className="block text-sm font-medium text-slate-300 mb-2">
            Último Preço Histórico (Atualizado Automaticamente)
          </label>
          <input type="number" step="0.01" id="lastPrice" name="lastPrice" value={formData.lastPrice} onChange={handleChange} disabled className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-slate-400 focus:outline-none cursor-not-allowed transition-all" />
        </div>

        <div className="md:col-span-1">
          <label htmlFor="imageUrl" className="block text-sm font-medium text-slate-300 mb-2">
            URL da Imagem
          </label>
          <input type="url" id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleChange} required className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
        </div>

        <div>
          <label htmlFor="accessLink" className="block text-sm font-medium text-slate-300 mb-2">
            Link de Acesso
          </label>
          <input type="url" id="accessLink" name="accessLink" value={formData.accessLink} onChange={handleChange} required className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
        </div>

        <div>
          <label htmlFor="campaignId" className="block text-sm font-medium text-slate-300 mb-2">
            Campanha Associada
          </label>
          <select id="campaignId" name="campaignId" value={formData.campaignId} onChange={handleChange} required className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all">
            <option value="" disabled>Selecione uma campanha</option>
            {campaigns.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

      </div>

      <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-white/10">
        <button type="button" onClick={() => router.push("/products")} className="px-6 py-2.5 rounded-lg font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
          Cancelar
        </button>
        <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-lg font-medium bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-500/20 flex items-center gap-2">
          {loading && <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />}
          {isEdit ? "Salvar Alterações" : "Criar Produto"}
        </button>
      </div>
    </form>
  );
}
