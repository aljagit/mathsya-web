"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, LogOut, Package, ChevronDown, ChevronUp, ChevronRight } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import {
  getOrders,
  getOrder,
  getDeliveryLocations,
  updateCustomer,
  type Order,
  type OrderDetail,
} from "@/lib/api/order";
import { getVariantDisplayName } from "@/lib/api/products";
import { validateAddress } from "@/lib/validation/address";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

function orderItemImage(image: string | null, productName: string): string {
  if (image) return `${process.env.NEXT_PUBLIC_BASE_URL}${image}`;
  return `https://placehold.co/100x100/d7e5f7/1a699d?text=${encodeURIComponent(productName)}`;
}

const STATUS_STYLES: Record<string, string> = {
  Paid: "bg-green-100 text-green-700",
  Pending: "bg-amber-100 text-amber-700",
  Failed: "bg-red-100 text-red-700",
};

const RECENT_ORDERS_COUNT = 5;

export default function AccountPage() {
  const router = useRouter();
  const { hydrated, isLoggedIn, token, customer, logout, refreshCustomer } = useAuth();

  useEffect(() => {
    if (hydrated && !isLoggedIn) {
      router.push("/");
    }
  }, [hydrated, isLoggedIn, router]);

  // Order history
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [showAllOrders, setShowAllOrders] = useState(false);

  useEffect(() => {
    if (!token) return;
    setLoadingOrders(true);
    getOrders(token)
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoadingOrders(false));
  }, [token]);

  // Order detail dialog
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState("");

  const openOrderDetail = (orderId: string) => {
    setSelectedOrderId(orderId);
    setOrderDetail(null);
    setDetailError("");
    if (!token) return;
    setLoadingDetail(true);
    getOrder(token, orderId)
      .then(setOrderDetail)
      .catch(() => setDetailError("Failed to load order details. Please try again."))
      .finally(() => setLoadingDetail(false));
  };

  // Address view/edit
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [location, setLocation] = useState("");
  const [landmark, setLandmark] = useState("");
  const [locations, setLocations] = useState<string[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [addressError, setAddressError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (pincode.length === 6) {
      setLoadingLocations(true);
      setAddressError("");
      getDeliveryLocations(pincode)
        .then((locs) => {
          setLocations(locs);
          if (locs.length === 0) {
            setAddressError("We don't deliver to that PIN code yet");
            setLocation("");
          } else if (!locs.includes(location)) {
            setLocation("");
          }
        })
        .finally(() => setLoadingLocations(false));
    } else {
      setLocations([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pincode]);

  const startEdit = useCallback(() => {
    if (customer) {
      setName(customer.customer_name);
      setAddress(customer.address);
      setPincode(customer.pin_code);
      setLocation(customer.location);
      setLandmark(customer.landmark || "");
    }
    setAddressError("");
    setIsEditing(true);
  }, [customer]);

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const validationError = validateAddress({ name, address, pincode, location, landmark });
    if (validationError) {
      setAddressError(validationError);
      return;
    }

    setSaving(true);
    setAddressError("");
    try {
      await updateCustomer(token, {
        name: name.trim(),
        address: address.trim(),
        pin_code: pincode,
        location,
        landmark: landmark.trim() || undefined,
      });
      await refreshCustomer();
      setIsEditing(false);
    } catch {
      setAddressError("Failed to save address. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!hydrated || !isLoggedIn) {
    return <div className="min-h-screen" />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl space-y-10">
        <h1 className="text-2xl font-bold">
          Hello, {customer?.customer_name?.split(" ")[0] || "there"}
        </h1>

        {/* Address */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Delivery Address
          </h2>

          {!isEditing ? (
            <div className="space-y-4">
              {customer ? (
                <div className="rounded-xl border border-border p-4 space-y-1.5 bg-muted/30">
                  <p className="font-semibold text-sm">{customer.customer_name}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {customer.address}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {customer.location} · {customer.pin_code}
                  </p>
                  {customer.landmark && (
                    <p className="text-sm text-muted-foreground">Near {customer.landmark}</p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No saved address yet.</p>
              )}
              <Button type="button" variant="outline" onClick={startEdit}>
                {customer ? "Change Address" : "Add Address"}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSaveAddress} className="space-y-4 max-w-sm">
              <div className="space-y-1.5">
                <Label htmlFor="acc-name">Full Name</Label>
                <Input
                  id="acc-name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setAddressError(""); }}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="acc-addr">Delivery Address</Label>
                <Textarea
                  id="acc-addr"
                  placeholder="House no, Street, Area"
                  value={address}
                  onChange={(e) => { setAddress(e.target.value); setAddressError(""); }}
                  className="min-h-20 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="acc-pincode">PIN Code</Label>
                  <Input
                    id="acc-pincode"
                    inputMode="numeric"
                    placeholder="6-digit PIN"
                    value={pincode}
                    onChange={(e) => {
                      setPincode(e.target.value.replace(/\D/g, "").slice(0, 6));
                      setAddressError("");
                    }}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="acc-loc">Location</Label>
                  <select
                    id="acc-loc"
                    value={location}
                    onChange={(e) => { setLocation(e.target.value); setAddressError(""); }}
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
                <Label htmlFor="acc-landmark">
                  Landmark <span className="text-muted-foreground font-normal">(optional)</span>
                </Label>
                <Input
                  id="acc-landmark"
                  placeholder="Nearby landmark"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                />
              </div>
              {addressError && <p className="text-sm text-destructive">{addressError}</p>}
              <div className="flex gap-3">
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Address"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </section>

        {/* Order history */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Order History
          </h2>

          {loadingOrders ? (
            <p className="text-sm text-muted-foreground">Loading orders...</p>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-3 rounded-xl border border-dashed border-border">
              <Package className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No orders yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {(showAllOrders ? orders : orders.slice(0, RECENT_ORDERS_COUNT)).map((order) => (
                <button
                  key={order.name}
                  type="button"
                  onClick={() => openOrderDetail(order.name)}
                  className="w-full text-left rounded-xl border border-border p-4 flex items-center justify-between gap-3 hover:border-foreground/30 hover:bg-muted/30 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium">{order.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.order_date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right space-y-1">
                      <p className="text-sm font-bold text-green-700">
                        ₹{order.total_amount.toFixed(0)}
                      </p>
                      <span
                        className={cn(
                          "inline-block px-2 py-0.5 rounded-full text-xs font-medium",
                          STATUS_STYLES[order.payment_status] || "bg-muted text-muted-foreground"
                        )}
                      >
                        {order.payment_status}
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </div>
                </button>
              ))}

              {orders.length > RECENT_ORDERS_COUNT && (
                <button
                  type="button"
                  onClick={() => setShowAllOrders((v) => !v)}
                  className="flex items-center justify-center gap-1.5 w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showAllOrders ? (
                    <>
                      Show less <ChevronUp className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Show {orders.length - RECENT_ORDERS_COUNT} older orders{" "}
                      <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </section>
      </div>

      <Dialog open={!!selectedOrderId} onOpenChange={(open) => !open && setSelectedOrderId(null)}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedOrderId}</DialogTitle>
          </DialogHeader>

          {loadingDetail ? (
            <p className="text-sm text-muted-foreground">Loading order details...</p>
          ) : detailError ? (
            <p className="text-sm text-destructive">{detailError}</p>
          ) : orderDetail ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {new Date(orderDetail.order_date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <span
                  className={cn(
                    "inline-block px-2 py-0.5 rounded-full text-xs font-medium",
                    STATUS_STYLES[orderDetail.payment_status] || "bg-muted text-muted-foreground"
                  )}
                >
                  {orderDetail.payment_status}
                </span>
              </div>

              <div className="space-y-3">
                {orderDetail.items.map((item, i) => (
                  <div key={`${item.variant}-${i}`} className="flex gap-3 items-center">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={orderItemImage(item.image, item.product_name)}
                        alt={item.product_name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.product_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {getVariantDisplayName(item.variant_name)} · {item.quantity} kg · ₹{item.price}/kg
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-green-700 shrink-0">
                      ₹{item.amount.toFixed(0)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-3 space-y-1.5">
                {orderDetail.discount > 0 && (
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Discount</span>
                    <span>-₹{orderDetail.discount.toFixed(0)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold">
                  <span>Total</span>
                  <span className="text-green-700">₹{orderDetail.total_amount.toFixed(0)}</span>
                </div>
              </div>

              <div className="border-t border-border pt-3 space-y-1 text-sm text-muted-foreground">
                <p>Delivered to {orderDetail.location}</p>
                {orderDetail.payment_mode && <p>Paid via {orderDetail.payment_mode}</p>}
                {orderDetail.payment_reference && (
                  <p className="text-xs">Ref: {orderDetail.payment_reference}</p>
                )}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
