import { PublicNavbar } from "@/components/shared/public-navbar";
import { PublicFooter } from "@/components/shared/public-footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicNavbar />
      <main className="flex-1 mt-20">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
