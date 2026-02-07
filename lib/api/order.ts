const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export interface CheckoutOtpResponse {
  status: string;
  data: {
    message: string;
  };
}

export async function sendCheckoutOtp(mobile: string): Promise<CheckoutOtpResponse> {
  const response = await fetch(
    `${API_BASE_URL}/mathsya.mathsya.api.order.checkout`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mobile }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to send OTP: ${response.status}`);
  }

  return response.json();
}

export interface VerifyOtpResponse {
  status: string;
  data: {
    token: string;
  };
}

export async function verifyCheckoutOtp(
  mobile: string,
  code: string
): Promise<VerifyOtpResponse> {
  const response = await fetch(
    `${API_BASE_URL}/mathsya.mathsya.api.auth.verify`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mobile, code, context: "checkout" }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to verify OTP: ${response.status}`);
  }

  return response.json();
}

export interface Customer {
  name: string;
  customer_name: string;
  contact_number: string;
  address: string;
  pin_code: string;
  location: string;
  landmark: string | null;
}

export interface GetCustomerResponse {
  status: string;
  data: {
    customer: Customer;
  };
}

export async function getCustomer(token: string): Promise<Customer | null> {
  const response = await fetch(
    `${API_BASE_URL}/mathsya.mathsya.api.customer.get`,
    {
      method: "GET",
      headers: {
        "X-Auth-Token": token,
      },
    }
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to get customer: ${response.status}`);
  }

  const data: GetCustomerResponse = await response.json();
  return data.data.customer;
}

export interface GetLocationsResponse {
  status: string;
  data: {
    locations: string[];
  };
}

export async function getDeliveryLocations(pincode: string): Promise<string[]> {
  const response = await fetch(
    `${API_BASE_URL}/mathsya.mathsya.api.delivery.get_locations?pincode=${pincode}`
  );

  if (!response.ok) {
    return [];
  }

  const data: GetLocationsResponse = await response.json();
  return data.data.locations;
}

export interface CustomerData {
  name: string;
  address: string;
  pin_code: string;
  location: string;
  landmark?: string;
}

export async function createCustomer(
  token: string,
  data: CustomerData
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/mathsya.mathsya.api.customer.create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Token": token,
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok && response.status !== 400) {
    throw new Error(`Failed to create customer: ${response.status}`);
  }
}

export async function updateCustomer(
  token: string,
  data: CustomerData
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/mathsya.mathsya.api.customer.update`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Token": token,
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to update customer: ${response.status}`);
  }
}

export interface OrderItem {
  product: string;
  variant: string;
  quantity: number;
}

export interface CreateOrderResponse {
  status: string;
  data: {
    message: string;
    order_id: string;
    total_amount: number;
  };
}

export async function createOrder(
  token: string,
  items: OrderItem[]
): Promise<CreateOrderResponse> {
  const response = await fetch(
    `${API_BASE_URL}/mathsya.mathsya.api.order.create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Token": token,
      },
      body: JSON.stringify({ items }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Failed to create order: ${response.status}`);
  }

  return response.json();
}
