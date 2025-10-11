// Razorpay Integration Utility
// Replace these with your actual Razorpay credentials
export const RAZORPAY_KEY_ID = "rzp_test_YOUR_KEY_ID_HERE";

export interface RazorpayOptions {
  key: string;
  amount: number; // Amount in paise (₹1 = 100 paise)
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id?: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: {
    [key: string]: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
      close: () => void;
    };
  }
}

// Load Razorpay script
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Check if script is already loaded
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

// Initialize Razorpay payment
export const initiateRazorpayPayment = async (
  options: Omit<RazorpayOptions, "key">
): Promise<void> => {
  const scriptLoaded = await loadRazorpayScript();

  if (!scriptLoaded) {
    throw new Error("Failed to load Razorpay SDK. Please check your internet connection.");
  }

  const razorpayOptions: RazorpayOptions = {
    key: RAZORPAY_KEY_ID,
    ...options,
    theme: {
      color: "#dc2626", // E-Summit primary color (red)
      ...options.theme,
    },
  };

  const razorpay = new window.Razorpay(razorpayOptions);
  razorpay.open();
};

// Create order on backend (mock for now)
// In production, this should call your backend API
export const createRazorpayOrder = async (
  amount: number,
  currency: string = "INR"
): Promise<{ id: string; amount: number; currency: string }> => {
  // Mock API call - Replace with actual backend call
  // Example: const response = await fetch('/api/create-order', { method: 'POST', body: JSON.stringify({ amount, currency }) })
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `order_${Date.now()}`, // Mock order ID
        amount: amount,
        currency: currency,
      });
    }, 500);
  });
};

// Verify payment on backend (mock for now)
// In production, this should call your backend API to verify the payment signature
export const verifyRazorpayPayment = async (
  paymentId: string,
  orderId: string,
  signature: string
): Promise<boolean> => {
  // Mock API call - Replace with actual backend verification
  // Example: const response = await fetch('/api/verify-payment', { method: 'POST', body: JSON.stringify({ paymentId, orderId, signature }) })
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true); // Mock successful verification
    }, 500);
  });
};

// Format amount to paise (Razorpay uses smallest currency unit)
export const convertToPaise = (rupees: number): number => {
  return Math.round(rupees * 100);
};

// Format amount from paise to rupees
export const convertToRupees = (paise: number): number => {
  return paise / 100;
};
