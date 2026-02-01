"use client";

import { Search, Handbag, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoginDialog } from "@/components/auth/LoginDialog";
import { useCart } from "@/lib/cart-context";
import { getVariantDisplayName } from "@/lib/api/products";
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

export function Header() {
  const { items, cartCount, cartTotal, removeFromCart, updateQuantity } =
    useCart();

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

            {/* Login */}
            <LoginDialog />

            {/* Shopping Cart */}
            <Sheet>
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
                  <SheetTitle className="text-base sm:text-lg">
                    Your Bag ({cartCount})
                  </SheetTitle>
                  <SheetDescription className="text-xs sm:text-sm">
                    {cartCount === 0
                      ? "Your bag is empty"
                      : "Review your items before checkout"}
                  </SheetDescription>
                </SheetHeader>

                {/* Cart Items */}
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

                {/* Footer */}
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
                    <Button className="w-full" size="lg">
                      Checkout
                    </Button>
                  </SheetFooter>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
