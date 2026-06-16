"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/services/api";
import { Product } from "@/types";
import ProductForm from "@/components/ProductForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const products = await api.getProducts();
        const found = products.find(p => p.id === id);
        if (found) {
          setProduct(found);
        } else {
          router.push("/products");
        }
      } catch (error) {
        console.error(error);
        router.push("/products");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      loadProduct();
    }
  }, [id, router]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
      <header className="pb-6 border-b border-white/10">
        <div className="flex items-center gap-4 mb-2">
          <Link href="/products" className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h2 className="text-3xl font-bold tracking-tight text-white">Editar Produto</h2>
        </div>
        <p className="text-slate-400 ml-10">Atualize os dados do produto selecionado.</p>
      </header>

      <div className="pl-10">
        {loading ? (
          <div className="flex py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : product ? (
          <ProductForm initialData={product} isEdit />
        ) : null}
      </div>
    </div>
  );
}
