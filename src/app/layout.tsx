import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { LayoutDashboard, Megaphone, Package } from "lucide-react";

export const metadata: Metadata = {
  title: "CMS Dashboard",
  description: "Premium CMS Dashboard for Campaigns and Products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex h-screen overflow-hidden antialiased bg-gray-950 text-slate-100 selection:bg-purple-500/30">
        
        {/* Sidebar */}
        <aside className="w-64 glass-panel border-r border-white/5 flex flex-col transition-all duration-300 z-10 relative">
          <div className="p-6 flex items-center gap-3 border-b border-white/5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <LayoutDashboard size={18} className="text-white" />
            </div>
            <h1 className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              CMS Painel
            </h1>
          </div>
          
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 mt-2 px-2">Menu</div>
            
            <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-all group">
              <LayoutDashboard size={20} className="text-slate-400 group-hover:text-purple-400 transition-colors" />
              <span className="font-medium">Dashboard</span>
            </Link>

            <Link href="/campaigns" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-all group">
              <Megaphone size={20} className="text-slate-400 group-hover:text-purple-400 transition-colors" />
              <span className="font-medium">Campanhas</span>
            </Link>

            <Link href="/products" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-all group">
              <Package size={20} className="text-slate-400 group-hover:text-blue-400 transition-colors" />
              <span className="font-medium">Produtos</span>
            </Link>
          </nav>
          
          <div className="p-4 border-t border-white/5">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                <span className="text-xs font-bold text-slate-300">AD</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Admin User</span>
                <span className="text-xs text-slate-500">admin@cms.com</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col relative overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-gray-950 to-gray-950">
          <div className="flex-1 overflow-y-auto p-8 relative z-0">
            {children}
          </div>
        </main>
        
      </body>
    </html>
  );
}
