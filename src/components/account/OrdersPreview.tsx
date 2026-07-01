import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ChevronRight, Truck, CheckCircle2, Clock, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const mockOrders = [
  {
    id: 'ORD-2024-001',
    date: 'Jan 28, 2024',
    status: 'Delivered',
    statusColor: 'success',
    total: 1245,
    items: [
      { name: 'Premium Leather Jacket', image: '/placeholder.svg', qty: 1 },
      { name: 'Slim Fit Chinos', image: '/placeholder.svg', qty: 2 },
    ],
  },
  {
    id: 'ORD-2024-002',
    date: 'Jan 25, 2024',
    status: 'In Transit',
    statusColor: 'primary',
    total: 895,
    items: [
      { name: 'Classic Oxford Shirt', image: '/placeholder.svg', qty: 1 },
    ],
  },
  {
    id: 'ORD-2024-003',
    date: 'Jan 20, 2024',
    status: 'Processing',
    statusColor: 'muted',
    total: 645,
    items: [
      { name: 'Canvas Sneakers', image: '/placeholder.svg', qty: 1 },
    ],
  },
];

const statusIcons = {
  Delivered: CheckCircle2,
  'In Transit': Truck,
  Processing: Clock,
  Returned: RotateCcw,
};

export default function OrdersPreview() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-card rounded-2xl border border-border overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Recent Orders</h3>
            <p className="text-sm text-muted-foreground">Track your purchases</p>
          </div>
        </div>
        <Link 
          to="/account/orders"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          View All
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      
      {/* Orders List */}
      <div className="divide-y divide-border">
        {mockOrders.map((order, index) => {
          const StatusIcon = statusIcons[order.status as keyof typeof statusIcons] || Package;
          
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="p-4 hover:bg-secondary/30 transition-colors cursor-pointer"
            >
              <Link to={`/account/orders/${order.id}`} className="block">
                <div className="flex gap-4">
                  {/* Product Images */}
                  <div className="flex -space-x-3">
                    {order.items.slice(0, 3).map((item, i) => (
                      <div
                        key={i}
                        className="w-14 h-14 rounded-lg bg-secondary border-2 border-card overflow-hidden"
                        style={{ zIndex: order.items.length - i }}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="w-14 h-14 rounded-lg bg-secondary border-2 border-card flex items-center justify-center text-sm font-medium text-muted-foreground">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>
                  
                  {/* Order Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-foreground text-sm">{order.items[0].name}</p>
                        {order.items.length > 1 && (
                          <p className="text-xs text-muted-foreground">
                            +{order.items.length - 1} more item{order.items.length > 2 ? 's' : ''}
                          </p>
                        )}
                      </div>
                      <p className="font-semibold text-foreground">${order.total}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                          order.statusColor === 'success' && "bg-success/10 text-success",
                          order.statusColor === 'primary' && "bg-primary/10 text-primary",
                          order.statusColor === 'muted' && "bg-muted text-muted-foreground"
                        )}>
                          <StatusIcon className="h-3 w-3" />
                          {order.status}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">{order.date}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
      
      {/* Footer CTA */}
      <div className="p-4 bg-secondary/20 border-t border-border">
        <Button variant="outline" className="w-full" asChild>
          <Link to="/account/orders">
            <Package className="h-4 w-4 mr-2" />
            View Order History
          </Link>
        </Button>
      </div>
    </motion.section>
  );
}
