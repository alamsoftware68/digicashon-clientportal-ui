// Backend API response types for address management
export interface BackendAddress {
  id: number;
  type: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  fullAddress: string;
}

// Frontend Address interface (for compatibility with AuthContext)
export interface Address {
  id: string;
  type: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

// Address form data interface
export interface AddressFormData {
  type: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault?: boolean;
}

// Utility function to transform backend address to frontend format
export const transformBackendAddress = (backendAddress: BackendAddress): Address => ({
  id: backendAddress.id.toString(),
  type: backendAddress.type,
  address: backendAddress.address,
  city: backendAddress.city,
  state: backendAddress.state,
  zipCode: backendAddress.zipCode,
  isDefault: backendAddress.isDefault,
});

// Utility function to transform backend address array to frontend format
export const transformBackendAddresses = (backendAddresses: BackendAddress[]): Address[] => 
  backendAddresses.map(transformBackendAddress);

// Utility function to prepare address data for API requests
export const prepareAddressForAPI = (formData: AddressFormData): AddressFormData => ({
  type: formData.type.trim(),
  address: formData.address.trim(),
  city: formData.city.trim(),
  state: formData.state.trim(),
  zipCode: formData.zipCode.trim(),
  isDefault: Boolean(formData.isDefault),
});
