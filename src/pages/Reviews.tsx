import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, MessageCircle, Heart, ShieldCheck, ArrowLeft } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

const allReviews = [
  {
    id: 1,
    name: "Alex Smith",
    location: "Mumbai, Maharashtra",
    date: "June 24, 2026",
    text: "One of the most reliable supplement stores online. The best part is the quality of their whey protein—mixes perfectly every time.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120",
    rating: 5,
    product: "Optimum Nutrition Whey Protein",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    location: "Bangalore, Karnataka",
    date: "June 18, 2026",
    text: "Thank you P&N for the fast shipping. The pre-workout has given me exactly the boost I needed for my heavy lift days.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120",
    rating: 5,
    product: "C4 Pre-Workout",
  },
  {
    id: 3,
    name: "Marcus Rodriguez",
    location: "Delhi, NCR",
    date: "May 29, 2026",
    text: "Best and right place for authentic supplements at the best price. A completely convincing experience from product range to support. Extremely happy with my purchase.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120",
    rating: 5,
    product: "HK Vitals Multivitamin",
  },
  {
    id: 4,
    name: "Emily Chen",
    location: "Pune, Maharashtra",
    date: "May 12, 2026",
    text: "I've always been particular about my BCAAs and this is my place to be. The flavor profiles are incredible. Highly recommended!",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120",
    rating: 5,
    product: "Scivation Xtend BCAA",
  },
  {
    id: 5,
    name: "David Kumar",
    location: "Hyderabad, Telangana",
    date: "April 20, 2026",
    text: "Very professional staff and transparent pricing. The subscription model is very straightforward and helps me save money. Recommending P&N to all my gym buddies.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120",
    rating: 5,
    product: "P&N Elite Membership",
  },
  {
    id: 6,
    name: "Priya Sharma",
    location: "Chennai, Tamil Nadu",
    date: "March 05, 2026",
    text: "Purchased the mass gainer last month. The macros are perfect and it doesn't leave me feeling bloated. Customer service was excellent in assisting with shipping.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120",
    rating: 5,
    product: "GNC Pro Performance Mass Gainer",
  },
];

export default function Reviews() {
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const filteredReviews = filterRating 
    ? allReviews.filter(r => r.rating === filterRating)
    : allReviews;

  return (
    <MainLayout>
      <div className="bg-background min-h-screen pb-16">
        
        {/* Top Header */}
        <div className="text-center pt-16 pb-8">
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-primary tracking-widest uppercase">
            Customer Reviews
          </h1>
          <div className="w-16 h-1 bg-accent mx-auto mt-4" />
        </div>

        {/* Rating Summary Bar */}
        <div className="max-w-4xl mx-auto px-4 mb-12">
          <div className="bg-white border border-input rounded-xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
            
            {/* Average Rating Card */}
            <div className="text-center md:border-r border-[#E5D5B5]/60 md:pr-10 flex-shrink-0">
              <span className="block text-4xl lg:text-5xl font-extrabold text-primary">4.9</span>
              <div className="flex gap-0.5 justify-center my-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>
              <span className="text-[10px] uppercase tracking-widest text-[#888] font-bold">
                Based on 150+ Reviews
              </span>
            </div>

            {/* Rating Details Progress Bars */}
            <div className="flex-1 w-full max-w-md space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-[#555] w-12">5 Star</span>
                <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-accent" style={{ width: '95%' }} />
                </div>
                <span className="text-xs font-bold text-primary w-8 text-right">95%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-[#555] w-12">4 Star</span>
                <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-accent" style={{ width: '5%' }} />
                </div>
                <span className="text-xs font-bold text-primary w-8 text-right">5%</span>
              </div>
              <div className="flex items-center gap-3 text-[#888]">
                <span className="text-xs font-semibold w-12">3 Star</span>
                <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-accent" style={{ width: '0%' }} />
                </div>
                <span className="text-xs font-bold w-8 text-right">0%</span>
              </div>
            </div>

          </div>
        </div>

        {/* Reviews Grid */}
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredReviews.map((review) => (
              <div 
                key={review.id} 
                className="bg-white border border-input rounded-xl p-6 relative shadow-sm hover:shadow-medium transition-all flex flex-col justify-between"
              >
                {/* Header: Name, Location & Date */}
                <div className="flex justify-between items-start gap-4 mb-4 border-b border-[#FAF9F6] pb-3">
                  <div>
                    <span className="block font-display text-base font-bold text-primary">
                      {review.name}
                    </span>
                    <span className="block text-[10px] text-[#888] uppercase tracking-wider mt-0.5">
                      {review.location}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#888] font-medium">
                    {review.date}
                  </span>
                </div>

                {/* Rating Stars & Verified Badge */}
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex gap-0.5">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <span className="flex items-center gap-1 text-[9px] uppercase font-bold tracking-widest text-[#25D366]">
                    <ShieldCheck className="h-4 w-4 fill-current text-white stroke-[2]" />
                    Verified Buyer
                  </span>
                </div>

                {/* Review Text with Left Border */}
                <div className="border-l-2 border-primary pl-3 italic text-xs lg:text-sm text-[#555] leading-relaxed mb-4 flex-1">
                  "{review.text}"
                </div>

                {/* Reviewer Avatar */}
                <div className="flex items-center gap-3 pt-3 border-t border-[#FAF9F6]">
                  <div className="w-9 h-9 rounded-full border border-accent overflow-hidden bg-[#FAF9F6]">
                    <img src={review.avatar} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-widest text-[#888] font-bold">Reviewed Item</span>
                    <span className="text-xs font-bold text-primary mt-0.5">{review.product}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Action Row: Back to Home */}
          <div className="text-center mt-16">
            <Link
              to="/"
              className="inline-flex items-center gap-2 border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold text-xs uppercase tracking-widest py-3.5 px-10 rounded-full transition-all duration-300 shadow-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>

        </div>

      </div>
    </MainLayout>
  );
}
