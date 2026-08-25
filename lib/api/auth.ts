const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiRequestError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export interface LoginOtpResponse {
  status: string;
  data: {
    customer: string;
  };
}

export async function sendLoginOtp(mobile: string): Promise<LoginOtpResponse> {
  const response = await fetch(`${API_BASE_URL}/mathsya.mathsya.api.auth.login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mobile }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new ApiRequestError(
      errorData?.message || `Failed to send OTP: ${response.status}`,
      response.status
    );
  }

  return response.json();
}

export interface VerifyLoginOtpResponse {
  status: string;
  data: {
    token: string;
  };
}

export async function verifyLoginOtp(
  mobile: string,
  code: string
): Promise<VerifyLoginOtpResponse> {
  const response = await fetch(`${API_BASE_URL}/mathsya.mathsya.api.auth.verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mobile, code, context: "login" }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new ApiRequestError(
      errorData?.message || `Failed to verify OTP: ${response.status}`,
      response.status
    );
  }

  return response.json();
}
