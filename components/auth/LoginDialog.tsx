"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { sendLoginOtp, verifyLoginOtp, ApiRequestError } from "@/lib/api/auth";
import { useAuth } from "@/lib/auth-context";

type LoginStep = "phone" | "otp";

export function LoginDialog() {
  const router = useRouter();
  const { login } = useAuth();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<LoginStep>("phone");

  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);

  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const reset = () => {
    setStep("phone");
    setPhone("");
    setPhoneError("");
    setOtp("");
    setOtpError("");
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) reset();
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setPhoneError("Please enter a valid 10-digit phone number");
      return;
    }
    setSendingOtp(true);
    setPhoneError("");
    try {
      await sendLoginOtp(phone);
      setStep("otp");
    } catch (err) {
      if (err instanceof ApiRequestError && err.status === 404) {
        setPhoneError(
          "You don’t have an account yet. Place your first order to create one."
        );
      } else if (err instanceof ApiRequestError && err.status === 400) {
        setPhoneError(err.message);
      } else {
        setPhoneError("Something went wrong. Please try again.");
      }
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
    setOtpError("");
    try {
      const response = await verifyLoginOtp(phone, otp);
      await login(response.data.token);
      setOpen(false);
      reset();
      router.push("/account");
    } catch {
      setOtpError("Invalid OTP. Please try again.");
    } finally {
      setVerifyingOtp(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="gap-2" aria-label="Account">
          <User className="h-5 w-5" />
          <span className="hidden sm:inline text-sm">Login</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {step === "phone" && (
          <>
            <DialogHeader>
              <DialogTitle>Login</DialogTitle>
              <DialogDescription>
                Enter your phone number to continue. We&apos;ll send you an OTP to verify.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSendOtp} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="login-phone">Phone Number</Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                    +91
                  </span>
                  <Input
                    id="login-phone"
                    type="tel"
                    inputMode="numeric"
                    placeholder="Enter 10-digit number"
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
                {phoneError && <p className="text-sm text-destructive">{phoneError}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={sendingOtp}>
                {sendingOtp ? "Sending OTP..." : "Continue"}
              </Button>
            </form>
          </>
        )}

        {step === "otp" && (
          <>
            <DialogHeader>
              <DialogTitle>Verify OTP</DialogTitle>
              <DialogDescription>
                We sent a 6-digit OTP to +91 {phone}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleVerifyOtp} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="login-otp">OTP</Label>
                <Input
                  id="login-otp"
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
                {otpError && <p className="text-sm text-destructive">{otpError}</p>}
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
                className="text-sm text-muted-foreground underline underline-offset-2 w-full text-center"
              >
                Change number
              </button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
