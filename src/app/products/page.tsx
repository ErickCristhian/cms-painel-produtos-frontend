"use client";

import { useEffect, useState } from "react";
import { Product, Campaign } from "@/types";
import { api } from "@/services/api";
import Link from "next/link";
import { Plus, Edit2, Trash2 } from "lucide-react";
import Image from "next/image";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCampaignId, setFilterCampaignId] = useState<string>("all");

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsData, campaignsData] = await Promise.all([
        api.getProducts(),
        api.getCampaigns()
      ]);
      setProducts(productsData);
      setCampaigns(campaignsData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;
    try {
      await api.deleteProduct(id);
      await loadData();
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir produto.");
    }
  };

  const filteredProducts = filterCampaignId === "all" 
    ? products 
    : products.filter(p => p.campaignId === filterCampaignId);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-center pb-6 border-b border-white/10">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Produtos</h2>
          <p className="text-slate-400 mt-1">Gerencie os produtos cadastrados no sistema.</p>
        </div>
        <Link
          href="/products/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/20"
        >
          <Plus size={18} />
          Novo Produto
        </Link>
      </header>

      {!loading && products.length > 0 && (
        <div className="flex justify-end items-center gap-3">
          <label htmlFor="campaignFilter" className="text-sm text-slate-400 font-medium">Filtrar por Campanha:</label>
          <select 
            id="campaignFilter"
            value={filterCampaignId}
            onChange={(e) => setFilterCampaignId(e.target.value)}
            className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all min-w-[200px]"
          >
            <option value="all">Todas as Campanhas</option>
            {campaigns.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">📦</span>
          </div>
          <h3 className="text-xl font-medium text-white mb-2">Nenhum produto encontrado</h3>
          <p className="text-slate-400 max-w-sm mb-6">Comece cadastrando seu primeiro produto.</p>
          <Link
            href="/products/new"
            className="text-blue-400 hover:text-blue-300 font-medium"
          >
            Criar primeiro produto
          </Link>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-500">
            <span className="text-2xl">🔍</span>
          </div>
          <h3 className="text-xl font-medium text-white mb-2">Nenhum produto encontrado neste filtro</h3>
          <p className="text-slate-400 max-w-sm mb-6">Tente selecionar outra campanha ou limpe o filtro.</p>
          <button
            onClick={() => setFilterCampaignId("all")}
            className="text-blue-400 hover:text-blue-300 font-medium"
          >
            Limpar Filtro
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="glass-panel rounded-2xl overflow-hidden flex flex-col transition-all hover:border-blue-500/30 group">
              <div className="h-48 relative overflow-hidden bg-slate-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-white border border-white/10">
                  {product.brand}
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="text-xs font-medium text-purple-400 mb-1">
                  Campanha: {campaigns.find(c => c.id === product.campaignId)?.name || "Desconhecida"}
                </div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-white">{product.name}</h3>
                  <div className="text-right">
                    <div className="text-sm text-slate-400 line-through" title="Menor Preço">R$ {product.lowestPrice.toFixed(2)}</div>
                    <div className="text-lg font-bold text-blue-400" title="Preço Atual">R$ {product.currentPrice.toFixed(2)}</div>
                    {product.lastPrice ? <div className="text-xs text-slate-500 mt-1" title="Último Histórico">Último: R$ {product.lastPrice.toFixed(2)}</div> : null}
                  </div>
                </div>
                <p className="text-slate-400 text-sm mb-4 flex-1 line-clamp-2">{product.title}</p>
                
                <div className="flex justify-end gap-2 pt-4 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity mt-auto">
                  <a href={product.accessLink} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors mr-auto text-sm flex items-center">
                    Ver Link
                  </a>
                  <Link
                    href={`/products/${product.id}`}
                    className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                  >
                    <Edit2 size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
