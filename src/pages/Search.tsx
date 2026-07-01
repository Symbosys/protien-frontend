import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, X, ArrowRight } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import ProductCard from '@/components/product/ProductCard';
import { products, categories } from '@/data/products';

export default function SearchPage() {
  const [query, setQuery] = useState('');

  const searchResults = query.length >= 2
    ? products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  return (
    <MainLayout>
      <div className="pt-32 pb-16">
        <div className="container-luxe">
          {/* Search Input */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for products, brands, or categories..."
                className="w-full bg-transparent border-b-2 border-border focus:border-foreground py-4 pl-10 pr-10 text-xl outline-none transition-colors"
                autoFocus
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {/* Results or Suggestions */}
          {query.length < 2 ? (
            <div className="max-w-2xl mx-auto">
              <div className="mb-8">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">
                  Popular Searches
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['Cashmere', 'Leather', 'Evening wear', 'Silk', 'Wool coat'].map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-4 py-2 bg-secondary rounded-full text-sm hover:bg-muted transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-4">
                  Browse Categories
                </h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.name}
                      to={`/products?category=${cat.name}`}
                      className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
                    >
                      <span className="font-medium">{cat.name}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <p className="text-muted-foreground">
                  {searchResults.length} results for "{query}"
                </p>
              </div>

              {searchResults.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                  {searchResults.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-lg text-muted-foreground mb-4">
                    No products found for "{query}"
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Try a different search term or browse our categories
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
