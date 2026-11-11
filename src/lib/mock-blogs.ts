import type { DBBlog } from "@/api/hooks/blog.hooks";

export const MOCK_BLOGS: DBBlog[] = [
  {
    id: "mock-1",
    title: "THE IMPACT OF NUTRITION ON MENTAL HEALTH",
    slug: "impact-of-nutrition-on-mental-health",
    excerpt:
      "Mental health and physical health are deeply connected. While exercise, sleep, and lifestyle habits all play an important role, what you eat can have a profound impact on your mood and emotional well-being.",
    content: `
      <h2>The Gut-Brain Connection: What is it?</h2>
      <p>Have you ever had a "gut feeling" or felt "butterflies" in your stomach? These sensations aren't just psychological. The gastrointestinal tract is highly sensitive to emotion. Anger, anxiety, sadness, elation — all of these feelings can trigger symptoms in the gut.</p>
      <p>This is because the brain and the gastrointestinal (GI) system are intimately connected through the <strong>vagus nerve</strong> and neurotransmitters. In fact, scientists often refer to the gut as our "second brain" because it is home to the enteric nervous system (ENS), containing millions of neurons.</p>
      <blockquote>"An astounding 90% of serotonin receptors are located in the gut, meaning your digestive tract produces the vast majority of the hormone responsible for regulating your mood."</blockquote>
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
    image:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1000&auto=format&fit=crop",
    author: "Dr. Sarah Cole",
    tags: ["Fitness", "Nutrition", "Health"],
    isActive: true,
    viewsCount: 154,
    readTime: 5,
    createdAt: "2026-06-15T08:00:00.000Z",
    updatedAt: "2026-06-15T08:00:00.000Z",
  },
  {
    id: "mock-2",
    title: "HEALTHY WEIGHT LOSS TIPS FOR BEGINNERS",
    slug: "healthy-weight-loss-tips-for-beginners",
    excerpt:
      "Losing weight is one of the most common health goals. Many people struggle because they follow unsustainable fad diets instead of focusing on consistent, long-term lifestyle habits.",
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
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1000&auto=format&fit=crop",
    author: "Coach Mike",
    tags: ["Health", "Fitness", "Weightloss"],
    isActive: true,
    viewsCount: 231,
    readTime: 6,
    createdAt: "2026-06-08T08:00:00.000Z",
    updatedAt: "2026-06-08T08:00:00.000Z",
  },
  {
    id: "mock-3",
    title: "CREATINE: THE COMPLETE GUIDE FOR ATHLETES",
    slug: "creatine-the-complete-guide-for-athletes",
    excerpt:
      "Creatine is one of the most researched and scientifically proven supplements in sports nutrition. Here is everything you need to know about its benefits, safety, and dosage.",
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
    image:
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=1000&auto=format&fit=crop",
    author: "Emma Stone",
    tags: ["Supplements", "Fitness", "Athletes"],
    isActive: true,
    viewsCount: 342,
    readTime: 8,
    createdAt: "2026-06-01T08:00:00.000Z",
    updatedAt: "2026-06-01T08:00:00.000Z",
  },
  {
    id: "mock-4",
    title: "HIGH PROTEIN BREAKFAST IDEAS FOR GYM GOERS",
    slug: "high-protein-breakfast-ideas-for-gym-goers",
    excerpt:
      "Starting your day with a protein-rich breakfast sets the foundation for muscle recovery and sustained energy throughout the day. Here are quick and delicious options.",
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
    image:
      "https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=1000&auto=format&fit=crop",
    author: "Chef Dan",
    tags: ["Nutrition", "Recipes", "Fitness"],
    isActive: true,
    viewsCount: 198,
    readTime: 4,
    createdAt: "2026-05-25T08:00:00.000Z",
    updatedAt: "2026-05-25T08:00:00.000Z",
  },
];

