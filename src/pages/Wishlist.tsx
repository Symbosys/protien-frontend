import { motion } from 'framer-motion';
import { Heart, ShoppingBag, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';


export default function WishlistPage() {
  const { items, removeItem, isLoading } = useWishlist();
  const { addItem } = useCart();

  if (isLoading) {
    return (
      <MainLayout>
        <div className="pt-32 pb-16">
          <div className="container-luxe">
            <div className="h-10 w-48 bg-secondary/50 animate-pulse rounded mb-8" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-[3/4] bg-secondary/30 animate-pulse rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const handleAddToCart = (item: typeof items[0]) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
    });
  };

  return (
    <MainLayout>
      <div className="pt-32 pb-16">
        <div className="container-luxe">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl mb-8">
            Wishlist
          </h1>

          {items.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
              <h2 className="text-xl font-medium mb-2">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-8">
                Save your favorite items to revisit them later
              </p>
              <Button variant="hero" size="lg" asChild>
                <Link to="/products">Explore Products</Link>
              </Button>
            </div>
          ) : (
            <>
              <p className="text-muted-foreground mb-8">{items.length} items saved</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="relative aspect-[3/4] bg-muted rounded-lg overflow-hidden mb-4">
                      <Link to={`/product/${item.id}`}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </Link>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="absolute top-3 right-3 p-2 bg-background/80 rounded-full hover:bg-background transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      
                      <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        whileHover={{ opacity: 1, y: 0 }}
                        className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2 py-3 bg-background/90 backdrop-blur-sm text-foreground text-sm font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleAddToCart(item)}
                      >
                        <ShoppingBag className="h-4 w-4" />
                        Add to Bag
                      </motion.button>
                    </div>

                    <Link to={`/product/${item.id}`}>
                      <h3 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="font-medium">${item.price.toLocaleString()}</p>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
