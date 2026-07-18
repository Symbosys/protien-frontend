import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { 
  Truck, 
  Clock, 
  MapPin, 
  CreditCard, 
  Search, 
  AlertTriangle, 
  ShieldAlert, 
  Globe, 
  Mail, 
  Phone 
} from 'lucide-react';

export default function ShippingDelivery() {
  return (
    <MainLayout>
      <div className="bg-white min-h-screen pb-16">
        
        {/* Banner Section */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-6">
          <div className="relative w-full overflow-hidden rounded-2xl shadow-sm border border-gray-100">
            <img
              src="/shipping-delivery.png"
              alt="Shipping Policies"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-12">
          <div className="max-w-4xl space-y-12 text-left">
            
            {/* Overview */}
            <section id="overview" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <div className="p-2 bg-gray-50 rounded-lg text-[#5BBF3D]">
                  <Truck className="h-6 w-6" />
                </div>
                <h2 className="font-display text-3xl font-bold text-black uppercase tracking-wide">
                  Overview
                </h2>
              </div>
              <div className="text-gray-600 text-lg lg:text-xl leading-relaxed space-y-4 font-light text-left">
                <p>
                  At Protein and Nutrients, we aim to process and deliver all orders efficiently to ensure a smooth shopping experience. Orders are carefully packed and shipped using trusted delivery partners to maintain product quality and safety during transit.
                </p>
                <p>
                  Shipping timelines may vary depending on your location, product availability, weather conditions, or courier service operations.
                </p>
              </div>
            </section>

            {/* Order Processing */}
            <section id="order-processing" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <div className="p-2 bg-gray-50 rounded-lg text-[#5BBF3D]">
                  <Clock className="h-6 w-6" />
                </div>
                <h2 className="font-display text-3xl font-bold text-black uppercase tracking-wide">
                  Order Processing
                </h2>
              </div>
              <div className="text-gray-600 text-lg lg:text-xl leading-relaxed space-y-4 font-light text-left">
                <p>
                  All orders are usually processed within 1–3 business days after payment confirmation.
                </p>
                <p>
                  Orders placed on weekends or public holidays may be processed on the next working business day.
                </p>
                <p>
                  Once your order has been shipped, you will receive a shipping confirmation message or email along with tracking details.
                </p>
              </div>
            </section>

            {/* Shipping Timelines */}
            <section id="shipping-timelines" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <div className="p-2 bg-gray-50 rounded-lg text-[#5BBF3D]">
                  <MapPin className="h-6 w-6" />
                </div>
                <h2 className="font-display text-3xl font-bold text-black uppercase tracking-wide">
                  Shipping Timelines
                </h2>
              </div>
              <div className="text-gray-600 text-lg lg:text-xl leading-relaxed space-y-4 font-light text-left">
                <p>Estimated delivery timelines:</p>
                <ul className="space-y-2.5">
                  {[
                    "Metro Cities: 5–7 business days",
                    "Other Cities & Towns: 5–7 business days",
                    "Remote Areas: 5–7 business days"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 pl-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5BBF3D] mt-2.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p>
                  Please note that delivery timelines are estimates and may occasionally be delayed due to external factors beyond our control.
                </p>
              </div>
            </section>

            {/* Shipping Charges */}
            <section id="shipping-charges" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <div className="p-2 bg-gray-50 rounded-lg text-[#5BBF3D]">
                  <CreditCard className="h-6 w-6" />
                </div>
                <h2 className="font-display text-3xl font-bold text-black uppercase tracking-wide">
                  Shipping Charges
                </h2>
              </div>
              <div className="text-gray-600 text-lg lg:text-xl leading-relaxed space-y-4 font-light text-left">
                <p>
                  Shipping charges, if applicable, will be displayed during checkout before payment confirmation.
                </p>
                <p className="font-semibold text-black">We may offer:</p>
                <ul className="space-y-2.5">
                  {[
                    "Free shipping on selected orders",
                    "Promotional shipping offers during campaigns or sales"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 pl-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5BBF3D] mt-2.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p>
                  Shipping charges are non-refundable unless our side caused the issue.
                </p>
              </div>
            </section>

            {/* Order Tracking */}
            <section id="order-tracking" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <div className="p-2 bg-gray-50 rounded-lg text-[#5BBF3D]">
                  <Search className="h-6 w-6" />
                </div>
                <h2 className="font-display text-3xl font-bold text-black uppercase tracking-wide">
                  Order Tracking
                </h2>
              </div>
              <div className="text-gray-600 text-lg lg:text-xl leading-relaxed space-y-4 font-light text-left">
                <p>
                  Once your order is dispatched, tracking information will be shared via email, SMS, or WhatsApp.
                </p>
                <p>
                  Customers can use the tracking details to monitor shipment progress directly through the courier partner’s website.
                </p>
              </div>
            </section>

            {/* Delayed or Failed Deliveries */}
            <section id="delayed-failed" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <div className="p-2 bg-gray-50 rounded-lg text-[#5BBF3D]">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <h2 className="font-display text-3xl font-bold text-black uppercase tracking-wide">
                  Delayed or Failed Deliveries
                </h2>
              </div>
              <div className="text-gray-600 text-lg lg:text-xl leading-relaxed space-y-4 font-light text-left">
                <p className="font-semibold text-black">Delivery delays may occur due to:</p>
                <ul className="space-y-2.5">
                  {[
                    "Incorrect shipping information",
                    "Weather conditions",
                    "Public holidays",
                    "Courier operational issues",
                    "Remote delivery locations"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 pl-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5BBF3D] mt-2.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p>
                  If a delivery attempt fails due to incorrect customer information or repeated unavailability, re-shipping charges may apply.
                </p>
              </div>
            </section>

            {/* Damaged Packages */}
            <section id="damaged-packages" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <div className="p-2 bg-gray-50 rounded-lg text-[#5BBF3D]">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <h2 className="font-display text-3xl font-bold text-black uppercase tracking-wide">
                  Damaged Packages
                </h2>
              </div>
              <div className="text-gray-600 text-lg lg:text-xl leading-relaxed space-y-4 font-light text-left">
                <p className="font-semibold text-black">If your package appears damaged during delivery:</p>
                <ul className="space-y-2.5">
                  {[
                    "Do not accept tampered packages if possible",
                    "Take clear photos of the package",
                    "Contact our support team within 48 hours"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 pl-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5BBF3D] mt-2.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p>
                  We will investigate the issue and assist accordingly.
                </p>
              </div>
            </section>

            {/* International Shipping */}
            <section id="international-shipping" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <div className="p-2 bg-gray-50 rounded-lg text-[#5BBF3D]">
                  <Globe className="h-6 w-6" />
                </div>
                <h2 className="font-display text-3xl font-bold text-black uppercase tracking-wide">
                  International Shipping
                </h2>
              </div>
              <div className="text-gray-600 text-lg lg:text-xl leading-relaxed space-y-4 font-light text-left">
                <p>
                  Currently, Protein and Nutrients may only ship within India. International shipping availability may vary and will be updated on our website when applicable.
                </p>
              </div>
            </section>

            {/* Contact Us */}
            <section id="contact-us" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <div className="p-2 bg-gray-50 rounded-lg text-[#5BBF3D]">
                  <Mail className="h-6 w-6" />
                </div>
                <h2 className="font-display text-3xl font-bold text-black uppercase tracking-wide">
                  Contact Us
                </h2>
              </div>
              <div className="text-gray-600 text-lg lg:text-xl leading-relaxed space-y-6 font-light text-left">
                <p>
                  For shipping-related support or delivery questions, please contact us:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a href="mailto:akkigupta2411@gmail.com" className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 border border-gray-100 transition-colors group">
                    <Mail className="h-5 w-5 text-[#5BBF3D]" />
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Email Us</p>
                      <p className="text-sm font-semibold text-black group-hover:text-[#5BBF3D] transition-colors">akkigupta2411@gmail.com</p>
                    </div>
                  </a>
                  
                  <a href="tel:+916200065378" className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 border border-gray-100 transition-colors group">
                    <Phone className="h-5 w-5 text-[#5BBF3D]" />
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Call Us</p>
                      <p className="text-sm font-semibold text-black group-hover:text-[#5BBF3D] transition-colors">+91 6200065378</p>
                    </div>
                  </a>
                </div>
              </div>
            </section>

          </div>
        </div>

      </div>
    </MainLayout>
  );
}
