import ProductForm from "@/components/ProductForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewProductPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
      <header className="pb-6 border-b border-white/10">
        <div className="flex items-center gap-4 mb-2">
          <Link href="/products" className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h2 className="text-3xl font-bold tracking-tight text-white">Novo Produto</h2>
        </div>
        <p className="text-slate-400 ml-10">Preencha os dados abaixo para cadastrar um novo produto.</p>
      </header>

      <div className="pl-10">
        <ProductForm />
      </div>
    </div>
  );
}
