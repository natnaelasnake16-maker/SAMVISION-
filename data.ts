
import { Product, Service, Branch, Clinician, BlogPost, Testimonial } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    sku: 'SV-P1',
    name: 'Leah Geometric',
    brand: 'SamVision Elite',
    collection: 'New Arrival',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=400&h=400&auto=format&fit=crop',
    category: 'frames',
    gender: 'Women',
    shape: 'Square',
    material: 'Acetate',
    rimType: 'Full Rim',
    isZeissCompatible: true,
    lensCompatibility: ['Single Vision'],
    tags: ['New'],
    rating: 5.0,
    colors: ['#D4AF37', '#C0C0C0'],
    stockPerBranch: {
      '11111111-1111-4111-8111-111111111111': { quantity: 15, lowStockThreshold: 5, status: 'In stock' }
    },
    status: 'Active',
    homepageFlags: {
      isNew: true,
      isPopular: false,
      isDiscountPromo: false
    }
  },
  {
    id: 'p2',
    sku: 'SV-P2',
    name: 'Amanda Round',
    brand: 'Zeiss Vision',
    collection: 'Premium',
    price: 3200,
    image: 'https://images.unsplash.com/photo-1511499767350-a1590fdb7358?q=80&w=400&h=400&auto=format&fit=crop',
    category: 'frames',
    gender: 'Women',
    shape: 'Round',
    material: 'Metal',
    rimType: 'Full Rim',
    isZeissCompatible: true,
    lensCompatibility: ['Single Vision', 'Progressive'],
    tags: ['New'],
    rating: 5.0,
    colors: ['#000000', '#F5DEB3'],
    stockPerBranch: {
      '11111111-1111-4111-8111-111111111111': { quantity: 10, lowStockThreshold: 3, status: 'In stock' }
    },
    status: 'Active',
    homepageFlags: {
      isNew: true,
      isPopular: true,
      isDiscountPromo: false
    }
  },
  {
    id: 'p3',
    sku: 'SV-P3',
    name: 'Cyrus Rectangle',
    brand: 'SamVision Elite',
    collection: 'Budget',
    price: 6800,
    image: 'https://images.unsplash.com/photo-1509100104048-6373f65cd551?q=80&w=400&h=400&auto=format&fit=crop',
    category: 'frames',
    gender: 'Men',
    shape: 'Rectangle',
    material: 'Acetate',
    rimType: 'Full Rim',
    isZeissCompatible: true,
    lensCompatibility: ['Single Vision'],
    tags: ['New'],
    rating: 4.8,
    colors: ['#000080', '#8B4513', '#228B22', '#808080'],
    stockPerBranch: {
      '11111111-1111-4111-8111-111111111111': { quantity: 20, lowStockThreshold: 5, status: 'In stock' }
    },
    status: 'Active',
    homepageFlags: {
      isNew: false,
      isPopular: true,
      isDiscountPromo: false
    }
  },
  {
    id: 'p4',
    sku: 'SV-P4',
    name: 'Isaebella Cat-Eye',
    brand: 'SamVision Elite',
    collection: 'Popular',
    price: 1500,
    originalPrice: 4500,
    discountType: 'Percentage',
    discountValue: 67,
    image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?q=80&w=400&h=400&auto=format&fit=crop',
    category: 'frames',
    gender: 'Women',
    shape: 'Cat-Eye',
    material: 'Acetate',
    rimType: 'Full Rim',
    isZeissCompatible: true,
    lensCompatibility: ['Single Vision'],
    tags: ['Best-seller', 'Sale'],
    rating: 4.9,
    colors: ['#000000', '#8B4513', '#4169E1', '#E5E4E2', '#DC143C'],
    stockPerBranch: {
      '11111111-1111-4111-8111-111111111111': { quantity: 5, lowStockThreshold: 2, status: 'In stock' }
    },
    status: 'Active',
    homepageFlags: {
      isNew: false,
      isPopular: true,
      isDiscountPromo: true
    }
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Abebe Kebede',
    role: 'Cataract Patient',
    quote: "After my phaco surgery at SamVision, my sight was restored completely. The professionalism is unmatched in Ethiopia.",
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150&auto=format&fit=crop'
  },
  {
    id: 't2',
    name: 'Selamawit Tadesse',
    role: 'Corporate Client',
    quote: "Our entire staff received screenings and ZEISS lenses. The difference in productivity is noticeable.",
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&auto=format&fit=crop'
  },
  {
    id: 't3',
    name: 'Marta Hailu',
    role: 'Optical Customer',
    quote: "The frame selection is beautiful and the precision of the eye testing ensured I got the perfect prescription.",
    rating: 5,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&h=150&auto=format&fit=crop'
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'b1',
    title: 'Why Digital Eye Strain is on the Rise',
    excerpt: 'Protect your vision in the digital age with these 5 expert tips and ZEISS blue-light filters.',
    date: 'May 12, 2024',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=400&auto=format&fit=crop',
    category: 'Education'
  },
  {
    id: 'b2',
    title: 'Innovations in Cataract Surgery',
    excerpt: 'Discover how phacoemulsification technology at SamVision is changing outcomes.',
    date: 'April 28, 2024',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=400&auto=format&fit=crop',
    category: 'Medical'
  },
  {
    id: 'b3',
    title: 'Choosing the Right Frames for Your Face',
    excerpt: 'A guide to matching frame shapes with facial structures for the perfect look.',
    date: 'April 15, 2024',
    image: 'https://images.unsplash.com/photo-1511499767350-a1590fdb7358?q=80&w=400&h=400&auto=format&fit=crop',
    category: 'Style'
  }
];

