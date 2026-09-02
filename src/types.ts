export type TravelCategory =
  | 'all'
  | 'umroh-religi'
  | 'islamic-heritage'
  | 'halal-world'
  | 'vip-luxury';

export interface Destination {
  id: string;
  title: string;
  subtitle: string;
  country: string;
  region: string;
  category: TravelCategory;
  image: string;
  duration: string;
  priceFrom: string;
  rating: number;
  reviewsCount: number;
  badge?: string;
  hotelStar: number;
  airlines: string;
  highlights: string[];
  description: string;
}

export interface TravelPackage {
  id: string;
  title: string;
  category: TravelCategory;
  destination: string;
  duration: string;
  departureMonth: string;
  price: string;
  originalPrice?: string;
  airline: string;
  hotel: string;
  isBestSeller?: boolean;
  slotsLeft: number;
  inclusions: string[];
  itinerary: { day: string; title: string; desc: string }[];
}

export interface StatItem {
  value: string;
  label: string;
  detail: string;
  iconName: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  avatar: string;
  packageTaken: string;
  rating: number;
  review: string;
  year: string;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  location: string;
  category: string;
  imageUrl: string;
}

export interface WhyChooseUsFeature {
  id: string;
  title: string;
  description: string;
  iconName: string;
  highlight: string;
}

export interface PosterItem {
  id: string;
  title: string;
  category: 'Umroh' | 'Haji' | 'Wisata Halal' | 'Panduan';
  format: 'JPG' | 'PDF';
  fileSize: string;
  uploadDate: string;
  description: string;
  thumbnailUrl: string;
  downloadUrl?: string;
  fileName: string;
  isDummy?: boolean;
}
