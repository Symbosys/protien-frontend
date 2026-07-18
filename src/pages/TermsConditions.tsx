import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { 
  BookOpen, 
  Globe, 
  ShoppingBag, 
  CreditCard, 
  Truck, 
  RotateCcw, 
  Shield, 
  Ban, 
  Lock, 
  FileText, 
  Mail, 
  Phone
} from 'lucide-react';

export default function TermsConditions() {
  return (
    <MainLayout>
      <div className="bg-white min-h-screen pb-16">
        
        {/* Banner Section */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-6">
          <div className="relative w-full overflow-hidden rounded-2xl shadow-sm border border-gray-100">
            <img
              src="/terms-conditions.png"
              alt="Terms & Conditions"
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
                  <BookOpen className="h-6 w-6" />
                </div>
                <h2 className="font-display text-3xl font-bold text-black uppercase tracking-wide">
                  Overview
                </h2>
              </div>
              <div className="text-gray-600 text-lg lg:text-xl leading-relaxed space-y-4 font-light text-left">
                <p>
                  Welcome to Protein and Nutrients. By accessing our website, placing an order, or using our services, you agree to comply with the following Terms & Conditions.
                </p>
                <p>
                  These terms are designed to ensure a secure, fair, and transparent experience for all customers using our platform.
                </p>
                <p>
                  If you do not agree with any part of these terms, please discontinue the use of our website and services.
                </p>
              </div>
            </section>

            {/* Website Use */}
            <section id="website-use" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <div className="p-2 bg-gray-50 rounded-lg text-[#5BBF3D]">
                  <Globe className="h-6 w-6" />
                </div>
                <h2 className="font-display text-3xl font-bold text-black uppercase tracking-wide">
                  Website Use
                </h2>
              </div>
              <div className="text-gray-600 text-lg lg:text-xl leading-relaxed space-y-4 font-light text-left">
                <p>By using this website, you agree:</p>
                <ul className="space-y-2.5">
                  {[
                    "To use the website only for lawful purposes",
                    "Not to misuse, disrupt, or attempt unauthorized access to the website",
                    "Not to copy, reproduce, or exploit website content without permission",
                    "To provide accurate and complete information when placing orders"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 pl-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5BBF3D] mt-2.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p>
                  Protein and Nutrients reserves the right to restrict or terminate access for users violating these terms.
                </p>
              </div>
            </section>

            {/* Products & Information */}
            <section id="products-info" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <div className="p-2 bg-gray-50 rounded-lg text-[#5BBF3D]">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <h2 className="font-display text-3xl font-bold text-black uppercase tracking-wide">
                  Products & Information
                </h2>
              </div>
              <div className="text-gray-600 text-lg lg:text-xl leading-relaxed space-y-4 font-light text-left">
                <p>
                  We strive to ensure that all product descriptions, images, pricing, and information displayed on our website are accurate and up to date.
                </p>
                <p className="font-semibold text-black">However:</p>
                <ul className="space-y-2.5">
                  {[
                    "Product packaging may vary slightly from displayed images",
                    "Prices and availability may change without notice",
                    "Typographical or technical errors may occasionally occur"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 pl-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5BBF3D] mt-2.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p>
                  Protein and Nutrients reserves the right to correct errors or update information at any time without prior notice.
                </p>
              </div>
            </section>

            {/* Orders & Payments */}
            <section id="orders-payments" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <div className="p-2 bg-gray-50 rounded-lg text-[#5BBF3D]">
                  <CreditCard className="h-6 w-6" />
                </div>
                <h2 className="font-display text-3xl font-bold text-black uppercase tracking-wide">
                  Orders & Payments
                </h2>
              </div>
              <div className="text-gray-600 text-lg lg:text-xl leading-relaxed space-y-4 font-light text-left">
                <p className="font-semibold text-black">By placing an order:</p>
                <ul className="space-y-2.5">
                  {[
                    "You confirm that all provided information is accurate",
                    "You authorize payment through the selected payment method",
                    "Orders are subject to product availability and verification"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 pl-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5BBF3D] mt-2.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="font-semibold text-black pt-2">We reserve the right to:</p>
                <ul className="space-y-2.5">
                  {[
                    "Cancel suspicious or fraudulent orders",
                    "Refuse service in certain situations",
                    "Limit purchase quantities if necessary"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 pl-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5BBF3D] mt-2.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Shipping & Delivery */}
            <section id="shipping-delivery" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <div className="p-2 bg-gray-50 rounded-lg text-[#5BBF3D]">
                  <Truck className="h-6 w-6" />
                </div>
                <h2 className="font-display text-3xl font-bold text-black uppercase tracking-wide">
                  Shipping & Delivery
                </h2>
              </div>
              <div className="text-gray-600 text-lg lg:text-xl leading-relaxed space-y-4 font-light text-left">
                <p>
                  Delivery timelines are estimated and may vary depending on location, courier operations, and external factors.
                </p>
                <p className="font-semibold text-black">Protein and Nutrients is not responsible for delays caused by:</p>
                <ul className="space-y-2.5">
                  {[
                    "Courier disruptions",
                    "Incorrect customer information",
                    "Natural events or unforeseen circumstances"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 pl-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5BBF3D] mt-2.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p>
                  Customers are responsible for providing accurate shipping details.
                </p>
              </div>
            </section>

            {/* Returns & Refunds */}
            <section id="returns-refunds" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <div className="p-2 bg-gray-50 rounded-lg text-[#5BBF3D]">
                  <RotateCcw className="h-6 w-6" />
                </div>
                <h2 className="font-display text-3xl font-bold text-black uppercase tracking-wide">
                  Returns & Refunds
                </h2>
              </div>
              <div className="text-gray-600 text-lg lg:text-xl leading-relaxed space-y-4 font-light text-left">
                <p>
                  Returns, replacements, and refunds are subject to our Return & Refund Policy.
                </p>
                <p>
                  Certain products, including opened supplement containers, may not qualify for returns due to hygiene and safety reasons.
                </p>
              </div>
            </section>

            {/* Intellectual Property */}
            <section id="intellectual-property" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <div className="p-2 bg-gray-50 rounded-lg text-[#5BBF3D]">
                  <Shield className="h-6 w-6" />
                </div>
                <h2 className="font-display text-3xl font-bold text-black uppercase tracking-wide">
                  Intellectual Property
                </h2>
              </div>
              <div className="text-gray-600 text-lg lg:text-xl leading-relaxed space-y-4 font-light text-left">
                <p className="font-semibold text-black">All content on this website, including:</p>
                <ul className="space-y-2.5">
                  {[
                    "Logos",
                    "Product images",
                    "Graphics",
                    "Text",
                    "Website design"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 pl-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5BBF3D] mt-2.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p>
                  is the property of Protein and Nutrients and protected under applicable intellectual property laws.
                </p>
                <p>
                  Unauthorized use or reproduction is prohibited.
                </p>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section id="liability" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <div className="p-2 bg-gray-50 rounded-lg text-[#5BBF3D]">
                  <Ban className="h-6 w-6" />
                </div>
                <h2 className="font-display text-3xl font-bold text-black uppercase tracking-wide">
                  Limitation of Liability
                </h2>
              </div>
              <div className="text-gray-600 text-lg lg:text-xl leading-relaxed space-y-4 font-light text-left">
                <p className="font-semibold text-black">Protein and Nutrients shall not be held liable for:</p>
                <ul className="space-y-2.5">
                  {[
                    "Indirect or incidental damages",
                    "Losses caused by misuse of products",
                    "Website interruptions or technical issues",
                    "Delays beyond our control"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 pl-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5BBF3D] mt-2.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p>
                  Customers are advised to use supplements responsibly and follow product instructions carefully.
                </p>
              </div>
            </section>

            {/* Privacy */}
            <section id="privacy" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <div className="p-2 bg-gray-50 rounded-lg text-[#5BBF3D]">
                  <Lock className="h-6 w-6" />
                </div>
                <h2 className="font-display text-3xl font-bold text-black uppercase tracking-wide">
                  Privacy
                </h2>
              </div>
              <div className="text-gray-600 text-lg lg:text-xl leading-relaxed space-y-4 font-light text-left">
                <p>
                  Your use of our website is also governed by our Privacy Policy, which explains how we collect, use, and protect customer information.
                </p>
              </div>
            </section>

            {/* Modifications to Terms */}
            <section id="modifications" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <div className="p-2 bg-gray-50 rounded-lg text-[#5BBF3D]">
                  <FileText className="h-6 w-6" />
                </div>
                <h2 className="font-display text-3xl font-bold text-black uppercase tracking-wide">
                  Modifications to Terms
                </h2>
              </div>
              <div className="text-gray-600 text-lg lg:text-xl leading-relaxed space-y-4 font-light text-left">
                <p>
                  Protein and Nutrients reserves the right to update or modify these Terms & Conditions at any time without prior notice.
                </p>
                <p>
                  Changes will become effective immediately upon publication on this page.
                </p>
              </div>
            </section>

            {/* Governing Law */}
            <section id="governing-law" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <div className="p-2 bg-gray-50 rounded-lg text-[#5BBF3D]">
                  <Globe className="h-6 w-6" />
                </div>
                <h2 className="font-display text-3xl font-bold text-black uppercase tracking-wide">
                  Governing Law
                </h2>
              </div>
              <div className="text-gray-600 text-lg lg:text-xl leading-relaxed space-y-4 font-light text-left">
                <p>
                  These Terms & Conditions shall be governed and interpreted in accordance with the laws of India.
                </p>
                <p>
                  Any disputes arising from website use or purchases shall be subject to the jurisdiction of the appropriate courts.
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
                  For questions regarding these Terms & Conditions, please contact:
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
