"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Lottie from "lottie-react";
import paymentCompleteAnimation from "@/public/images/payment-complete.json";
import { ArrowLeft, Trash2, ChevronDown, ChevronUp, ShoppingBag } from "lucide-react";
import { useCart, type CartItem } from "@/lib/cart-context";
import { getVariantDisplayName } from "@/lib/api/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { cn } from "@/lib/utils";
import {
  sendCheckoutOtp,
  verifyCheckoutOtp,
  getCustomer,
  getDeliveryLocations,
  createCustomer,
  updateCustomer,
  createOrder,
  getPaymentStatus,
  type Customer,
} from "@/lib/api/order";

declare global {
  interface Window {
    Paytm?: {
      CheckoutJS: {
        onLoad: (cb: () => void) => void;
        init: (config: object) => Promise<void>;
        invoke: () => void;
      };
    };
  }
}

async function invokePaytm(config: object): Promise<void> {
  if (!window.Paytm?.CheckoutJS) {
    throw new Error("Payment gateway not loaded. Please refresh and try again.");
  }
  await window.Paytm.CheckoutJS.init(config);
  window.Paytm.CheckoutJS.invoke();
}

type CheckoutStep = "cart" | "phone" | "otp" | "details" | "success";

function StepIndicator({ current }: { current: CheckoutStep }) {
  if (current === "cart" || current === "success") return null;
  const steps = [
    { key: "phone", label: "Mobile" },
    { key: "otp", label: "Verify" },
    { key: "details", label: "Details" },
  ] as const;
  const stepOrder = ["phone", "otp", "details"] as const;
  const currentIndex = stepOrder.indexOf(current as (typeof stepOrder)[number]);

  return (
    <div className="flex items-center justify-center lg:justify-start gap-2 mb-8">
      {steps.map((s, i) => (
        <div key={s.key} className="flex items-center gap-1.5">
          <div
            className={cn(
              "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition-colors shrink-0",
              currentIndex === i
                ? "bg-primary text-primary-foreground"
                : currentIndex > i
                  ? "bg-green-100 text-green-700"
                  : "bg-muted text-muted-foreground"
            )}
          >
            {currentIndex > i ? "✓" : i + 1}
          </div>
          <span className="text-xs text-muted-foreground">{s.label}</span>
          {i < steps.length - 1 && <div className="h-px w-5 bg-border ml-1" />}
        </div>
      ))}
    </div>
  );
}

