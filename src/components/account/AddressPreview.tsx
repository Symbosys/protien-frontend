import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ChevronRight, Plus, Home, Building2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const mockAddresses = [
  {
    id: '1',
    type: 'home',
    label: 'Home',
    name: 'John Doe',
    address: '123 Main Street, Apt 4B',
    city: 'New York, NY 10001',
    phone: '+1 (555) 123-4567',
    isDefault: true,
  },
  {
    id: '2',
    type: 'work',
    label: 'Work',
    name: 'John Doe',
    address: '456 Business Avenue, Floor 12',
    city: 'New York, NY 10002',
    phone: '+1 (555) 987-6543',
    isDefault: false,
  },
];

const typeIcons = {
  home: Home,
  work: Building2,
};

export default function AddressPreview() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-card rounded-2xl border border-border overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <MapPin className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Saved Addresses</h3>
            <p className="text-sm text-muted-foreground">Manage delivery locations</p>
          </div>
        </div>
        <Link 
          to="/account/addresses"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Manage
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      
      {/* Addresses */}
      <div className="p-4 space-y-3">
        {mockAddresses.map((address, index) => {
          const TypeIcon = typeIcons[address.type as keyof typeof typeIcons] || MapPin;
          
          return (
            <motion.div
              key={address.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 + index * 0.05 }}
              className={cn(
                "relative p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-sm",
                address.isDefault 
                  ? "border-primary/30 bg-primary/5" 
                  : "border-border hover:border-primary/20"
              )}
            >
              {address.isDefault && (
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary text-primary-foreground">
                    <CheckCircle2 className="h-3 w-3" />
                    Default
                  </span>
                </div>
              )}
              
              <div className="flex gap-3">
                <div className={cn(
                  "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center",
                  address.isDefault ? "bg-primary/10" : "bg-secondary"
                )}>
                  <TypeIcon className={cn(
                    "h-5 w-5",
                    address.isDefault ? "text-primary" : "text-muted-foreground"
                  )} />
                </div>
                
                <div className="flex-1 min-w-0 pr-16">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-foreground">{address.label}</h4>
                  </div>
                  <p className="text-sm text-foreground">{address.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{address.address}</p>
                  <p className="text-sm text-muted-foreground">{address.city}</p>
                  <p className="text-xs text-muted-foreground mt-1">{address.phone}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
        
        {/* Add New Address */}
        <Button 
          variant="outline" 
          className="w-full border-dashed hover:border-primary hover:bg-primary/5"
          asChild
        >
          <Link to="/account/addresses/new">
            <Plus className="h-4 w-4 mr-2" />
            Add New Address
          </Link>
        </Button>
      </div>
    </motion.section>
  );
}
