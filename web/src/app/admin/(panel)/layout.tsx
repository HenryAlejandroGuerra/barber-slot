/* ================================================
    web/src/app/admin/(panel)/layout.tsx
    Layout del panel administrativo
================================================ */
import AdminGuard from "@/components/admin/AdminGuard";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminFooter from "@/components/admin/AdminFooter";

export default function AdminPanelLayout({children}: {children: React.ReactNode;}) {
    return (
        <AdminGuard>
            <div className=" flex min-h-screen flex-col bg-brand-dark text-white">
                <AdminHeader />
                <main className="flex-1">
                    {children}
                </main>
                <AdminFooter />
            </div>
        </AdminGuard>
    );
}
