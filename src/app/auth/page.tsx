"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";

export default function UnifiedAuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});
  const [message, setMessage] = useState<string | null>(null);

  const { login, register, loading, error, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/"); // Redirect to dashboard after login/registration
    }
  }, [user, router]);

  function validateFields(email: string, password: string) {
    const errs: { email?: string; password?: string } = {};
    if (!email?.trim()) errs.email = "Email is required.";
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) errs.email = "Must be a valid email address.";
    if (!password) errs.password = "Password is required.";
    else if (password.length < 6) errs.password = "Must be at least 6 characters.";
    return errs;
  }

  function handleBlur(field: "email" | "password") {
    setTouched(v => ({ ...v, [field]: true }));
    setErrors(validateFields(email, password));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateFields(email, password);
    setErrors(errs);
    setTouched({ email: true, password: true });
    setMessage(null);
    if (Object.keys(errs).length) return;
    if (mode === "login") {
      await login(email, password);
    } else {
      await register(email, password);
      if (!error) setMessage("Registration successful. You are now logged in.");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-br from-slate-100 to-slate-200 animate-fadein">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-white/90 backdrop-blur space-y-6 border border-gray-200">
        <div className="flex justify-center mb-2 transition-transform duration-300">
          <span className="font-bold text-3xl tracking-tight text-primary">StockPilot</span>
        </div>
        <div className="flex justify-center gap-4 mb-4" role="tablist" aria-label="Choose authentication mode">
          <button
            onClick={() => setMode("login")}
            className={
              `px-6 py-2 font-medium rounded-l-lg transition-all duration-150 ` +
              (mode === "login"
                ? "bg-primary text-white shadow text-lg scale-105"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200")
            }
            aria-selected={mode === "login"}
            aria-controls="login-form"
            tabIndex={0}
          >
            Login
          </button>
          <button
            onClick={() => setMode("register")}
            className={
              `px-6 py-2 font-medium rounded-r-lg transition-all duration-150 ` +
              (mode === "register"
                ? "bg-primary text-white shadow text-lg scale-105"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200")
            }
            aria-selected={mode === "register"}
            aria-controls="register-form"
            tabIndex={0}
          >
            Register
          </button>
        </div>
        <form
          className="space-y-5 animate-authform"
          onSubmit={handleSubmit}
          autoComplete="off"
          aria-labelledby={mode === "login" ? "Login" : "Register"}
        >
          <div>
            <label className="block mb-1 font-semibold text-gray-800" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              className={`w-full border rounded px-3 py-2 focus:outline focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow ${errors.email && touched.email ? 'border-red-500' : ''}`}
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                if (touched.email) setErrors(validateFields(e.target.value, password));
              }}
              onBlur={() => handleBlur("email")}
              aria-label="Email"
              aria-invalid={!!errors.email}
              aria-describedby="email-error"
            />
            {errors.email && touched.email && (
              <span className="text-xs text-red-600 animate-fadein-fast" id="email-error">{errors.email}</span>
            )}
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-800" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              className={`w-full border rounded px-3 py-2 focus:outline focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow ${errors.password && touched.password ? 'border-red-500' : ''}`}
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                if (touched.password) setErrors(validateFields(email, e.target.value));
              }}
              onBlur={() => handleBlur("password")}
              aria-label="Password"
              aria-invalid={!!errors.password}
              aria-describedby="password-error"
              minLength={6}
            />
            {errors.password && touched.password && (
              <span className="text-xs text-red-600 animate-fadein-fast" id="password-error">{errors.password}</span>
            )}
          </div>
          {(error || message) && (
            <div className={`text-sm ${error ? 'text-red-700' : 'text-green-700'} transition-all animate-fadein-fast`} role={error ? "alert" : "status"}>
              {error || message}
            </div>
          )}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-primary text-white font-semibold rounded shadow transition-all hover:bg-primary/90 focus:outline focus:ring-2 focus:ring-primary/50 disabled:opacity-60 flex justify-center items-center gap-2"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? (mode === "login" ? "Logging in..." : "Registering...") : (mode === "login" ? "Login" : "Register")}
          </button>
          <div className="flex items-center my-2">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="px-2 text-gray-400 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>
          <button
            type="button"
            className="w-full border border-gray-300 bg-white py-2 px-4 rounded font-medium flex items-center justify-center gap-2 hover:bg-gray-50 focus:outline focus:ring-2 focus:ring-primary/50 transition-all"
            tabIndex={0}
            aria-label={mode === "login" ? "Sign in with Google" : "Register with Google"}
            disabled
          >
            <FcGoogle className="text-xl" />
            <span>{mode === "login" ? "Sign in with Google" : "Register with Google"}</span>
          </button>
        </form>
        <div className="text-center text-sm text-gray-600 mt-2">
          {mode === "login" ? (
            <>Don&apos;t have an account? <button type="button" className="text-primary underline" onClick={() => setMode("register")}>Register</button></>
          ) : (
            <>Already have an account? <button type="button" className="text-primary underline" onClick={() => setMode("login")}>Login</button></>
          )}
        </div>
      </div>
      <style>{`
        .animate-fadein {animation: fadeIn .8s cubic-bezier(.5,0,.1,1) both;}
        .animate-fadein-fast {animation: fadeIn .4s cubic-bezier(.5,0,.1,1) both;}
        .animate-authform {animation: scaleIn .5s cubic-bezier(.5,0,.1,1) both;}
        @keyframes fadeIn {from {opacity: 0;transform: translateY(30px);}to {opacity: 1;transform: translateY(0);}}
        @keyframes scaleIn {from {opacity: 0; transform: scale(.97);} to {opacity: 1; transform: scale(1);} }
      `}</style>
    </div>
  );
}