function OrderSummary({
  items,
  cartTotal,
  editable,
  removeFromCart,
  updateQuantity,
}: {
  items: CartItem[];
  cartTotal: number;
  editable: boolean;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, q: number) => void;
}) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.variantId} className="flex gap-3">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
              sizes="56px"
            />
          </div>
          <div className="flex flex-1 flex-col gap-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {getVariantDisplayName(item.variantName)} · ₹{item.price}/kg
                </p>
              </div>
              {editable && (
                <button
                  onClick={() => removeFromCart(item.variantId)}
                  className="shrink-0 text-muted-foreground hover:text-destructive transition-colors"
                  aria-label="Remove"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <div className="flex items-center justify-between">
              {editable ? (
                <QuantitySelector
                  compact
                  quantity={item.quantity}
                  onChange={(q) => updateQuantity(item.variantId, q)}
                />
              ) : (
                <span className="text-xs text-muted-foreground">{item.quantity} kg</span>
              )}
              <span className="text-sm font-bold text-green-700">
                ₹{(item.price * item.quantity).toFixed(0)}
              </span>
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-between items-center pt-3 border-t border-border">
        <span className="text-sm text-muted-foreground">Total</span>
        <span className="text-lg font-bold text-green-700">₹{cartTotal.toFixed(0)}</span>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, cartCount, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();
  const [mounted, setMounted] = useState(false);

  const [step, setStep] = useState<CheckoutStep>("cart");
  const [summaryOpen, setSummaryOpen] = useState(false);

  // Phone / OTP
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  // Address
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [location, setLocation] = useState("");
  const [landmark, setLandmark] = useState("");
  const [locations, setLocations] = useState<string[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  // Order
  const [checkoutToken, setCheckoutToken] = useState("");
  const [savedCustomer, setSavedCustomer] = useState<Customer | null>(null);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [placing, setPlacing] = useState(false);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [deliveryError, setDeliveryError] = useState("");

  const pollPaymentStatus = useCallback(async (token: string, orderId: string) => {
    console.log("[Paytm] Starting payment status polling for order:", orderId);
    setVerifyingPayment(true);
    const MAX_ATTEMPTS = 6;
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      await new Promise((r) => setTimeout(r, 2000));
      try {
        const result = await getPaymentStatus(token, orderId);
        const status = result.data.payment_status;
        console.log(`[Paytm] Poll attempt ${i + 1} — payment_status: "${status}"`);
        if (status === "Completed" || status === "Success") {
          clearCart();
          setVerifyingPayment(false);
          setPlacing(false);
          setStep("success");
          return;
        } else if (status === "Failed" || status === "Cancelled") {
          setVerifyingPayment(false);
          setPlacing(false);
          setPaymentError("Payment failed. Please try again.");
          return;
        }
      } catch (err) {
        console.log(`[Paytm] Poll attempt ${i + 1} — error:`, err);
      }
    }
    setVerifyingPayment(false);
    setPlacing(false);
    setPaymentError("Payment is pending. If you were charged, please contact us.");
  }, [clearCart]);

  useEffect(() => {
    setMounted(true);

    const params = new URLSearchParams(window.location.search);
    const errorCode = params.get("errorCode");
    const errorMessage = params.get("errorMessage");

    try {
      const saved = sessionStorage.getItem("mathsya-checkout-session");
      if (saved) {
        const s = JSON.parse(saved);
        sessionStorage.removeItem("mathsya-checkout-session");

        setCheckoutToken(s.token);
        setPhone(s.phone);
        setSavedCustomer(s.savedCustomer);
        setIsEditingAddress(s.isEditingAddress);
        setName(s.name);
        setAddress(s.address);
        setPincode(s.pincode);
        setLocation(s.location);
        setLandmark(s.landmark);
        setOrderId(s.orderId);
        setStep("details");

        if (errorCode) {
          window.history.replaceState({}, "", "/checkout");
          setPaymentError(errorMessage ?? "Payment failed. Please try again.");
        } else if (s.paymentInitiated) {
          // Paytm redirected the page — resume polling to confirm outcome
          setPlacing(true);
          pollPaymentStatus(s.token, s.orderId);
        }
      } else if (errorCode) {
        window.history.replaceState({}, "", "/checkout");
      }
    } catch {}
  }, [pollPaymentStatus]);

  useEffect(() => {
    if (pincode.length === 6) {
      setLoadingLocations(true);
      setDeliveryError("");
      getDeliveryLocations(pincode)
        .then((locs) => {
          setLocations(locs);
          if (locs.length === 0) {
            setDeliveryError("We don't deliver to that PIN code yet");
            setLocation("");
          } else if (!locs.includes(location)) {
            setLocation("");
          }
        })
        .finally(() => setLoadingLocations(false));
    } else {
      setLocations([]);
    }
  }, [pincode]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setPhoneError("Please enter a valid 10-digit mobile number");
      return;
    }
    setSendingOtp(true);
    try {
      await sendCheckoutOtp(phone);
      setStep("otp");
    } catch {
      setPhoneError("Failed to send OTP. Please try again.");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setOtpError("Please enter the 6-digit OTP");
      return;
    }
    setVerifyingOtp(true);
    try {
      const response = await verifyCheckoutOtp(phone, otp);
      const token = response.data.token;
      setCheckoutToken(token);
      const customer = await getCustomer(token);
      setSavedCustomer(customer);
      setStep("details");
    } catch {
      setOtpError("Invalid OTP. Please try again.");
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const needsForm = !savedCustomer || isEditingAddress;

    if (needsForm) {
      if (!name.trim()) { setDeliveryError("Please enter your name"); return; }
      if (name.trim().length < 3) { setDeliveryError("Name must be at least 3 characters"); return; }
      if (!address.trim()) { setDeliveryError("Please enter your delivery address"); return; }
      if (address.trim().length < 10) { setDeliveryError("Address must be at least 10 characters"); return; }
      if (!/^\d{6}$/.test(pincode)) { setDeliveryError("Please enter a valid 6-digit PIN code"); return; }
      if (!location.trim()) { setDeliveryError("Please select a delivery location"); return; }
      if (landmark.trim() && landmark.trim().length < 3) { setDeliveryError("Landmark must be at least 3 characters"); return; }
    }

    setPaymentError("");
    setPlacing(true);
    let paytmInvoked = false;
    try {
      if (needsForm) {
        const customerData = {
          name: name.trim(),
          address: address.trim(),
          pin_code: pincode,
          location,
          landmark: landmark.trim() || undefined,
        };
        if (!savedCustomer) {
          await createCustomer(checkoutToken, customerData);
        } else {
          await updateCustomer(checkoutToken, customerData);
        }
      }

      const orderItems = items.map((item) => ({
        product: item.productId,
        variant: item.variantId,
        quantity: item.quantity,
      }));
      const orderResponse = await createOrder(checkoutToken, orderItems);

      const currentOrderId = orderResponse.data.order_id;
      const currentToken = checkoutToken;
      let txnStatusReceived = false;

      const paytmConfig = {
        root: "",
        flow: "DEFAULT",
        redirect: false,
        data: {
          orderId: currentOrderId,
          token: orderResponse.data.txn_token,
          tokenType: "TXN_TOKEN",
          amount: String(orderResponse.data.total_amount),
        },
        handler: {
          transactionStatus(data: unknown) {
            console.log("[Paytm] transactionStatus fired:", data);
            txnStatusReceived = true;
            pollPaymentStatus(currentToken, currentOrderId);
          },
          notifyMerchant(eventName: string, data: unknown) {
            console.log("[Paytm] notifyMerchant:", eventName, data);
            if (eventName === "APP_CLOSED" && !txnStatusReceived) {
              setPlacing(false);
              setPaymentError("Payment cancelled. Try again when you're ready.");
            }
          },
        },
      };

      setOrderId(currentOrderId);

      sessionStorage.setItem("mathsya-checkout-session", JSON.stringify({
        token: checkoutToken,
        phone,
        savedCustomer,
        isEditingAddress,
        name,
        address,
        pincode,
        location,
        landmark,
        orderId: currentOrderId,
        paymentInitiated: true,
      }));

      await invokePaytm(paytmConfig);
      paytmInvoked = true;
    } catch (error) {
      setDeliveryError(
        error instanceof Error ? error.message : "Failed to place order. Please try again."
      );
    } finally {
      if (!paytmInvoked) setPlacing(false);
    }
  };

  const handleChangeAddress = () => {
    if (savedCustomer) {
      setName(savedCustomer.customer_name);
      setAddress(savedCustomer.address);
      setPincode(savedCustomer.pin_code);
      setLocation(savedCustomer.location);
      setLandmark(savedCustomer.landmark || "");
    }
    setIsEditingAddress(true);
  };

  const goBack = () => {
    if (step === "otp") setStep("phone");
    else if (step === "details") setStep("otp");
    else if (step === "phone") setStep("cart");
  };

  // Success screen
  if (step === "success") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <Lottie
          animationData={paymentCompleteAnimation}
          loop={false}
          className="h-44 w-44"
        />
        <h1 className="text-2xl font-bold mt-2">Order Confirmed!</h1>
        <p className="text-muted-foreground text-sm mt-2">
          Order reference:{" "}
          <span className="font-semibold text-foreground">{orderId}</span>
        </p>
        <p className="text-muted-foreground text-sm mt-4 max-w-xs leading-relaxed">
          Thank you! We&apos;ll contact you at{" "}
          <span className="font-medium text-foreground">+91 {phone}</span> with
          delivery updates.
        </p>
        <Button className="mt-8" size="lg" onClick={() => router.push("/")}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  const isMultiStep = step !== "cart";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top nav */}
      <div className={cn("sticky top-0 z-10 bg-background/95 backdrop-blur", (step === "otp" || step === "details") && "border-b")}>
        <div className="container mx-auto px-4 h-14 flex items-center">
          <button
            onClick={isMultiStep ? goBack : () => router.push("/")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {isMultiStep ? "Back" : "Continue Shopping"}
          </button>

          {(step === "otp" || step === "details") && (
            <h1 className="absolute left-1/2 -translate-x-1/2 font-semibold text-base">
              {step === "otp" && "Verify OTP"}
              {step === "details" && "Delivery Details"}
            </h1>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className={cn("flex-1 container mx-auto px-4 py-6 max-w-4xl", isMultiStep && "lg:pb-6 pb-24")}>
        {/* CART STEP */}
        {step === "cart" && (
          <div className="max-w-md mx-auto">
            {!mounted || items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                <ShoppingBag className="h-12 w-12 text-muted-foreground/40" />
                <p className="text-muted-foreground">Your bag is empty</p>
                <Link href="/">
                  <Button variant="outline">Browse Products</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-5">
                <OrderSummary
                  items={items}
                  cartTotal={cartTotal}
                  editable
                  removeFromCart={removeFromCart}
                  updateQuantity={updateQuantity}
                />
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => setStep("phone")}
                >
                  Checkout · ₹{cartTotal.toFixed(0)}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* MULTI-STEP */}
        {isMultiStep && (
          <div className="lg:grid lg:grid-cols-[1fr_340px] lg:gap-12 lg:items-start">
            {/* Left: form */}
            <div>
              <StepIndicator current={step} />

              {/* Phone */}
              {step === "phone" && (
                <div className="max-w-sm mx-auto lg:mx-0">
                  <p className="text-sm text-muted-foreground mb-5">
                    Enter your mobile number to receive an OTP
                  </p>
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="phone">Mobile Number</Label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm shrink-0">
                          +91
                        </span>
                        <Input
                          id="phone"
                          type="tel"
                          inputMode="numeric"
                          placeholder="10-digit number"
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                            setPhoneError("");
                          }}
                          className="rounded-l-none"
                          autoComplete="tel"
                          autoFocus
                        />
                      </div>
                      {phoneError && (
                        <p className="text-sm text-destructive">{phoneError}</p>
                      )}
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={sendingOtp}
                    >
                      {sendingOtp ? "Sending OTP..." : "Send OTP"}
                    </Button>
                  </form>
                </div>
              )}

              {/* OTP */}
              {step === "otp" && (
                <div className="max-w-sm mx-auto lg:mx-0">
                  <p className="text-sm text-muted-foreground mb-5">
                    We sent a 6-digit OTP to{" "}
                    <span className="font-medium text-foreground">+91 {phone}</span>
                  </p>
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="otp">OTP</Label>
                      <Input
                        id="otp"
                        type="text"
                        inputMode="numeric"
                        placeholder="6-digit code"
                        value={otp}
                        onChange={(e) => {
                          setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                          setOtpError("");
                        }}
                        autoComplete="one-time-code"
                        autoFocus
                      />
                      {otpError && (
                        <p className="text-sm text-destructive">{otpError}</p>
                      )}
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={verifyingOtp}
                    >
                      {verifyingOtp ? "Verifying..." : "Verify OTP"}
                    </Button>
                    <button
                      type="button"
                      onClick={() => {
                        setStep("phone");
                        setOtp("");
                        setOtpError("");
                      }}
                      className="text-sm text-muted-foreground underline underline-offset-2 w-full text-center"
                    >
                      Change number
                    </button>
                  </form>
                </div>
              )}

              {/* Details */}
              {step === "details" && (
                <div className="max-w-sm mx-auto lg:mx-0">
                  {paymentError && (
                    <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                      {paymentError}
                    </div>
                  )}
                  {savedCustomer && !isEditingAddress ? (
                    <div className="space-y-4">
                      <div className="rounded-xl border border-border p-4 space-y-1.5 bg-muted/30">
                        <p className="font-semibold text-sm">{savedCustomer.customer_name}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {savedCustomer.address}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {savedCustomer.location} · {savedCustomer.pin_code}
                        </p>
                        {savedCustomer.landmark && (
                          <p className="text-sm text-muted-foreground">
                            Near {savedCustomer.landmark}
                          </p>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={handleChangeAddress}
                      >
                        Change Address
                      </Button>
                      {deliveryError && (
                        <p className="text-sm text-destructive">{deliveryError}</p>
                      )}
                      <Button
                        className="w-full"
                        size="lg"
                        disabled={placing || verifyingPayment}
                        onClick={(e) => handlePlaceOrder(e as unknown as React.FormEvent)}
                      >
                        {verifyingPayment ? "Verifying payment..." : placing ? "Processing..." : "Proceed to Pay"}
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handlePlaceOrder} className="space-y-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          placeholder="Your name"
                          value={name}
                          onChange={(e) => { setName(e.target.value); setDeliveryError(""); }}
                          autoFocus
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="addr">Delivery Address</Label>
                        <Textarea
                          id="addr"
                          placeholder="House no, Street, Area"
                          value={address}
                          onChange={(e) => { setAddress(e.target.value); setDeliveryError(""); }}
                          className="min-h-20 resize-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="pincode">PIN Code</Label>
                          <Input
                            id="pincode"
                            inputMode="numeric"
                            placeholder="6-digit PIN"
                            value={pincode}
                            onChange={(e) => {
                              setPincode(e.target.value.replace(/\D/g, "").slice(0, 6));
                              setDeliveryError("");
                            }}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="loc">Location</Label>
                          <select
                            id="loc"
                            value={location}
                            onChange={(e) => { setLocation(e.target.value); setDeliveryError(""); }}
                            disabled={loadingLocations || locations.length === 0}
                            className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <option value="">
                              {loadingLocations
                                ? "Loading..."
                                : locations.length === 0
                                  ? "Enter PIN first"
                                  : "Select area"}
                            </option>
                            {locations.map((loc) => (
                              <option key={loc} value={loc}>{loc}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="landmark">
                          Landmark{" "}
                          <span className="text-muted-foreground font-normal">(optional)</span>
                        </Label>
                        <Input
                          id="landmark"
                          placeholder="Nearby landmark"
                          value={landmark}
                          onChange={(e) => setLandmark(e.target.value)}
                        />
                      </div>
                      {deliveryError && (
                        <p className="text-sm text-destructive">{deliveryError}</p>
                      )}
                      <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={placing || verifyingPayment}
                      >
                        {verifyingPayment ? "Verifying payment..." : placing ? "Processing..." : "Proceed to Pay"}
                      </Button>
                    </form>
                  )}
                </div>
              )}
            </div>

            {/* Right: order summary — desktop only */}
            <div className="hidden lg:block sticky top-20">
              <div className="rounded-xl border border-border p-5 space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Order Summary
                </h3>
                <OrderSummary
                  items={items}
                  cartTotal={cartTotal}
                  editable={false}
                  removeFromCart={removeFromCart}
                  updateQuantity={updateQuantity}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile: collapsible order summary bar on multi-step */}
      {isMultiStep && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 border-t bg-background shadow-md z-20">
          <button
            onClick={() => setSummaryOpen((o) => !o)}
            className="w-full px-4 py-3 flex items-center justify-between"
          >
            <span className="text-sm font-medium">
              {cartCount} {cartCount === 1 ? "item" : "items"}
            </span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-green-700 text-sm">
                ₹{cartTotal.toFixed(0)}
              </span>
              {summaryOpen ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </button>
          {summaryOpen && (
            <div className="px-4 pb-4 pt-1 max-h-56 overflow-y-auto border-t">
              <OrderSummary
                items={items}
                cartTotal={cartTotal}
                editable={false}
                removeFromCart={removeFromCart}
                updateQuantity={updateQuantity}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
