import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import MobileNav from "./MobileNav";
import CartDrawer from "@/components/cart/CartDrawer";
import WhatsAppButton from "@/components/home/WhatsAppButton";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-hidden">
      <Header />
      <main className="flex-1 pb-20 lg:pb-0 w-full overflow-x-hidden">{children}</main>
      <Footer />
      <MobileNav />
      <CartDrawer />
      <WhatsAppButton />
    </div>
  );
}
