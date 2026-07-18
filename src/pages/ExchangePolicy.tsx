import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { 
  RotateCcw, 
  CheckCircle, 
  Ban, 
  HelpCircle, 
  Truck, 
  CheckSquare, 
  PackageSearch, 
  Mail, 
  Phone 
} from 'lucide-react';

export default function ExchangePolicy() {
  return (
    <MainLayout>
      <div className="bg-white min-h-screen pb-16">
        
        {/* Banner Section */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-6">
          <div className="relative w-full overflow-hidden rounded-2xl shadow-sm border border-gray-100">
            <img
              src="/exchange-policy.png"
              alt="Exchange Policy"
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
                  <RotateCcw className="h-6 w-6" />
                </div>
                <h2 className="font-display text-3xl font-bold text-black uppercase tracking-wide">
                  Overview
                </h2>
              </div>
              <div className="text-gray-600 text-lg lg:text-xl leading-relaxed space-y-4 font-light text-left">
                <p>
                  At Protein and Nutrients, we take great care in delivering premium-quality supplements in perfect condition. If you receive a damaged, defective, or incorrect product, you may request an exchange according to the policy outlined below.
                </p>
                <p>
                  Exchange requests are subject to product inspection, availability, and approval by our support team.
                </p>
              </div>
            </section>

            {/* Eligibility For Exchange */}
            <section id="eligibility" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <div className="p-2 bg-gray-50 rounded-lg text-[#5BBF3D]">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h2 className="font-display text-3xl font-bold text-black uppercase tracking-wide">
                  Eligibility For Exchange
                </h2>
              </div>
              <div className="text-gray-600 text-lg lg:text-xl leading-relaxed space-y-4 font-light text-left">
                <p className="font-semibold text-black">Products may qualify for exchange if:</p>
                <ul className="space-y-2.5">
                  {[
                    "The wrong item was delivered",
                    "The product arrived damaged or leaking",
                    "The product is defective or expired",
                    "The issue is reported within 48 hours of delivery"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 pl-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5BBF3D] mt-2.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="font-semibold text-black mt-6">To be eligible:</p>
                <ul className="space-y-2.5">
                  {[
                    "The product must remain unused",
                    "Original packaging must be intact",
                    "Proof of purchase or order confirmation is required"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 pl-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5BBF3D] mt-2.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Non-Exchangeable Items */}
            <section id="non-exchangeable" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <div className="p-2 bg-gray-50 rounded-lg text-[#5BBF3D]">
                  <Ban className="h-6 w-6" />
                </div>
                <h2 className="font-display text-3xl font-bold text-black uppercase tracking-wide">
                  Non-Exchangeable Items
                </h2>
              </div>
              <div className="text-gray-600 text-lg lg:text-xl leading-relaxed space-y-4 font-light text-left">
                <p className="font-semibold text-black">The following items are not eligible for exchange:</p>
                <ul className="space-y-2.5">
                  {[
                    "Opened or used supplement containers",
                    "Products damaged after delivery",
                    "Clearance or promotional sale items",
                    "Gift cards or digital products",
                    "Products without original packaging"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 pl-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5BBF3D] mt-2.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-[#5BBF3D] font-medium">
                  For hygiene and safety reasons, opened nutrition and supplement products cannot be exchanged.
                </p>
              </div>
            </section>

            {/* Exchange Process */}
            <section id="exchange-process" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <div className="p-2 bg-gray-50 rounded-lg text-[#5BBF3D]">
                  <HelpCircle className="h-6 w-6" />
                </div>
                <h2 className="font-display text-3xl font-bold text-black uppercase tracking-wide">
                  Exchange Process
                </h2>
              </div>
              <div className="text-gray-600 text-lg lg:text-xl leading-relaxed space-y-4 font-light text-left">
                <p className="font-semibold text-black">To request an exchange:</p>
                <ul className="space-y-2.5">
                  {[
                    "Contact our support team within the eligible time period",
                    "Share your order number and issue details",
                    "Provide clear photos of the product and packaging",
                    "Wait for approval and exchange instructions"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 pl-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5BBF3D] mt-2.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p>
                  Once approved, our team will arrange the replacement process.
                </p>
              </div>
            </section>

            {/* Shipping For Exchanges */}
            <section id="shipping" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <div className="p-2 bg-gray-50 rounded-lg text-[#5BBF3D]">
                  <Truck className="h-6 w-6" />
                </div>
                <h2 className="font-display text-3xl font-bold text-black uppercase tracking-wide">
                  Shipping For Exchanges
                </h2>
              </div>
              <div className="text-gray-600 text-lg lg:text-xl leading-relaxed space-y-4 font-light text-left">
                <p className="font-semibold text-black">If the exchange is approved due to:</p>
                <ul className="space-y-2.5">
                  {[
                    "Wrong product delivery",
                    "Damaged items",
                    "Manufacturing defects"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 pl-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5BBF3D] mt-2.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p>
                  Protein and Nutrients may cover the exchange shipping costs.
                </p>
                <p>
                  Additional shipping charges may apply for exchanges requested for other reasons.
                </p>
              </div>
            </section>

            {/* Exchange Approval */}
            <section id="approval" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <div className="p-2 bg-gray-50 rounded-lg text-[#5BBF3D]">
                  <CheckSquare className="h-6 w-6" />
                </div>
                <h2 className="font-display text-3xl font-bold text-black uppercase tracking-wide">
                  Exchange Approval
                </h2>
              </div>
              <div className="text-gray-600 text-lg lg:text-xl leading-relaxed space-y-4 font-light text-left">
                <p>
                  All exchange requests are reviewed individually. Protein and Nutrients reserves the right to reject exchange requests if:
                </p>
                <ul className="space-y-2.5">
                  {[
                    "The product has been opened or used",
                    "The request is submitted after the allowed period",
                    "The product condition does not meet exchange requirements"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 pl-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5BBF3D] mt-2.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Product Availability */}
            <section id="availability" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <div className="p-2 bg-gray-50 rounded-lg text-[#5BBF3D]">
                  <PackageSearch className="h-6 w-6" />
                </div>
                <h2 className="font-display text-3xl font-bold text-black uppercase tracking-wide">
                  Product Availability
                </h2>
              </div>
              <div className="text-gray-600 text-lg lg:text-xl leading-relaxed space-y-4 font-light text-left">
                <p>
                  Exchanges are subject to stock availability. If the requested replacement product is unavailable, we may:
                </p>
                <ul className="space-y-2.5">
                  {[
                    "Offer an alternative product",
                    "Provide store credit",
                    "Process a refund if applicable"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 pl-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5BBF3D] mt-2.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
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
                  For exchange-related assistance, please contact:
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
