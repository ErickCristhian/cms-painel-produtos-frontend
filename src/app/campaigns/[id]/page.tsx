"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/services/api";
import { Campaign } from "@/types";
import CampaignForm from "@/components/CampaignForm";
import Link from "next/link";
import { ArrowLeft, Edit2, Key, Mail, User, Globe } from "lucide-react";

export default function CampaignViewPage() {
  const { id } = useParams();
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadCampaign = async () => {
      try {
        const campaigns = await api.getCampaigns();
        const found = campaigns.find(c => c.id === id);
        if (found) {
          setCampaign(found);
        } else {
          router.push("/campaigns");
        }
      } catch (error) {
        console.error(error);
        router.push("/campaigns");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      loadCampaign();
    }
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!campaign) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
      <header className="flex justify-between items-end pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Link href="/campaigns" className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h2 className="text-3xl font-bold tracking-tight text-white">
              {isEditing ? "Editar Campanha" : campaign.name}
            </h2>
          </div>
          <p className="text-slate-400 ml-10">
            {isEditing ? "Atualize os dados da campanha selecionada." : "Detalhes e contas vinculadas à campanha."}
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Edit2 size={16} /> Editar
          </button>
        )}
      </header>

      <div className="pl-10">
        {isEditing ? (
          <CampaignForm initialData={campaign} isEdit />
        ) : (
          <div className="space-y-8 max-w-4xl">
            {campaign.imageUrl && (
              <div className="w-full h-64 rounded-2xl overflow-hidden bg-slate-800 relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={campaign.imageUrl} alt={campaign.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
            )}

            {/* Informações Básicas */}
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-lg font-semibold text-white mb-4 border-b border-white/10 pb-2">Informações da Campanha</h3>
              <div className="space-y-4">
                <div>
                  <span className="block text-sm text-slate-400 mb-1">Nome</span>
                  <p className="text-white font-medium">{campaign.name}</p>
                </div>
                <div>
                  <span className="block text-sm text-slate-400 mb-1">Descrição</span>
                  <p className="text-slate-300 whitespace-pre-wrap">{campaign.description}</p>
                </div>
              </div>
            </div>

            {/* Contas de Redes Sociais */}
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-lg font-semibold text-white mb-4 border-b border-white/10 pb-2">Contas de Redes Sociais</h3>
              
              {!campaign.socialAccounts || campaign.socialAccounts.length === 0 ? (
                <p className="text-slate-400 italic">Nenhuma conta vinculada a esta campanha.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {campaign.socialAccounts.map((acc) => (
                    <div key={acc.id} className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 flex flex-col gap-3">
                      <div className="flex items-center gap-2 text-purple-400 font-medium mb-1">
                        <Globe size={16} />
                        {acc.networkName}
                      </div>
                      
                      <div className="flex items-center gap-3 text-sm text-slate-300">
                        <Mail size={14} className="text-slate-500" />
                        <span className="truncate">{acc.email}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-sm text-slate-300">
                        <User size={14} className="text-slate-500" />
                        <span>{acc.username}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-sm text-slate-300 bg-slate-950 p-2 rounded-md mt-1 border border-slate-800">
                        <Key size={14} className="text-slate-500 flex-shrink-0" />
                        <span className="font-mono text-xs">{acc.password || "Sem senha"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