export const SERVICES: Service[] = [
  {
    id: 's1',
    title: 'Comprehensive Eye Examination',
    description: 'Expert vision testing, refraction, and early detection of eye diseases performed by Dr. Fitsum Bekele Gulilat.',
    icon: 'Eye',
    category: 'clinical'
  },
  {
    id: 's2',
    title: 'Cataract Surgery (Phaco)',
    description: 'Modern Phacoemulsification and mature cataract surgery performed by our senior surgical team.',
    icon: 'Stethoscope',
    category: 'surgical'
  },
  {
    id: 's3',
    title: 'Pediatric Eye Care',
    description: 'Specialized care for children by Dr. Mandefro Sintayehu, focusing on strabismus and amblyopia.',
    icon: 'Baby',
    category: 'clinical'
  }
];

export const BRANCHES: Branch[] = [
  {
    id: '11111111-1111-4111-8111-111111111111',
    name: 'Bisrate Gebriel Branch',
    address: 'In front of Home Depot Sun Building, 3rd floor',
    phone: '+251 11369 2033',
    phone2: '+251 94154 5454',
    hours: 'Mon-Sat: 8:00 AM - 6:00 PM',
    type: 'clinic',
    coordinates: { lat: 9.005401, lng: 38.763611 }
  },
  {
    id: '22222222-2222-4222-8222-222222222222',
    name: 'Meskel Flower Branch',
    address: 'In front of Dream Liner Hotel James Building, 4th Floor',
    phone: '+251 11558 4428',
    phone2: '+251 94154 5454',
    hours: 'Mon-Sat: 8:00 AM - 6:00 PM',
    type: 'clinic',
    coordinates: { lat: 9.0234, lng: 38.7891 }
  },
  {
    id: '33333333-3333-4333-8333-333333333333',
    name: 'Bole Branch',
    address: 'In front of You Go Church, Leamir Building, 2nd Floor',
    phone: '+251 953377777',
    hours: 'Mon-Sun: 9:00 AM - 8:00 PM',
    type: 'optical',
    coordinates: { lat: 9.0012, lng: 38.7421 }
  },
  {
    id: '44444444-4444-4444-8444-444444444444',
    name: 'Olympia Branch',
    address: 'Olympia, on the way to Bambis Adjacent to ABC Trading, Hailu Wolde Building, Ground Floor',
    phone: '+251 946130000',
    hours: 'Mon-Sun: 9:00 AM - 7:00 PM',
    type: 'optical',
    coordinates: { lat: 9.0182, lng: 38.8012 }
  }
];

export const CLINICIANS: Clinician[] = [
  {
    id: 'c1',
    name: 'Dr. Fitsum Bekele Gulilat',
    role: 'Lead Ophthalmologist',
    specialties: ['Cataract Surgery', 'Comprehensive Eye Examination'],
    image: '/images/doctors/dr-fitsum.jpg',
    branchId: '11111111-1111-4111-8111-111111111111'
  },
  {
    id: 'c2',
    name: 'Dr. Mandefro Sintayehu',
    role: 'Pediatric Specialist',
    specialties: ['Pediatric Ophthalmology', 'Strabismus'],
    image: '/images/doctors/dr-mandefro.jpg',
    branchId: '11111111-1111-4111-8111-111111111111'
  },
  {
    id: 'c3',
    name: 'Dr. Addishiwot',
    role: 'Senior Ophthalmologist',
    specialties: ['General Ophthalmology', 'Cataract'],
    image: '/images/doctors/dr-addishiwot.jpg',
    branchId: '33333333-3333-4333-8333-333333333333'
  },
  {
    id: 'c4',
    name: 'Dr. Meriem Siraj',
    role: 'Senior Ophthalmologist',
    specialties: ['Cataract Surgery', 'General Ophthalmology'],
    image: '/images/doctors/dr-meryem.jpg',
    branchId: '11111111-1111-4111-8111-111111111111'
  },
  {
    id: 'c5',
    name: 'Dr. Daniel Gebiregziabher',
    role: 'Glaucoma Specialist',
    specialties: ['Glaucoma Diagnosis', 'Medical Management'],
    image: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?q=80&w=300&h=300&auto=format&fit=crop',
    branchId: '33333333-3333-4333-8333-333333333333'
  },
  {
    id: 'c6',
    name: 'Dr. Guteta G. Michael',
    role: 'Surgical Specialist',
    specialties: ['Phacoemulsification', 'Glaucoma Surgery'],
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=300&h=300&auto=format&fit=crop',
    branchId: '11111111-1111-4111-8111-111111111111'
  },
  {
    id: 'c7',
    name: 'Mihret Tsegaye',
    role: 'Optometrist',
    specialties: ['Refraction', 'Computer Vision Syndrome'],
    image: 'https://images.unsplash.com/photo-1607990281513-2c110a25bb8c?q=80&w=300&h=300&auto=format&fit=crop',
    branchId: '22222222-2222-4222-8222-222222222222'
  },
  {
    id: 'c8',
    name: 'Nardos Alemayehu',
    role: 'Optometrist',
    specialties: ['Refraction Errors', 'Contact Lenses'],
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&h=300&auto=format&fit=crop',
    branchId: '44444444-4444-4444-8444-444444444444'
  },
  {
    id: 'c9',
    name: 'Tewahido Haimanot',
    role: 'Optometrist',
    specialties: ['Computer Vision Syndrome', 'Pediatric Refraction'],
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=300&h=300&auto=format&fit=crop',
    branchId: '22222222-2222-4222-8222-222222222222'
  }
];

export const PARTNERS = [
  'Ethiopian Airlines',
  'Commercial Bank of Ethiopia',
  'Ethio Telecom',
  'Ministry of Health',
  'ZEISS Vision',
  'UNESCO',
  'UNDP',
  'CBE Birr'
];
