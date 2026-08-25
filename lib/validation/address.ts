export interface AddressFormData {
  name: string;
  address: string;
  pincode: string;
  location: string;
  landmark: string;
}

export function validateAddress(data: AddressFormData): string | null {
  if (!data.name.trim()) return "Please enter your name";
  if (data.name.trim().length < 3) return "Name must be at least 3 characters";
  if (!data.address.trim()) return "Please enter your delivery address";
  if (data.address.trim().length < 10) return "Address must be at least 10 characters";
  if (!/^\d{6}$/.test(data.pincode)) return "Please enter a valid 6-digit PIN code";
  if (!data.location.trim()) return "Please select a delivery location";
  if (data.landmark.trim() && data.landmark.trim().length < 3)
    return "Landmark must be at least 3 characters";
  return null;
}
