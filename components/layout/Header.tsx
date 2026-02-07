"use client";

import { useState, useEffect } from "react";
import { Search, Handbag, Trash2, ArrowLeft } from "lucide-react";
import Lottie from "lottie-react";
import paymentCompleteAnimation from "@/public/images/payment-complete.json";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LoginDialog } from "@/components/auth/LoginDialog";
import { useCart } from "@/lib/cart-context";
import { getVariantDisplayName } from "@/lib/api/products";
import { sendCheckoutOtp, verifyCheckoutOtp, getCustomer, getDeliveryLocations, createCustomer, updateCustomer, createOrder, type Customer } from "@/lib/api/order";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { QuantitySelector } from "@/components/ui/quantity-selector";

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
    <div className="flex items-center justify-center gap-2 px-4 pb-3">
      {steps.map((s, i) => (
        <div key={s.key} className="flex items-center gap-2">
          <div
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium",
              currentIndex === i
                ? "bg-primary text-primary-foreground"
                : currentIndex > i
                  ? "bg-green-100 text-green-700"
                  : "bg-muted text-muted-foreground"
            )}
          >
            {currentIndex > i ? "✓" : i + 1}
          </div>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            {s.label}
          </span>
          {i < steps.length - 1 && <div className="h-px w-6 bg-border" />}
        </div>
      ))}
    </div>
  );
}

