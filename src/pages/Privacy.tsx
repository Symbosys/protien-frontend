import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { 
  Users, 
  UserCheck, 
  FileText, 
  Cookie, 
  Lock, 
  Share2, 
  Scale, 
  Mail, 
  Phone
} from 'lucide-react';

export default function Privacy() {
  return (
    <MainLayout>
      <div className="bg-white min-h-screen pb-16">
        
        {/* Banner Section */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-6">
          <div className="relative w-full overflow-hidden rounded-2xl shadow-sm border border-gray-100">
            <img
              src="/privacy-policy.png"
              alt="Privacy Policy"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-12">
          <div className="max-w-4xl space-y-12 text-left">
            
            {/* Who we are */}
            <section id="who-we-are" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <div className="p-2 bg-gray-50 rounded-lg text-[#5BBF3D]">
                  <Users className="h-6 w-6" />
                </div>
                <h2 className="font-display text-3xl font-bold text-black uppercase tracking-wide">
                  Who We Are
                </h2>
              </div>
              <div className="text-gray-600 text-lg lg:text-xl leading-relaxed space-y-4 font-light text-left">
                <p>
                  At Protein and Nutrients, we are passionate about helping people achieve their fitness, health, and performance goals through premium-quality nutrition supplements. Our mission is to provide trusted products that support strength, recovery, endurance, and overall wellness for every lifestyle.
                </p>
                <p>
                  We believe that great results start with great nutrition. That’s why every product is carefully formulated using high-quality ingredients, advanced research, and strict quality standards to ensure effectiveness, safety, and consistency.
                </p>
                <p>
                  Whether you are an athlete, gym enthusiast, or simply focused on living a healthier life, we are committed to supporting your journey with supplements you can rely on every day.
                </p>
              </div>
            </section>

            {/* Customer Information */}
            <section id="customer-info" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <div className="p-2 bg-gray-50 rounded-lg text-[#5BBF3D]">
                  <UserCheck className="h-6 w-6" />
                </div>
                <h2 className="font-display text-3xl font-bold text-black uppercase tracking-wide">
                  Customer Information
                </h2>
              </div>
              <div className="text-gray-600 text-lg lg:text-xl leading-relaxed space-y-4 font-light text-left">
                <p>
                  When you place an order, create an account, subscribe to our newsletter, or contact us through our website, we may collect personal information such as your name, email address, phone number, billing address, and shipping details.
                </p>
                <div>
                  <p className="font-semibold text-black mb-3">This information helps us:</p>
                  <ul className="space-y-2.5">
                    {[
                      "Process and deliver orders",
                      "Provide customer support",
                      "Improve your shopping experience",
                      "Send order updates and promotional offers",
                      "Maintain website security and fraud prevention"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 pl-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#5BBF3D] mt-2.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="font-medium text-black">
                  We respect your privacy and never sell your personal information to third parties.
                </p>
              </div>
            </section>

            {/* Product & Media Content */}
            <section id="media-content" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <div className="p-2 bg-gray-50 rounded-lg text-[#5BBF3D]">
                  <FileText className="h-6 w-6" />
                </div>
                <h2 className="font-display text-3xl font-bold text-black uppercase tracking-wide">
                  Product & Media Content
                </h2>
              </div>
              <div className="text-gray-600 text-lg lg:text-xl leading-relaxed space-y-4 font-light text-left">
                <p>
                  All images, product descriptions, logos, graphics, and content displayed on this website are the property of Protein and Nutrients and are used for informational and promotional purposes only.
                </p>
                <p>
                  We strive to provide accurate product images and descriptions, but actual packaging or appearance may vary slightly depending on manufacturing updates and screen settings.
                </p>
                <p className="font-medium text-black">
                  Unauthorized reproduction, distribution, or misuse of website content is prohibited.
                </p>
              </div>
            </section>

            {/* Cookies */}
            <section id="cookies" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <div className="p-2 bg-gray-50 rounded-lg text-[#5BBF3D]">
                  <Cookie className="h-6 w-6" />
                </div>
                <h2 className="font-display text-3xl font-bold text-black uppercase tracking-wide">
                  Cookies
                </h2>
              </div>
              <div className="text-gray-600 text-lg lg:text-xl leading-relaxed space-y-4 font-light text-left">
                <p>
                  Our website uses cookies and similar technologies to improve functionality, analyze website traffic, and personalize your browsing experience.
                </p>
                <div>
                  <p className="font-semibold text-black mb-3">Cookies help us:</p>
                  <ul className="space-y-2.5">
                    {[
                      "Remember your preferences",
                      "Improve website performance",
                      "Provide relevant product recommendations",
                      "Enhance security and user experience"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 pl-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#5BBF3D] mt-2.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <p>
                  You can disable cookies through your browser settings at any time. However, some website features may not function properly if cookies are disabled.
                </p>
              </div>
            </section>

            {/* Payment Security */}
            <section id="security" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <div className="p-2 bg-gray-50 rounded-lg text-[#5BBF3D]">
                  <Lock className="h-6 w-6" />
                </div>
                <h2 className="font-display text-3xl font-bold text-black uppercase tracking-wide">
                  Payment Security
                </h2>
              </div>
              <div className="text-gray-600 text-lg lg:text-xl leading-relaxed space-y-4 font-light text-left">
                <p>
                  We use secure payment gateways and encrypted technologies to protect your payment and personal information during transactions. Your complete payment details are never stored directly on our servers.
                </p>
              </div>
            </section>

            {/* Third-Party Services */}
            <section id="third-party" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <div className="p-2 bg-gray-50 rounded-lg text-[#5BBF3D]">
                  <Share2 className="h-6 w-6" />
                </div>
                <h2 className="font-display text-3xl font-bold text-black uppercase tracking-wide">
                  Third-Party Services
                </h2>
              </div>
              <div className="text-gray-600 text-lg lg:text-xl leading-relaxed space-y-4 font-light text-left">
                <p>
                  We may use trusted third-party services for:
                </p>
                <ul className="space-y-2.5">
                  {[
                    "Payment processing",
                    "Shipping and delivery",
                    "Website analytics",
                    "Marketing communication"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 pl-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5BBF3D] mt-2.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p>
                  These service providers only access the information necessary to perform their services securely and responsibly.
                </p>
              </div>
            </section>

            {/* Your Rights */}
            <section id="rights" className="scroll-mt-28 space-y-4">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <div className="p-2 bg-gray-50 rounded-lg text-[#5BBF3D]">
                  <Scale className="h-6 w-6" />
                </div>
                <h2 className="font-display text-3xl font-bold text-black uppercase tracking-wide">
                  Your Rights
                </h2>
              </div>
              <div className="text-gray-600 text-lg lg:text-xl leading-relaxed space-y-4 font-light text-left">
                <p>
                  You have the right to:
                </p>
                <ul className="space-y-2.5">
                  {[
                    "Access your personal information",
                    "Request updates or corrections",
                    "Request account or data deletion",
                    "Unsubscribe from marketing emails at any time"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 pl-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5BBF3D] mt-2.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p>
                  For privacy-related requests, please contact our support team.
                </p>
              </div>
            </section>

            {/* Contact Us */}
            <section id="contact" className="scroll-mt-28 space-y-4">
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
                  If you have any questions regarding this Privacy Policy or how your information is handled, please contact us:
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
