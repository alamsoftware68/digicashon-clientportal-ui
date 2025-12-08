export interface Laptop {
  id: string;
  name: string;
  brand: string;
  model: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  availability: 'in-stock' | 'out-of-stock' | 'limited-stock';
  badge?: string;
  isRecommended?: boolean;
  isBestSeller?: boolean;
  
  // Specifications
  specifications: {
    processor: string;
    ram: string;
    storage: string;
    display: string;
    graphics: string;
    operatingSystem: string;
    battery: string;
    weight: string;
    color: string;
    warranty: string;
  };
  
  // Key features
  keyFeatures: string[];
  
  // Detailed description
  description: string;
  
  // Category
  category: 'gaming' | 'business' | 'student' | 'ultrabook' | 'workstation' | '2-in-1';
  
  // Price range for filtering
  priceRange: 'under-30k' | '30k-50k' | '50k-75k' | '75k-100k' | 'above-100k';
}

export interface LaptopFilters {
  brand?: string[];
  category?: string[];
  priceRange?: string[];
  rating?: number;
  availability?: string[];
}

export interface CartItem {
  laptop: Laptop;
  quantity: number;
  addedAt: Date;
}

export interface PurchaseOrder {
  orderId: string;
  items: CartItem[];
  totalAmount: number;
  deliveryAddress: any; // Use existing Address type
  orderDate: Date;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  estimatedDelivery?: Date;
}
