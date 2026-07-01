export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  images: string[];
  category: string;
  subcategory: string;
  brand: string;
  rating: number;
  reviews: number;
  sizes: string[];
  colors: { name: string; hex: string }[];
  tags: string[];
  inStock: boolean;
  isNew?: boolean;
  isSale?: boolean;
  netWeight?: string;
  karat?: string;
}

export const products: Product[] = [
  {
    id: '1',
    name: '100% Gold Standard Whey',
    price: 3499,
    originalPrice: 4200,
    description: 'Premium whey protein isolate loaded with 24g of protein per serving to help build muscle and recover faster after workouts.',
    images: [
      'https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=800',
    ],
    category: 'Whey Protein',
    subcategory: 'Protein',
    brand: 'Protein & Nutrients',
    rating: 4.9,
    reviews: 128,
    sizes: ['2 lbs', '5 lbs', '10 lbs'],
    colors: [
      { name: 'Double Rich Chocolate', hex: '#3B2F2F' },
      { name: 'Vanilla Ice Cream', hex: '#F3E5AB' },
    ],
    tags: ['protein', 'whey', 'muscle', 'recovery'],
    inStock: true,
    isNew: true,
    netWeight: '5 lbs',
  },
  {
    id: '2',
    name: 'Creatine Monohydrate',
    price: 999,
    originalPrice: 1299,
    description: 'Pure micronized creatine monohydrate to increase strength, power, and muscle mass during high-intensity training.',
    images: [
      'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800',
    ],
    category: 'Creatine',
    subcategory: 'Strength',
    brand: 'Protein & Nutrients',
    rating: 4.8,
    reviews: 212,
    sizes: ['300g', '500g'],
    colors: [
      { name: 'Unflavored', hex: '#FFFFFF' },
    ],
    tags: ['creatine', 'strength', 'power'],
    inStock: true,
    netWeight: '300g',
  },
  {
    id: '3',
    name: 'C4 Explosive Pre-Workout',
    price: 2499,
    originalPrice: 2999,
    description: 'Advanced pre-workout formula engineered for explosive energy, laser focus, and skin-tearing pumps.',
    images: [
      'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=800',
    ],
    category: 'Pre Workout',
    subcategory: 'Energy',
    brand: 'Protein & Nutrients',
    rating: 4.7,
    reviews: 89,
    sizes: ['30 Servings', '60 Servings'],
    colors: [
      { name: 'Fruit Punch', hex: '#FF0033' },
      { name: 'Blue Raspberry', hex: '#0066FF' },
    ],
    tags: ['pre-workout', 'energy', 'pump'],
    inStock: true,
    isSale: true,
    netWeight: '390g',
  },
  {
    id: '4',
    name: 'Essential Amino Acids (EAA)',
    price: 1899,
    description: 'Comprehensive blend of all 9 essential amino acids to support muscle protein synthesis and prevent catabolism.',
    images: [
      'https://images.unsplash.com/photo-1594882645126-14020914d58d?w=800',
    ],
    category: 'Vitamins',
    subcategory: 'Recovery',
    brand: 'Protein & Nutrients',
    rating: 5.0,
    reviews: 44,
    sizes: ['30 Servings'],
    colors: [
      { name: 'Watermelon', hex: '#FC6C85' },
    ],
    tags: ['eaa', 'amino acids', 'recovery'],
    inStock: true,
    isNew: true,
    netWeight: '450g',
  },
  {
    id: '5',
    name: 'Serious Mass Gainer',
    price: 4500,
    originalPrice: 5200,
    description: 'High-calorie mass gainer packed with 50g protein and 1,250 calories per serving to help hardgainers bulk up quickly.',
    images: [
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
    ],
    category: 'Mass Gainer',
    subcategory: 'Weight Gain',
    brand: 'Protein & Nutrients',
    rating: 4.6,
    reviews: 156,
    sizes: ['6 lbs', '12 lbs'],
    colors: [
      { name: 'Chocolate', hex: '#3B2F2F' },
    ],
    tags: ['gainer', 'mass', 'calories'],
    inStock: true,
    isSale: true,
    netWeight: '12 lbs',
  },
  {
    id: '6',
    name: 'Opti-Men Multivitamin',
    price: 1599,
    description: 'Comprehensive daily multivitamin specifically formulated for active men to support immune health and cellular energy.',
    images: [
      'https://images.unsplash.com/photo-1584308666744-24d5e4a5d8e7?w=800',
    ],
    category: 'Vitamins',
    subcategory: 'Health',
    brand: 'Protein & Nutrients',
    rating: 4.9,
    reviews: 320,
    sizes: ['90 Tablets', '150 Tablets'],
    colors: [
      { name: 'Standard', hex: '#FFCC00' },
    ],
    tags: ['vitamins', 'health', 'immunity'],
    inStock: true,
    netWeight: '100g',
  }
];

export const categories = [
  {
    name: 'Whey Protein',
    image: 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=600',
    subcategories: ['Protein'],
  },
  {
    name: 'Pre Workout',
    image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=600',
    subcategories: ['Energy'],
  },
  {
    name: 'Creatine',
    image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600',
    subcategories: ['Strength'],
  },
  {
    name: 'Vitamins',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5e4a5d8e7?w=600',
    subcategories: ['Health', 'Recovery'],
  },
  {
    name: 'Mass Gainer',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600',
    subcategories: ['Weight Gain'],
  },
];

export const brands = ['Protein & Nutrients'];