export function Header() {
  const { items, cartCount, cartTotal, removeFromCart, updateQuantity } =
    useCart();

  // Checkout state
  const [step, setStep] = useState<CheckoutStep>("cart");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [location, setLocation] = useState("");
  const [landmark, setLandmark] = useState("");
  const [deliveryError, setDeliveryError] = useState("");
  const [placing, setPlacing] = useState(false);
  const [checkoutToken, setCheckoutToken] = useState("");

  // Saved address state (populated from API)
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [savedCustomer, setSavedCustomer] = useState<Customer | null>(null);

  // Order state
  const [orderId, setOrderId] = useState("");

  // Location dropdown state
  const [locations, setLocations] = useState<string[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  // Fetch locations when pincode is 6 digits
  useEffect(() => {
    if (pincode.length === 6) {
      setLoadingLocations(true);
      setDeliveryError("");
      getDeliveryLocations(pincode)
        .then((locs) => {
          setLocations(locs);
          if (locs.length === 0) {
            setDeliveryError("We have no delivery for that PIN code");
            setLocation("");
          } else if (!locs.includes(location)) {
            setLocation("");
          }
        })
        .finally(() => setLoadingLocations(false));
    } else {
      setLocations([]);
      setDeliveryError("");
    }
  }, [pincode]);

  // Populate form when editing saved address
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

  const resetCheckout = () => {
    setStep("cart");
    setPhone("");
    setPhoneError("");
    setOtp("");
    setOtpError("");
    setName("");
    setAddress("");
    setPincode("");
    setLocation("");
    setLandmark("");
    setDeliveryError("");
    setCheckoutToken("");
    setSavedCustomer(null);
    setIsEditingAddress(false);
    setLocations([]);
    setOrderId("");
  };

  const handleSheetOpenChange = (open: boolean) => {
    if (!open) resetCheckout();
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setPhoneError("Please enter a valid mobile number");
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
      setOtpError("Please enter a valid OTP");
      return;
    }
    setVerifyingOtp(true);
    try {
      const response = await verifyCheckoutOtp(phone, otp);
      const token = response.data.token;
      setCheckoutToken(token);

      // Fetch customer data
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

    // Only validate form fields if entering new address
    const needsFormValidation = !savedCustomer || isEditingAddress;

    if (needsFormValidation) {
      if (!name.trim()) {
        setDeliveryError("Please enter your name");
        return;
      }
      if (name.trim().length < 3) {
        setDeliveryError("Name must be at least 3 characters");
        return;
      }
      if (!address.trim()) {
        setDeliveryError("Please enter your delivery address");
        return;
      }
      if (address.trim().length < 10) {
        setDeliveryError("Address must be at least 10 characters");
        return;
      }
      if (!pincode.trim()) {
        setDeliveryError("Please enter your PIN code");
        return;
      }
      if (!/^\d{6}$/.test(pincode)) {
        setDeliveryError("Please enter a valid 6-digit PIN code");
        return;
      }
      if (!location.trim()) {
        setDeliveryError("Please select a delivery location");
        return;
      }
      if (landmark.trim() && landmark.trim().length < 3) {
        setDeliveryError("Landmark must be at least 3 characters");
        return;
      }
    }

    setPlacing(true);
    try {
      // Create or update customer only if form was used
      if (needsFormValidation) {
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

      // Create order
      const orderItems = items.map((item) => ({
        product: item.productId,
        variant: item.variantId,
        quantity: item.quantity,
      }));
      const orderResponse = await createOrder(checkoutToken, orderItems);
      setOrderId(orderResponse.data.order_id);
      setStep("success");
    } catch (error) {
      setDeliveryError(error instanceof Error ? error.message : "Failed to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-primary">
              Mathsya
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden flex-1 max-w-xl md:flex">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for fresh seafood..."
                className="w-full pl-10 pr-4"
              />
            </div>
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center gap-2">
            {/* Search Icon - Mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Login <LoginDialog /> */}
            

            {/* Shopping Cart */}
            <Sheet onOpenChange={handleSheetOpenChange}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  aria-label="Shopping Cart"
                >
                  <Handbag className="h-5 w-5" />
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-medium text-white">
                    {cartCount}
                  </span>
                </Button>
              </SheetTrigger>

              <SheetContent className="flex w-full flex-col sm:max-w-sm">
                <SheetHeader>
                  {step !== "cart" && step !== "success" && (
                    <button
                      type="button"
                      onClick={() =>
                        setStep(
                          step === "otp"
                            ? "phone"
                            : step === "details"
                              ? "otp"
                              : step === "phone"
                                ? "cart"
                                : "cart"
                        )
                      }
                      className="flex items-center gap-1 text-xs text-muted-foreground mb-1"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      Back
                    </button>
                  )}
                  <SheetTitle className="text-base sm:text-lg">
                    {step === "cart" && `Your Bag (${cartCount})`}
                    {step === "phone" && "Checkout"}
                    {step === "otp" && "Verify OTP"}
                    {step === "details" && "Delivery Details"}
                    {step === "success" && "Order Confirmed"}
                  </SheetTitle>
                  <SheetDescription className="text-xs sm:text-sm">
                    {step === "cart" &&
                      (cartCount === 0
                        ? "Your bag is empty"
                        : "Review your items before checkout")}
                    {step === "phone" && "Enter your mobile number to continue"}
                    {step === "otp" && `We sent a 6-digit OTP to +91 ${phone}`}
                    {step === "details" && "Where should we deliver?"}
                    {step === "success" && ""}
                  </SheetDescription>
                </SheetHeader>

                <StepIndicator current={step} />

                {/* Step: Cart */}
                {step === "cart" && (
                  <>
                    <div className="flex-1 overflow-y-auto px-3 sm:px-4">
                      {items.length === 0 ? (
                        <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
                          No items in your bag yet.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {items.map((item) => (
                            <div
                              key={item.variantId}
                              className="flex gap-2.5 rounded-lg border border-border p-2.5 sm:gap-3 sm:p-3"
                            >
                              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-muted sm:h-16 sm:w-16">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                  sizes="64px"
                                />
                              </div>
                              <div className="flex flex-1 flex-col">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <p className="text-xs font-medium text-foreground sm:text-sm">
                                      {item.name}
                                    </p>
                                    <p className="text-[11px] text-muted-foreground sm:text-xs">
                                      {getVariantDisplayName(item.variantName)} — ₹{item.price}/kg
                                    </p>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    onClick={() => removeFromCart(item.variantId)}
                                    aria-label="Remove item"
                                  >
                                    <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                                  </Button>
                                </div>
                                <div className="mt-1.5 flex items-center justify-between">
                                  <QuantitySelector
                                    compact
                                    quantity={item.quantity}
                                    onChange={(q) =>
                                      updateQuantity(item.variantId, q)
                                    }
                                  />
                                  <span className="text-xs font-bold text-green-700 sm:text-sm">
                                    ₹{(item.price * item.quantity).toFixed(0)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {items.length > 0 && (
                      <SheetFooter className="border-t border-border">
                        <div className="flex w-full items-center justify-between pb-1 sm:pb-2">
                          <span className="text-xs text-muted-foreground sm:text-sm">
                            Total
                          </span>
                          <span className="text-base font-bold text-green-700 sm:text-lg">
                            ₹{cartTotal.toFixed(0)}
                          </span>
                        </div>
                        <Button
                          className="w-full"
                          size="lg"
                          onClick={() => setStep("phone")}
                        >
                          Checkout
                        </Button>
                      </SheetFooter>
                    )}
                  </>
                )}

                {/* Step: Phone */}
                {step === "phone" && (
                  <div className="flex-1 px-3 sm:px-4">
                    <form onSubmit={handleSendOtp} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="checkout-phone">Mobile Number</Label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                            +91
                          </span>
                          <Input
                            id="checkout-phone"
                            type="tel"
                            inputMode="numeric"
                            placeholder="Your mobile number"
                            value={phone}
                            onChange={(e) => {
                              setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                              setPhoneError("");
                            }}
                            className="rounded-l-none placeholder:text-sm text-sm"
                            autoComplete="tel"
                            autoFocus
                          />
                        </div>
                        {phoneError && (
                          <p className="text-sm text-destructive">{phoneError}</p>
                        )}
                      </div>
                      <Button type="submit" className="w-full" disabled={sendingOtp}>
                        {sendingOtp ? "Sending OTP..." : "Send OTP"}
                      </Button>
                    </form>
                  </div>
                )}

                {/* Step: OTP */}
                {step === "otp" && (
                  <div className="flex-1 px-3 sm:px-4">
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="checkout-otp">Enter OTP</Label>
                        <Input
                          id="checkout-otp"
                          type="text"
                          inputMode="numeric"
                          placeholder="OTP Code (6 digits)"
                          value={otp}
                          onChange={(e) => {
                            setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                            setOtpError("");
                          }}
                          autoComplete="one-time-code"
                          autoFocus
                          className="placeholder:text-sm text-sm"
                        />
                        {otpError && (
                          <p className="text-xs text-destructive">{otpError}</p>
                        )}
                      </div>
                      <Button type="submit" className="w-full" disabled={verifyingOtp}>
                        {verifyingOtp ? "Verifying..." : "Verify OTP"}
                      </Button>
                      <button
                        type="button"
                        onClick={() => {
                          setStep("phone");
                          setOtp("");
                          setOtpError("");
                        }}
                        className="text-xs text-muted-foreground underline w-full text-center"
                      >
                        Change number
                      </button>
                    </form>
                  </div>
                )}

                {/* Step: Delivery Details */}
                {step === "details" && (
                  <div className="flex-1 overflow-y-auto px-3 sm:px-4">
                    {/* Saved Address Display */}
                    {savedCustomer && !isEditingAddress ? (
                      <div className="space-y-4">
                        <div className="rounded-lg border border-border p-4 space-y-2">
                          <p className="font-medium text-sm">{savedCustomer.customer_name}</p>
                          <p className="text-sm text-muted-foreground whitespace-pre-line">
                            {savedCustomer.address}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {savedCustomer.location} - {savedCustomer.pin_code}
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
                          <p className="text-xs text-destructive">{deliveryError}</p>
                        )}
                        <Button
                          type="button"
                          className="w-full"
                          size="lg"
                          disabled={placing}
                          onClick={(e) => handlePlaceOrder(e as unknown as React.FormEvent)}
                        >
                          {placing ? "Placing Order..." : "Proceed"}
                        </Button>
                      </div>
                    ) : (
                      /* Address Form */
                      <form onSubmit={handlePlaceOrder} className="space-y-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="checkout-name">Your Name</Label>
                          <Input
                            id="checkout-name"
                            placeholder="Full name"
                            value={name}
                            onChange={(e) => {
                              setName(e.target.value);
                              setDeliveryError("");
                            }}
                            autoFocus
                            className="placeholder:text-sm text-sm"
                          />
                        </div>
                        <div className="space-y-1.5 mt-8">
                          <Label htmlFor="checkout-address">Delivery Address</Label>
                          <Textarea
                            id="checkout-address"
                            placeholder="House no, Street, Area"
                            value={address}
                            onChange={(e) => {
                              setAddress(e.target.value);
                              setDeliveryError("");
                            }}
                            className="placeholder:text-sm text-sm min-h-15"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <Label htmlFor="checkout-pincode">Pin Code</Label>
                            <Input
                              id="checkout-pincode"
                              inputMode="numeric"
                              placeholder="Pin Code"
                              value={pincode}
                              onChange={(e) => {
                                setPincode(e.target.value.replace(/\D/g, "").slice(0, 6));
                                setDeliveryError("");
                              }}
                              className="placeholder:text-sm text-sm"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="checkout-location">Location</Label>
                            <select
                              id="checkout-location"
                              value={location}
                              onChange={(e) => {
                                setLocation(e.target.value);
                                setDeliveryError("");
                              }}
                              disabled={loadingLocations || locations.length === 0}
                              className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <option value="">
                                {loadingLocations
                                  ? "Loading..."
                                  : locations.length === 0
                                    ? "Enter pincode"
                                    : "Select location"}
                              </option>
                              {locations.map((loc) => (
                                <option key={loc} value={loc}>
                                  {loc}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="space-y-1.5 mt-8">
                          <Label htmlFor="checkout-landmark">Landmark</Label>
                          <Input
                            id="checkout-landmark"
                            placeholder="Enter a nearby landmark"
                            value={landmark}
                            onChange={(e) => setLandmark(e.target.value)}
                            className="placeholder:text-sm text-sm"
                          />
                        </div>
                        {deliveryError && (
                          <p className="text-xs text-destructive">{deliveryError}</p>
                        )}
                        <Button
                          type="submit"
                          className="w-full"
                          size="lg"
                          disabled={placing}
                        >
                          {placing ? "Placing Order..." : "Proceed"}
                        </Button>
                      </form>
                    )}
                  </div>
                )}

                {/* Step: Success */}
                {step === "success" && (
                  <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
                    <Lottie animationData={paymentCompleteAnimation} loop={false} className="h-36 w-36" />
                    <h3 className="text-lg font-semibold">Order Placed!</h3>
                    <div className="mt-2 text-center">
                      <p className="text-xs text-muted-foreground">Order Reference</p>
                      <p className="text font-semibold">{orderId}</p>
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                      Thank you! Your order has been placed successfully. We
                      will contact you at +91 {phone} with delivery updates.
                    </p>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
