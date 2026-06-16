"use client";

import { useEffect, useState } from "react";
import { Campaign } from "@/types";
import { api } from "@/services/api";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const data = await api.getCampaigns();
      setCampaigns(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta campanha? Todos os produtos associados a ela também serão excluídos.")) return;
    try {
      await api.deleteCampaign(id);
      await loadCampaigns();
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir campanha.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-center pb-6 border-b border-white/10">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Campanhas</h2>
          <p className="text-slate-400 mt-1">Gerencie suas campanhas e eventos.</p>
        </div>
        <Link
          href="/campaigns/new"
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-purple-500/20"
        >
          <Plus size={18} />
          Nova Campanha
        </Link>
      </header>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">📢</span>
          </div>
          <h3 className="text-xl font-medium text-white mb-2">Nenhuma campanha encontrada</h3>
          <p className="text-slate-400 max-w-sm mb-6">Comece criando sua primeira campanha para organizar seus produtos.</p>
          <Link
            href="/campaigns/new"
            className="text-purple-400 hover:text-purple-300 font-medium"
          >
            Criar primeira campanha
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="glass-panel rounded-2xl overflow-hidden flex flex-col transition-all hover:border-purple-500/30 group">
              {campaign.imageUrl && (
                <div className="h-32 w-full overflow-hidden bg-slate-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={campaign.imageUrl} alt={campaign.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
              )}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors">{campaign.name}</h3>
                </div>
                <p className="text-slate-400 text-sm mb-4 flex-1 line-clamp-2">{campaign.description}</p>
                
                <div className="text-xs font-medium text-slate-500 mb-6 bg-slate-900/50 p-2 rounded-lg inline-block self-start">
                  {campaign.socialAccounts?.length || 0} contas vinculadas
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    href={`/campaigns/${campaign.id}`}
                    className="px-3 py-1.5 text-sm font-medium bg-purple-600/20 text-purple-300 hover:bg-purple-600/40 rounded-lg transition-colors mr-auto"
                  >
                    Visualizar
                  </Link>
                  <button
                    onClick={() => handleDelete(campaign.id)}
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
