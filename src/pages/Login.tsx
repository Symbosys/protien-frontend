import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  ArrowRight,
  X,
  ShieldCheck,
  LockKeyhole,
  Sparkles,
} from "lucide-react";
import { useRequestOtpMutation, useVerifyOtpMutation } from "@/api/hooks/auth.hooks";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const requestOtpMutation = useRequestOtpMutation();
  const verifyOtpMutation = useVerifyOtpMutation();

  // Your existing handlers (handlePhoneChange, handleOtpChange, handleKeyDown)
  // ... keep them exactly as you have

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) setPhoneNumber(value);
  };

  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    if (element.value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Handle Send OTP - async with real API
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 10) return;

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await requestOtpMutation.mutateAsync({
        phoneNumber: `+91${phoneNumber}`,
      });
      setSuccessMessage(response.message || "OTP sent successfully");
      setIsOtpOpen(true);
    } catch (err: any) {
      console.error("OTP send error:", err);
      setError(err.response?.data?.message || err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Handle Verify OTP - async
  const handleVerifyOtp = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 4) return;

    setLoading(true);
    setError("");

    try {
      const data = await verifyOtpMutation.mutateAsync({
        phoneNumber: `+91${phoneNumber}`,
        otp: otpString,
      });

      console.log("Login success:", data);
      
      // Save token and user details to localStorage
      if (data.token) {
        localStorage.setItem("user_token", data.token);
        localStorage.setItem("token", data.token);
      }
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // Redirect to account dashboard
      navigate("/account");
    } catch (err: any) {
      console.error("OTP verification error:", err);
      setError(err.response?.data?.message || err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-background selection:bg-primary/20">
      {/* Background Decor */}
      <div className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background -z-10" />
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 -z-10 brightness-100 contrast-150"></div>

      {/* Main Container */}
      <div className="container-luxe px-4 w-full flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Brand/Logo Area */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4 ring-1 ring-primary/20 shadow-lg shadow-primary/5"
            >
              <Sparkles size={32} />
            </motion.div>
            <h1 className="text-4xl font-display font-semibold mb-2 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-muted-foreground">
              Sign in to access your premium account
            </p>
          </div>

          {/* Login Card */}
          <div className="glass rounded-2xl p-8 shadow-2xl shadow-black/5 ring-1 ring-white/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <form onSubmit={handleSendOtp} className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80 ml-1">
                  Phone Number
                </label>
                <div className="relative group/input">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/input:text-primary transition-colors duration-300">
                    <Phone size={20} />
                  </div>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder="Enter your mobile number"
                    className="w-full bg-secondary/50 border border-input rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 focus:bg-background transition-all duration-300 placeholder:text-muted-foreground/50 font-medium text-lg"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={phoneNumber.length < 10 || loading}
                className="btn-premium w-full bg-primary text-primary-foreground py-4 rounded-xl font-medium text-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 focus:ring-4 focus:ring-primary/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group/btn"
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Sparkles size={20} />
                    </motion.div>
                    Sending OTP...
                  </>
                ) : (
                  <>
                    Continue Securely
                    <ArrowRight
                      size={20}
                      className="group-hover/btn:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Error Message */}
          {error && !isOtpOpen && (
            <p className="text-red-500 text-center mt-4">{error}</p>
          )}

          <p className="text-center mt-8 text-sm text-muted-foreground">
            By continuing, you agree to our{" "}
            <a
              href="#"
              className="underline hover:text-primary transition-colors"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="underline hover:text-primary transition-colors"
            >
              Privacy Policy
            </a>
          </p>
        </motion.div>
      </div>

      {/* OTP Modal */}
      <AnimatePresence>
        {isOtpOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOtpOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[50]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: "-50%", y: "-50%" }}
              animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
              exit={{ opacity: 0, scale: 0.9, x: "-50%", y: "-50%" }}
              transition={{ type: "spring", duration: 0.5 }}
              className="fixed z-[51] left-1/2 top-1/2 w-full max-w-sm"
            >
              <div className="glass rounded-3xl p-8 shadow-strong ring-1 ring-white/30 relative">
                <button
                  onClick={() => setIsOtpOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                >
                  <X size={20} />
                </button>
                <div className="text-center mb-8">
                  <div className="w-14 h-14 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-4 ring-1 ring-success/20">
                    <ShieldCheck size={28} />
                  </div>
                  <h2 className="text-2xl font-display font-semibold">
                    Verification Code
                  </h2>
                  <p className="text-muted-foreground mt-2 text-sm">
                    We've sent a 4-digit code to <br />
                    <span className="font-semibold text-foreground">
                      +91 {phoneNumber}
                    </span>
                  </p>
                  {successMessage && (
                    <div className="mt-3 text-sm text-green-600 dark:text-green-400 bg-green-500/10 py-2 px-3 rounded-xl border border-green-500/20 inline-block font-medium">
                      {successMessage}
                    </div>
                  )}
                </div>

                <div className="flex justify-center gap-3 mb-8">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) =>
                        handleOtpChange(e.target as HTMLInputElement, index)
                      }
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      className="w-14 h-16 rounded-xl border border-input bg-secondary/30 text-center text-2xl font-semibold focus:border-primary focus:ring-4 focus:ring-primary/10 focus:bg-background transition-all outline-none"
                    />
                  ))}
                </div>

                {/* Error in modal */}
                {error && (
                  <p className="text-red-500 text-center mb-4">{error}</p>
                )}

                <button
                  onClick={handleVerifyOtp}
                  disabled={otp.join("").length !== 4 || loading}
                  className="btn-premium w-full bg-foreground text-background py-4 rounded-xl font-medium text-lg shadow-lg hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    "Verifying..."
                  ) : (
                    <>
                      <LockKeyhole size={20} />
                      Verify & Sign In
                    </>
                  )}
                </button>

                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Didn't receive the code?{" "}
                    <button className="text-primary font-medium hover:underline">
                      Resend
                    </button>
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
