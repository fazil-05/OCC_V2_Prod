"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import Link from "next/link";
import { Loader2, Mail } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/app/components/ui/input-otp";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpHint, setOtpHint] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [referralMeta, setReferralMeta] = useState<{ valid: boolean; club?: { name: string }; headerName?: string } | null>(null);

  const sendVerificationCode = async () => {
    setError("");
    setOtpHint(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email before requesting a code.");
      return;
    }
    setSendingOtp(true);
    try {
      const res = await fetch("/api/auth/register/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) {
        setError("Could not send verification email. Check SMTP settings or try again.");
        return;
      }
      setOtpHint("Check your inbox for a 6-digit code (valid ~10 minutes).");
    } catch {
      setError("Could not send verification email. Try again.");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError("Password must include an uppercase letter");
      return;
    }
    if (!/[a-z]/.test(password)) {
      setError("Password must include a lowercase letter");
      return;
    }
    if (!/\d/.test(password)) {
      setError("Password must include a number");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError('Enter the 6-digit code from your email (tap "Send verification code" first).');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          fullName: name.trim(),
          email: email.trim(),
          password,
          confirmPassword,
          otp,
          referralCode: referralCode.trim() || undefined,
        }),
      });

      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) {
        setError(data?.error ?? "Registration failed. Please try again.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const validateReferral = async () => {
    if (!referralCode.trim()) {
      setReferralMeta(null);
      return;
    }
    const res = await fetch("/api/referral/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: referralCode.trim() }),
    });
    const data = await res.json().catch(() => null);
    setReferralMeta(data);
  };

  const handleGoogleSignup = () => {
    alert("Google OAuth would be integrated here");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Register Form */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 bg-white"
      >
        {/* Logo */}
        <div className="mb-12">
          <h1 className="text-3xl font-black tracking-tight text-gray-900">OCC.</h1>
          <p className="text-sm text-gray-500 mt-1">Off Campus Clubs</p>
        </div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-2">
            Welcome!
          </h2>
          <p className="text-gray-600">Create your OCC account to get started</p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Google Signup Button */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign up with Google
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Name Input */}
          <div>
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            />
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            />
            <button
              type="button"
              onClick={() => void sendVerificationCode()}
              disabled={sendingOtp}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-gray-50 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-100 disabled:opacity-50"
            >
              {sendingOtp ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Mail className="h-4 w-4" />
              )}
              Send verification code
            </button>
            {otpHint ? <p className="text-xs text-green-700">{otpHint}</p> : null}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-600">Email verification code</label>
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(v) => setOtp(v.replace(/\D/g, ""))}
              containerClassName="justify-center gap-2"
            >
              <InputOTPGroup>
                {Array.from({ length: 6 }, (_, i) => (
                  <InputOTPSlot key={i} index={i} className="h-11 w-10 rounded-lg border border-gray-300 text-gray-900" />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div>
            <input
              type="text"
              placeholder="CLUB REFERRAL CODE"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
              onBlur={validateReferral}
              className={`w-full px-4 py-3.5 bg-white border rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                referralMeta?.valid ? "border-green-500 focus:ring-green-500" : "border-gray-300 focus:ring-gray-900"
              }`}
            />
            <p className="mt-1 text-xs text-gray-500">Ask your Club Leader for their code</p>
            {referralMeta?.valid ? (
              <div className="mt-2 rounded-lg border border-green-200 bg-green-50 p-2 text-sm text-green-700">
                ✓ {referralMeta.club?.name} Club — Led by {referralMeta.headerName}
              </div>
            ) : referralCode && referralMeta && !referralMeta.valid ? (
              <p className="mt-1 text-xs text-red-500">Invalid referral code</p>
            ) : null}
          </div>

          {/* Password Input */}
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            />
          </div>

          {/* Confirm Password Input */}
          <div>
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            />
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gray-900 text-white font-medium rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating account...
              </>
            ) : (
              "Sign up"
            )}
          </button>

          {/* Login Link */}
          <p className="text-center text-gray-600 text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              Log in
            </Link>
          </p>
        </motion.form>
      </motion.div>

      {/* Right Side - Illustration */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#090908] via-[#C9A96E]/15 to-[#090908] relative overflow-hidden"
      >
        {/* Particle Background */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Main Illustration */}
        <div className="relative w-full h-full flex items-center justify-center p-12">
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0, -5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1655543274920-06de452d0d02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwYWVyaWFsJTIwdmlld3xlbnwxfHx8fDE3NzUxMTMwNDh8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Campus"
              className="w-full h-auto max-w-lg rounded-3xl shadow-2xl"
            />
          </motion.div>
        </div>

        {/* Bottom Text */}
        <div className="absolute bottom-12 left-12 right-12 z-10">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-4xl font-bold text-white leading-tight"
          >
            Join thousands of students
            <br />
            in campus communities!
          </motion.h3>
        </div>
      </motion.div>
    </div>
  );
}
