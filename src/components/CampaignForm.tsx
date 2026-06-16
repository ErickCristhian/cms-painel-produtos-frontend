"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Campaign, SocialAccount } from "@/types";
import { api } from "@/services/api";
import { Plus, Trash2 } from "lucide-react";

interface CampaignFormProps {
  initialData?: Campaign;
  isEdit?: boolean;
}

export default function CampaignForm({ initialData, isEdit }: CampaignFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
  });
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>(initialData?.socialAccounts || []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
      });
      setImageUrl(initialData.imageUrl || "");
      setSocialAccounts(initialData.socialAccounts || []);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const campaignData = {
      ...formData,
      imageUrl: imageUrl || null,
      socialAccounts,
    };
    try {
      if (isEdit && initialData) {
        await api.updateCampaign(initialData.id, campaignData);
      } else {
        await api.createCampaign(campaignData);
      }
      router.push("/campaigns");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar campanha.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAccountChange = (id: string, field: keyof SocialAccount, value: string) => {
    setSocialAccounts((prev) =>
      prev.map((acc) => (acc.id === id ? { ...acc, [field]: value } : acc))
    );
  };

  const addAccount = () => {
    setSocialAccounts((prev) => [
      ...prev,
      { id: Date.now().toString(), networkName: "", email: "", username: "", password: "" },
    ]);
  };

  const removeAccount = (id: string) => {
    setSocialAccounts((prev) => prev.filter((acc) => acc.id !== id));
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-2xl max-w-4xl">
      <div className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
            Nome da Campanha
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">
            Descrição
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            placeholder="Descreva o propósito da campanha..."
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">URL da Imagem de Capa (Opcional)</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            placeholder="https://exemplo.com/imagem.jpg"
          />
          {imageUrl && (
            <div className="mt-4 rounded-xl overflow-hidden border border-slate-700/50 h-48 w-full max-w-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="Preview da capa" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* Redes Sociais */}
        <div className="pt-4 border-t border-white/10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-white">Contas de Redes Sociais</h3>
            <button
              type="button"
              onClick={addAccount}
              className="flex items-center gap-2 text-sm bg-purple-600/20 text-purple-400 hover:bg-purple-600/40 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Plus size={16} /> Adicionar Conta
            </button>
          </div>

          <div className="space-y-4">
            {socialAccounts.length === 0 ? (
              <p className="text-sm text-slate-500 italic">Nenhuma conta adicionada.</p>
            ) : (
              socialAccounts.map((acc, index) => (
                <div key={acc.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start bg-slate-900/30 p-4 rounded-lg border border-slate-800">
                  <div className="md:col-span-3">
                    <label className="block text-xs text-slate-400 mb-1">Rede (Ex: Instagram)</label>
                    <input
                      type="text"
                      required
                      value={acc.networkName}
                      onChange={(e) => handleAccountChange(acc.id, "networkName", e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-xs text-slate-400 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={acc.email}
                      onChange={(e) => handleAccountChange(acc.id, "email", e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-xs text-slate-400 mb-1">Usuário / Login</label>
                    <input
                      type="text"
                      required
                      value={acc.username}
                      onChange={(e) => handleAccountChange(acc.id, "username", e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs text-slate-400 mb-1">Senha</label>
                    <input
                      type="text"
                      required
                      value={acc.password || ""}
                      onChange={(e) => handleAccountChange(acc.id, "password", e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                    />
                  </div>
                  <div className="md:col-span-1 flex justify-end items-center pt-5">
                    <button
                      type="button"
                      onClick={() => removeAccount(acc.id)}
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      title="Remover conta"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 rounded-lg font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-lg font-medium bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-purple-500/20 flex items-center gap-2"
          >
            {loading && <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />}
            {isEdit ? "Salvar Alterações" : "Criar Campanha"}
          </button>
        </div>
      </div>
    </form>
  );
}
