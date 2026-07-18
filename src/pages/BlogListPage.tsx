"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Calendar, User, Clock, Eye, ArrowLeft, Share2, Facebook, Twitter, Link2, Check } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { useBlogsQuery, useBlogDetailQuery, DBBlog } from "@/api/hooks/blog.hooks";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// High-quality mock blogs to fallback to if backend has no blogs
const MOCK_BLOGS: DBBlog[] = [
  {
    id: "mock-1",
    title: "THE IMPACT OF NUTRITION ON MENTAL HEALTH",
    slug: "impact-of-nutrition-on-mental-health",
    excerpt: "Mental health and physical health are deeply connected. While exercise, sleep, and lifestyle habits all play an important role, what you eat can have a profound impact on your mood and emotional well-being.",
    content: `
      <h2>The Gut-Brain Connection: What is it?</h2>
      <p>Have you ever had a "gut feeling" or felt "butterflies" in your stomach? These sensations aren't just psychological. The gastrointestinal tract is highly sensitive to emotion. Anger, anxiety, sadness, elation — all of these feelings can trigger symptoms in the gut.</p>
      <p>This is because the brain and the gastrointestinal (GI) system are intimately connected through the <strong>vagus nerve</strong> and neurotransmitters. In fact, scientists often refer to the gut as our "second brain" because it is home to the enteric nervous system (ENS), containing millions of neurons.</p>

      <blockquote>
        "An astounding 90% of serotonin receptors are located in the gut, meaning your digestive tract produces the vast majority of the hormone responsible for regulating your mood."
      </blockquote>

      <h2>Nutrients that Boost Your Mood</h2>
      <p>To support your mental well-being, certain nutrients should be key pillars of your daily diet:</p>
      <ul>
        <li><strong>Omega-3 Fatty Acids:</strong> Found in salmon, walnuts, and flaxseeds, these are essential for brain cell structure and reducing neuroinflammation.</li>
        <li><strong>B Vitamins (especially B12 and Folate):</strong> Critical for producing mood-regulating brain chemicals. Sources include leafy greens, eggs, and legumes.</li>
        <li><strong>Probiotics & Prebiotics:</strong> Fermented foods like yogurt, kefir, and kimchi nurture the gut microbiome, directly supporting serotonin production.</li>
        <li><strong>Complex Carbohydrates:</strong> Oats, sweet potatoes, and quinoa release glucose slowly, preventing the blood sugar spikes and crashes that cause irritability.</li>
      </ul>

      <h2>Practical Steps for Better Mood Nutrition</h2>
      <p>Start small by incorporating whole foods into your diet. Swap processed snacks for nuts or fruit, stay hydrated throughout the day, and eat regular meals to maintain steady energy levels. Remember, eating for mental health is about nourishing your body, not restricting it.</p>
    `,
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1000&auto=format&fit=crop",
    author: "Dr. Sarah Cole",
    tags: ["Fitness", "Nutrition", "Health"],
    isActive: true,
    viewsCount: 154,
    readTime: 5,
    createdAt: "2026-06-15T08:00:00.000Z",
    updatedAt: "2026-06-15T08:00:00.000Z"
  },
  {
    id: "mock-2",
    title: "HEALTHY WEIGHT LOSS TIPS FOR BEGINNERS",
    slug: "healthy-weight-loss-tips-for-beginners",
    excerpt: "Losing weight is one of the most common health goals. Many people struggle because they follow unsustainable fad diets instead of focusing on consistent, long-term lifestyle habits.",
    content: `
      <h2>Fad Diets vs. Sustainable Lifestyle Changes</h2>
      <p>When starting a weight loss journey, it's tempting to look for quick fixes. However, extreme calorie restriction or cutting out entire food groups almost always leads to rebound weight gain once the diet ends.</p>
      <p>The key to permanent weight loss is creating a sustainable calorie deficit while nourishing your body with high-quality nutrients that keep you full and energized.</p>

      <h2>Top 5 Principles of Healthy Weight Loss</h2>
      <ol>
        <li><strong>Prioritize Protein:</strong> Protein increases satiety hormones and prevents muscle loss during weight loss. Target lean meats, dairy, tofu, and legumes.</li>
        <li><strong>Eat More Volume (Fiber):</strong> Vegetables and fruits are low-calorie but high in volume, helping you feel satisfied without overeating.</li>
        <li><strong>Stay Consistently Active:</strong> Combine cardiovascular exercise with strength training. Strength training builds muscle, which raises your resting metabolic rate.</li>
        <li><strong>Get Adequate Sleep:</strong> Lack of sleep increases ghrelin (the hunger hormone) and decreases leptin (the fullness hormone), making cravings harder to resist.</li>
        <li><strong>Track Your Progress, Not Just Your Weight:</strong> Measure progress through energy levels, fitness gains, and how your clothes fit, rather than focusing solely on the scale.</li>
      </ol>

      <h2>Conclusion</h2>
      <p>Be patient with yourself. Healthy weight loss is a marathon, not a sprint. Aim for a safe, steady rate of 0.5 to 1 kg per week to ensure the weight stays off for good.</p>
    `,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1000&auto=format&fit=crop",
    author: "Coach Mike",
    tags: ["Health", "Fitness", "Weightloss"],
    isActive: true,
    viewsCount: 231,
    readTime: 6,
    createdAt: "2026-06-08T08:00:00.000Z",
    updatedAt: "2026-06-08T08:00:00.000Z"
  },
  {
    id: "mock-3",
    title: "CREATINE: THE COMPLETE GUIDE FOR ATHLETES",
    slug: "creatine-the-complete-guide-for-athletes",
    excerpt: "Creatine is one of the most researched and scientifically proven supplements in sports nutrition. Here is everything you need to know about its benefits, safety, and dosage.",
    content: `
      <h2>What is Creatine and How Does It Work?</h2>
      <p>Creatine is a natural compound found in small amounts in red meat and seafood, and synthesized by our own bodies. It is stored in muscles as phosphocreatine, which is used to produce ATP (adenosine triphosphate) during high-intensity, short-duration exercises like sprinting and heavy lifting.</p>

      <h2>Key Benefits of Creatine Supplementation</h2>
      <ul>
        <li><strong>Increased Strength & Power:</strong> Studies show significant improvements in max effort strength and weightlifting performance.</li>
        <li><strong>Faster Muscle Growth:</strong> Creatine draws water into muscle cells (hydration) and supports protein synthesis, contributing to muscle hypertrophy.</li>
        <li><strong>Improved Brain Health:</strong> Emerging research suggests creatine plays a vital role in cellular energy production in the brain, supporting memory and cognitive function.</li>
      </ul>

      <h2>How to Take Creatine: Loading vs. Maintenance</h2>
      <p>You do not need a complicated loading phase to see results. There are two primary methods to start:</p>
      <p><strong>Option A (Loading Phase):</strong> Take 20 grams per day (divided into 4 doses of 5g) for 5-7 days to quickly saturate muscle stores, followed by a maintenance dose of 3-5g daily.</p>
      <p><strong>Option B (Consistent Maintenance):</strong> Take 3-5 grams daily from day one. It will take 3-4 weeks to fully saturate your muscles, but avoids potential stomach discomfort from high initial doses.</p>

      <h2>Common Myths Debunked</h2>
      <p>Does creatine cause hair loss or kidney damage? Extensive clinical studies have repeatedly shown that daily creatine supplementation is safe for healthy individuals and does not cause kidney dysfunction or hair loss. Always stay well-hydrated to help your body process the supplement optimally.</p>
    `,
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=1000&auto=format&fit=crop",
    author: "Emma Stone",
    tags: ["Supplements", "Fitness", "Athletes"],
    isActive: true,
    viewsCount: 342,
    readTime: 8,
    createdAt: "2026-06-01T08:00:00.000Z",
    updatedAt: "2026-06-01T08:00:00.000Z"
  },
  {
    id: "mock-4",
    title: "HIGH PROTEIN BREAKFAST IDEAS FOR GYM GOERS",
    slug: "high-protein-breakfast-ideas-for-gym-goers",
    excerpt: "Starting your day with a protein-rich breakfast sets the foundation for muscle recovery and sustained energy throughout the day. Here are quick and delicious options.",
    content: `
      <h2>Why Protein at Breakfast Matters</h2>
      <p>After fasting overnight, your body is in a catabolic state where it can break down muscle tissue for energy. Consuming 30+ grams of protein at breakfast halts this process, stimulates muscle protein synthesis, and stabilizes blood sugar levels to curb mid-morning cravings.</p>

      <h2>4 Quick High-Protein Breakfast Ideas</h2>
      <h3>1. Protein-Packed Proats (Protein Oatmeal)</h3>
      <p>Cook 1/2 cup of rolled oats in milk or water. Once cooked, stir in 1 scoop of whey or plant protein powder, a splash of milk, and top with chia seeds and berries. <em>Total Protein: ~35g</em></p>

      <h3>2. The Ultimate Egg & Egg White Scramble</h3>
      <p>Whisk 2 whole eggs with 1/2 cup of liquid egg whites. Scramble with spinach, mushrooms, and a sprinkle of feta cheese. Serve on a slice of toasted whole-grain sourdough. <em>Total Protein: ~30g</em></p>

      <h3>3. Greek Yogurt & Berry Bowl</h3>
      <p>Take 1 cup of unsweetened Greek yogurt (a natural protein powerhouse), stir in 1 tablespoon of honey, and top with pumpkin seeds, hemp hearts, and mixed berries. <em>Total Protein: ~25-30g</em></p>

      <h3>4. Smoked Salmon & Cottage Cheese Toast</h3>
      <p>Spread 1/2 cup of low-fat cottage cheese on toasted sprouted grain bread and top with 50g of smoked salmon, cucumber slices, and dill. <em>Total Protein: ~28g</em></p>

      <h2>Conclusion</h2>
      <p>Fueling your body right in the morning doesn't have to take hours. Keep protein sources prepped and accessible so you can build muscle and sustain focus all day long.</p>
    `,
    image: "https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=1000&auto=format&fit=crop",
    author: "Chef Dan",
    tags: ["Nutrition", "Recipes", "Fitness"],
    isActive: true,
    viewsCount: 198,
    readTime: 4,
    createdAt: "2026-05-25T08:00:00.000Z",
    updatedAt: "2026-05-25T08:00:00.000Z"
  }
];

