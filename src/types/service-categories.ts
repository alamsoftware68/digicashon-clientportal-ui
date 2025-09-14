// Backend API response types
export interface ServiceItem {
  id: number;
  serviceTitle: string;
  serviceDescription: string;
  bulletPoints: string[];
  serviceIcon: string;
  price: number;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceCategoryGroup {
  categoryId: number;
  categoryName: string;
  categoryDescription: string;
  categoryIcon: string;
  displayOrder: number;
  serviceCount: number;
  bulletPoint1: string;
  bulletPoint2: string;
  services: ServiceItem[];
}

export interface ServiceCategoriesResponse {
  totalCategories: number;
  totalServices: number;
  availableCategories: string[];
  categoryGroups: ServiceCategoryGroup[];
}

// Frontend component types (for compatibility with existing UI)
export interface UIServiceItem {
  id: number;
  name: string;
  price: number;
  description: string;
  image?: string;
  features: string[];
  badge?: string;
}

export interface UIServiceCategory {
  id: string;
  name: string;
  icon: string;
  services: UIServiceItem[];
  bulletPoints: string[];
  description: string;
}

// Utility function to transform backend data to UI format
export const transformServiceCategories = (backendData: ServiceCategoriesResponse): UIServiceCategory[] => {
  return backendData.categoryGroups.map(category => ({
    id: category.categoryName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    name: category.categoryName,
    icon: getCategoryIcon(category.categoryName),
    description: category.categoryDescription,
    bulletPoints: [category.bulletPoint1, category.bulletPoint2].filter(Boolean),
    services: category.services.map(service => ({
      id: service.id,
      name: service.serviceTitle,
      price: service.price,
      description: service.serviceDescription,
      features: service.bulletPoints,
      image: getServiceImage(service.serviceTitle, category.categoryName), // Fallback images
    }))
  }));
};

// Helper function to get category icons
const getCategoryIcon = (categoryName: string): string => {
  const iconMap: { [key: string]: string } = {
    'Home Visit': '🏠',
    'Repair Service': '🔧',
    'Laptop/Desktop Service': '💻',
    'Add-On Service': '➕',
  };
  return iconMap[categoryName] || '⚙️';
};

// Helper function to get fallback service images
const getServiceImage = (serviceTitle: string, categoryName: string): string => {
  const imageMap: { [key: string]: string } = {
    'Windows Laptop': '/images/laptop-repair-1.jpg',
    'Desktop': '/images/laptop-repair-2.jpg',
    'MacBook': '/images/laptop-repair-3.jpg',
    'Software Issue': '/images/laptop-repair-4.jpg',
    'Charging Issue': '/images/Laptop-service.jpg',
    'Display Issue': '/images/laptop-repair-1.jpg',
    'Keyboard Issue': '/images/laptop-repair-2.jpg',
    'Overheating Issue': '/images/laptop-repair-3.jpg',
    'Physical Damage': '/images/laptop-repair-4.jpg',
    'Port Issue': '/images/Laptop-service.jpg',
    'Slow Performance': '/images/laptop-repair-1.jpg',
    'Speaker Issue': '/images/laptop-repair-2.jpg',
    'Touchpad Issue': '/images/laptop-repair-3.jpg',
    'Unknown Issue': '/images/laptop-repair-4.jpg',
    'Basic Service': '/images/Laptop-service.jpg',
    'Advanced Service': '/images/laptop-repair-1.jpg',
    'Gaming Laptop Service': '/images/laptop-repair-2.jpg',
    'Business Laptop Service': '/images/laptop-repair-3.jpg',
    'Data Recovery': '/images/laptop-repair-4.jpg',
    'Software Installation': '/images/Laptop-service.jpg',
    'Hardware Upgrade': '/images/laptop-repair-1.jpg',
    'Antivirus Setup': '/images/laptop-repair-2.jpg',
    'System Backup': '/images/laptop-repair-3.jpg',
  };
  
  return imageMap[serviceTitle] || '/images/laptop-repair-1.jpg';
};
