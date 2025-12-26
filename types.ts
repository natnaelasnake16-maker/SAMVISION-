
export interface BranchStock {
  quantity: number;
  lowStockThreshold: number;
  status: 'In stock' | 'Limited' | 'Out of stock';
}

export interface Product {
  id: string; // Internal system ID
  sku: string; // Public-facing Frame Code
  name: string;
  brand: string;
  collection: 'New Arrival' | 'Popular' | 'Premium' | 'Budget' | 'Limited Edition';
  price: number;
  originalPrice?: number;
  discountType?: 'Percentage' | 'Fixed Amount';
  discountValue?: number;
  image: string;
  additionalImages?: string[];
  category: 'frames' | 'sunglasses' | 'lenses';
  gender: 'Men' | 'Women' | 'Unisex' | 'Kids';
  shape: 'Round' | 'Rectangle' | 'Square' | 'Cat-Eye' | 'Aviator' | 'Oversized';
  material: 'Acetate' | 'Metal' | 'Titanium' | 'Mixed';
  rimType: 'Full Rim' | 'Semi Rimless' | 'Rimless';
  isZeissCompatible: boolean;
  lensCompatibility: string[];
  tags?: string[];
  rating?: number;
  colors?: string[];
  stockPerBranch: Record<string, BranchStock>;
  status: 'Draft' | 'Active' | 'Archived';
  homepageFlags: {
    isNew: boolean;
    isPopular: boolean;
    isDiscountPromo: boolean;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  category: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'clinical' | 'surgical' | 'optical';
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  phone2?: string; // Optional second phone number
  hours: string;
  type: 'clinic' | 'optical';
  coordinates: { lat: number; lng: number };
}

export interface Clinician {
  id: string;
  name: string;
  role: string;
  specialties: string[];
  image: string;
  branchId?: string; // Link to specific branch
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  image: string;
}

export type ViewType = 'home' | 'services' | 'treatments' | 'shop' | 'booking' | 'corporate' | 'about' | 'branch' | 'cart' | 'admin' | 'contact' | 'teams';
