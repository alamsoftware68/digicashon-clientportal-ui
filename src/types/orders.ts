// Order-related TypeScript interfaces

export interface OrderService {
  quantity: number;
  totalPrice: number;
  price: number;
  name: string;
  category: string;
}

export interface OrderAddress {
  id: number;
  type: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
  fullAddress: string;
}

export interface OrderServiceDetails {
  id: number;
  name: string;
  description: string;
  deviceType: string;
  basePrice: number;
  estimatedDurationHours: number;
  isActive: boolean;
  isFeatured: boolean;
  imageUrl?: string;
  badge?: string;
}

export interface Order {
  id: number;
  createdAt: string;
  updatedAt: string;
  version: number;
  orderNumber: string;
  status: string;
  totalPrice: number;
  problemDescription: string;
  solutionDescription?: string;
  scheduledDate?: string;
  completedDate?: string;
  pickupAddress: string;
  customerNotes?: string;
  technicianNotes?: string;
  service: OrderServiceDetails;
  services?: OrderService[]; // Support for multiple services
  technician?: any;
  address: OrderAddress;
}

export interface PlaceOrderRequest {
  addressId: number;
  problemDescription: string;
  customerNotes?: string;
}

export interface PlaceOrderResponse {
  totalAmount: number;
  orderNumber: string;
  address: string;
  orderId: number;
  success: boolean;
  services: OrderService[];
  message: string;
  orderDate: string;
  status: string;
  itemCount: number;
}

export interface OrderStatus {
  PENDING: string;
  CONFIRMED: string;
  IN_PROGRESS: string;
  COMPLETED: string;
  CANCELLED: string;
  REFUNDED: string;
}

export const ORDER_STATUS_DISPLAY: Record<string, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  REFUNDED: 'Refunded'
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-purple-100 text-purple-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-gray-100 text-gray-800'
};
