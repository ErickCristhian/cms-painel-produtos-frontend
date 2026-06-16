"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";

export default function Home() {
  const [stats, setStats] = useState({ campaigns: 0, products: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        const [campaignsData, productsData] = await Promise.all([
          api.getCampaigns(),
          api.getProducts()
        ]);
        setStats({
          campaigns: campaignsData.length,
          products: productsData.length,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-center pb-6 border-b border-white/10">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard Overview</h2>
          <p className="text-slate-400 mt-1">Bem vindo de volta, aqui estão os dados atuais do seu painel.</p>
        </div>
      </header>
      
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl">
          <div className="glass-panel p-6 rounded-2xl flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </div>
            <span className="text-slate-400 text-sm font-medium">Total de Campanhas</span>
            <span className="text-5xl font-bold text-white">{stats.campaigns}</span>
          </div>
          
          <div className="glass-panel p-6 rounded-2xl flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            </div>
            <span className="text-slate-400 text-sm font-medium">Total de Produtos</span>
            <span className="text-5xl font-bold text-white">{stats.products}</span>
          </div>
        </div>
      )}
    </div>
  );
}