const CATEGORIES = ["All", "Fitness", "Health", "Supplements", "Nutrition", "Lifestyle"];

const formatDate = (dateStr: string | Date) => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return String(dateStr);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function BlogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [copied, setCopied] = useState(false);

  const selectedSlug = searchParams.get("slug");

  // Fetch blogs list from backend
  const { data: backendData, isLoading: isListLoading } = useBlogsQuery({
    search: searchQuery || undefined,
    isActive: true,
    sort: sortBy,
  });

  // Fetch single blog detail if a slug is active
  const { data: dbBlogDetail, isLoading: isDetailLoading } = useBlogDetailQuery(selectedSlug || "");

  // Combine backend list and mock list
  const blogsList = useMemo(() => {
    let list = MOCK_BLOGS;
    if (backendData?.blogs && backendData.blogs.length > 0) {
      list = backendData.blogs;
    }

    // Apply client-side filters
    return list.filter((blog) => {
      // Category filter (looks at tags)
      const matchesCategory =
        selectedCategory === "All" ||
        blog.tags.some((tag) => tag.toLowerCase() === selectedCategory.toLowerCase());

      // Search filter (looks at title/excerpt)
      const matchesSearch =
        !searchQuery ||
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (blog.excerpt && blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [backendData, selectedCategory, searchQuery]);

  // Determine the featured blog post (newest post when no filters/searches are active)
  const featuredBlog = useMemo(() => {
    if (selectedCategory !== "All" || searchQuery !== "" || blogsList.length === 0) {
      return null;
    }
    return blogsList[0];
  }, [blogsList, selectedCategory, searchQuery]);

  // Determine the blogs for the grid (excluding the featured one if visible)
  const gridBlogs = useMemo(() => {
    if (featuredBlog) {
      return blogsList.slice(1);
    }
    return blogsList;
  }, [blogsList, featuredBlog]);

  // Get active blog for the detail view (either fetched from DB or fallback to mock)
  const activeBlog = useMemo(() => {
    if (!selectedSlug) return null;
    if (dbBlogDetail) return dbBlogDetail;
    return MOCK_BLOGS.find((b) => b.slug === selectedSlug) || null;
  }, [selectedSlug, dbBlogDetail]);

  // Determine related blogs for the bottom of the detail view
  const relatedBlogs = useMemo(() => {
    if (!activeBlog) return [];
    const list = backendData?.blogs && backendData.blogs.length > 0 ? backendData.blogs : MOCK_BLOGS;
    return list
      .filter((b) => b.id !== activeBlog.id && b.tags.some((t) => activeBlog.tags.includes(t)))
      .slice(0, 3);
  }, [activeBlog, backendData]);

  // Handle Share link copy
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Scroll to top on page or view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedSlug]);

  return (
    <MainLayout>
      <div className="bg-[#FAF9F6] min-h-screen pb-20">
        <AnimatePresence mode="wait">
          {!selectedSlug ? (
            /* BLOG LIST VIEW */
            <motion.div
              key="list-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12"
            >
              {/* Header */}
              <div className="text-center mb-16">
                <span className="text-xs uppercase font-extrabold tracking-widest text-[#5BBF3D] bg-[#5BBF3D]/10 px-4 py-1.5 rounded-full">
                  Insights & Articles
                </span>
                <h1 className="heading-bold text-4xl sm:text-5xl lg:text-6xl text-black mt-4 uppercase">
                  Our <span className="text-gray-400 italic">Blog</span>
                </h1>
                <p className="text-gray-500 max-w-2xl mx-auto mt-4 text-base sm:text-lg">
                  Explore the latest insights, training guides, nutritional tips, and fitness trends to fuel your active lifestyle.
                </p>
              </div>

              {/* Filters & Search Toolbar */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-12 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                {/* Search Bar */}
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#FAF9F6] border-0 text-black placeholder-gray-400 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-[#5BBF3D] focus:outline-none"
                  />
                </div>

                {/* Categories Scrollable Pills */}
                <div className="flex gap-2 overflow-x-auto hide-scrollbar w-full md:w-auto py-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-bold transition-all whitespace-nowrap",
                        selectedCategory === cat
                          ? "bg-black text-white shadow-md"
                          : "bg-[#FAF9F6] text-gray-500 hover:text-black hover:bg-gray-100"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Sort Option */}
                <div className="w-full md:w-auto flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold whitespace-nowrap">
                    Sort By:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-[#FAF9F6] border-0 text-black text-xs uppercase tracking-wider font-bold py-2.5 px-3 pr-8 rounded-xl focus:ring-2 focus:ring-[#5BBF3D] focus:outline-none cursor-pointer"
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="popular">Popular</option>
                  </select>
                </div>
              </div>

              {isListLoading ? (
                /* LOADING STATE */
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="h-10 w-10 border-4 border-[#5BBF3D] border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-500 text-sm uppercase tracking-wider font-semibold">Loading articles...</p>
                </div>
              ) : blogsList.length === 0 ? (
                /* EMPTY STATE */
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                  <p className="text-gray-400 text-lg">No articles found matching your criteria.</p>
                  <Button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("All");
                    }}
                    className="mt-4 bg-[#5BBF3D] hover:bg-[#4A9E30] text-white rounded-xl text-xs uppercase font-bold tracking-wider px-6 py-3"
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                /* LIST OF BLOGS */
                <>
                  {/* FEATURED SPOTLIGHT */}
                  {featuredBlog && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-14 group"
                    >
                      <div
                        onClick={() => navigate(`/blog/${featuredBlog.slug}`)}
                        className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 cursor-pointer"
                      >
                        {/* Image */}
                        <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-[480px] overflow-hidden">
                          <img
                            src={featuredBlog.image || "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1000"}
                            alt={featuredBlog.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <span className="absolute top-4 left-4 bg-[#5BBF3D] text-white text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-lg shadow-md">
                            Featured Post
                          </span>
                        </div>

                        {/* Content */}
                        <div className="lg:col-span-5 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-6">
                            {featuredBlog.tags.map((tag) => (
                              <span
                                key={tag}
                                className="bg-[#FAF9F6] text-black text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* Title */}
                          <h2 className="heading-bold text-2xl sm:text-3xl lg:text-4xl text-black leading-tight mb-4 group-hover:text-[#5BBF3D] transition-colors uppercase">
                            {featuredBlog.title}
                          </h2>

                          {/* Excerpt */}
                          <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-6 line-clamp-4">
                            {featuredBlog.excerpt}
                          </p>

                          {/* Meta */}
                          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 pt-6 border-t border-gray-100 text-xs text-gray-400 font-semibold uppercase tracking-wider">
                            <span className="flex items-center gap-1.5">
                              <User className="h-4 w-4 text-[#5BBF3D]" />
                              {featuredBlog.author}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Calendar className="h-4 w-4" />
                              {formatDate(featuredBlog.createdAt)}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="h-4 w-4" />
                              {featuredBlog.readTime || 5} Min Read
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Eye className="h-4 w-4" />
                              {featuredBlog.viewsCount} Views
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* GRID LIST */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {gridBlogs.map((blog, index) => (
                      <motion.div
                        key={blog.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05, duration: 0.4 }}
                        onClick={() => navigate(`/blog/${blog.slug}`)}
                        className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group flex flex-col h-full"
                      >
                        {/* Card Image */}
                        <div className="relative overflow-hidden aspect-[16/10]">
                          <img
                            src={blog.image || "https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=800"}
                            alt={blog.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          {/* Main tag overlay */}
                          {blog.tags.length > 0 && (
                            <span className="absolute bottom-3 left-3 bg-white text-black text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-sm">
                              {blog.tags[0]}
                            </span>
                          )}
                        </div>

                        {/* Card Content */}
                        <div className="p-6 flex flex-col flex-grow">
                          {/* Title */}
                          <h3 className="font-extrabold text-lg text-black mb-3 leading-snug group-hover:text-[#5BBF3D] transition-colors line-clamp-2 uppercase">
                            {blog.title}
                          </h3>

                          {/* Excerpt */}
                          <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                            {blog.excerpt}
                          </p>

                          {/* Meta Row */}
                          <div className="mt-auto pt-4 border-t border-gray-500/10 flex items-center justify-between text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {formatDate(blog.createdAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {blog.readTime || 5} Min Read
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          ) : (
            /* BLOG DETAIL VIEW */
            <motion.div
              key="detail-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12"
            >
              {/* Back Button & Share */}
              <div className="flex items-center justify-between mb-8">
                <button
                  onClick={() => setSearchParams({})}
                  className="inline-flex items-center gap-2 text-xs uppercase font-extrabold tracking-wider text-black hover:text-[#5BBF3D] transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Articles
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyLink}
                    className="p-2 bg-white border border-gray-150 hover:border-black rounded-lg text-gray-500 hover:text-black transition-all flex items-center justify-center"
                    title="Copy Link"
                  >
                    {copied ? <Check className="h-4 w-4 text-[#5BBF3D]" /> : <Link2 className="h-4 w-4" />}
                  </button>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(activeBlog?.title || "")}&url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white border border-gray-150 hover:border-black rounded-lg text-gray-500 hover:text-[#1DA1F2] transition-all flex items-center justify-center"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white border border-gray-150 hover:border-black rounded-lg text-gray-500 hover:text-[#1877F2] transition-all flex items-center justify-center"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                </div>
              </div>

              {isDetailLoading ? (
                /* LOADING DETAIL */
                <div className="flex flex-col items-center justify-center py-32">
                  <div className="h-10 w-10 border-4 border-[#5BBF3D] border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-500 text-sm uppercase tracking-wider font-semibold">Loading article details...</p>
                </div>
              ) : !activeBlog ? (
                /* NOT FOUND */
                <div className="text-center py-20 bg-white rounded-3xl">
                  <p className="text-gray-400 text-lg">Article not found.</p>
                  <Button
                    onClick={() => setSearchParams({})}
                    className="mt-4 bg-[#5BBF3D] hover:bg-[#4A9E30] text-white rounded-xl text-xs uppercase font-bold tracking-wider px-6 py-3"
                  >
                    Back to Blog
                  </Button>
                </div>
              ) : (
                /* DETAILED CONTENT */
                <article className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6 sm:p-10 lg:p-12">
                  {/* Article Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {activeBlog.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-[#FAF9F6] text-black text-[10px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-lg"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <h1 className="heading-bold text-3xl sm:text-4xl lg:text-5xl text-black leading-tight mb-6 uppercase">
                    {activeBlog.title}
                  </h1>

                  {/* Meta Details */}
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-6 pb-8 border-b border-gray-100 text-xs text-gray-400 font-semibold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <User className="h-4 w-4 text-[#5BBF3D]" />
                      Written By: <span className="text-black font-extrabold">{activeBlog.author}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      Published: <span className="text-black font-extrabold">{formatDate(activeBlog.createdAt)}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      Read Time: <span className="text-black font-extrabold">{activeBlog.readTime || 5} Mins</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Eye className="h-4 w-4" />
                      Views: <span className="text-black font-extrabold">{activeBlog.viewsCount}</span>
                    </span>
                  </div>

                  {/* Feature Image */}
                  <div className="my-8 rounded-2xl overflow-hidden aspect-[16/9]">
                    <img
                      src={activeBlog.image || "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200"}
                      alt={activeBlog.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Body Content */}
                  <div
                    className="prose max-w-none text-gray-600 leading-relaxed space-y-6 
                      prose-headings:text-black prose-headings:font-extrabold prose-headings:uppercase prose-headings:mt-8 prose-headings:mb-4
                      prose-h2:text-2xl prose-h3:text-xl
                      prose-strong:text-black prose-strong:font-bold
                      prose-blockquote:border-l-4 prose-blockquote:border-[#5BBF3D] prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:my-8 prose-blockquote:text-lg prose-blockquote:text-black/80
                      prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6
                      prose-li:my-2"
                    dangerouslySetInnerHTML={{ __html: activeBlog.content }}
                  />

                  {/* RELATED POSTS SECTION */}
                  {relatedBlogs.length > 0 && (
                    <div className="mt-16 pt-12 border-t border-gray-100">
                      <h3 className="heading-bold text-xl sm:text-2xl text-black mb-8 uppercase">
                        Related <span className="text-gray-400 italic font-bold">Articles</span>
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {relatedBlogs.map((blog) => (
                          <div
                            key={blog.id}
                            onClick={() => setSearchParams({ slug: blog.slug })}
                            className="group cursor-pointer"
                          >
                            <div className="relative overflow-hidden rounded-xl aspect-[16/10] mb-3">
                              <img
                                src={blog.image || "https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=400"}
                                alt={blog.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            </div>
                            <h4 className="font-extrabold text-sm text-black leading-snug group-hover:text-[#5BBF3D] transition-colors line-clamp-2 uppercase">
                              {blog.title}
                            </h4>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
}
