"use client";
import { AnimatedThemeToggler } from "@/components/providers/theme.provider"
import PublicRoute from "@/components/routes/PublicRoute";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useMounted } from "@/hooks/useMounted";
import { useAppDispatch } from "@/store/hooks";
import { loginUser, registerUser } from "@/store/slices/auth.slice";
import { Eye, EyeOff } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

type View = "login" | "signup";

interface ValidationErrors {
  email?: string;
  name?: string;
  password?: string;
  confirmPassword?: string;
}

function AuthPage() {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const query = searchParams.get("view");

  const [view, toggleView] = useState<View>((query as View) || "login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, toggleShowPass] = useState(false);
  const [showConfirmPass, toggleShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  // Validation functions
  const validateEmail = (email: string): string | undefined => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return undefined;
  };

  const validateName = (name: string): string | undefined => {
    if (!name) return "Name is required";
    if (name.length < 2) return "Name must be at least 2 characters";
    if (name.length > 50) return "Name cannot exceed 50 characters";
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(password))
      return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(password))
      return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(password))
      return "Password must contain at least one number";
    return undefined;
  };

  const validateConfirmPassword = (
    confirmPassword: string,
    password: string
  ): string | undefined => {
    if (!confirmPassword) return "Please confirm your password";
    if (confirmPassword !== password) return "Passwords do not match";
    return undefined;
  };

  // Handle field blur to show validation
  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    validateField(field);
  };

  // Validate individual field
  const validateField = (field: string) => {
    let error: string | undefined;

    switch (field) {
      case "email":
        error = validateEmail(email);
        break;
      case "name":
        error = validateName(name);
        break;
      case "password":
        error = validatePassword(password);
        break;
      case "confirmPassword":
        error = validateConfirmPassword(confirmPassword, password);
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
    return !error;
  };

  // Validate all fields
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    newErrors.email = validateEmail(email);
    if (view === "signup") {
      newErrors.name = validateName(name);
      newErrors.confirmPassword = validateConfirmPassword(
        confirmPassword,
        password
      );
    }
    newErrors.password = validatePassword(password);

    setErrors(newErrors);
    setTouched({
      email: true,
      name: true,
      password: true,
      confirmPassword: true,
    });

    return !Object.values(newErrors).some((error) => error !== undefined);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const result = await dispatch(
        view === "signup"
          ? registerUser({ email, password, name })
          : loginUser({ email, password })
      )
      
      router.push("/dashboard");
    } catch (error) {
      console.log("The error is ", error);
    } finally {
      setLoading(false);
    }
  };

  const { resolvedTheme } = useTheme();
  const mounted = useMounted();

  const logoSrc = mounted 
    ? (resolvedTheme === "dark" ? "/favicon-dark.svg" : "/favicon-light.svg")
    : "/favicon-light.svg";

  // Reset form when switching views
  const handleToggleView = () => {
    const newView = view === "login" ? "signup" : "login";
    toggleView(newView);
    setErrors({});
    setTouched({});
    setConfirmPassword("");
  };

  return (
    <div className="flex flex-col w-full gap-6">
      <form onSubmit={handleSubmit} noValidate>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <Link
              href="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <Image
                src={logoSrc}
                alt="TradeQuest Logo"
                width={40}
                height={40}
                className="h-10 w-10"
              />
              <span className="sr-only">Trade-Quest</span>
            </Link>
            <h1 className="text-xl font-bold">Welcome to Trade-Quest</h1>
            <FieldDescription>
              {view === "login"
                ? "Log in to start your Trading Journey"
                : "Create your free account to get started"}
            </FieldDescription>
          </div>

          {/* Email Field */}
          <Field>
            <FieldLabel htmlFor="email">
              Email <span className="text-red-500">*</span>
            </FieldLabel>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (touched.email) validateField("email");
              }}
              onBlur={() => handleBlur("email")}
              placeholder="you@example.com"
              className={
                touched.email && errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : ""
              }
            />
            {touched.email && errors.email && (
              <FieldDescription className="text-red-500 text-xs mt-1">
                {errors.email}
              </FieldDescription>
            )}
          </Field>

          {/* Name Field (Signup only) */}
          {view === "signup" && (
            <Field>
              <FieldLabel htmlFor="name">
                Full Name <span className="text-red-500">*</span>
              </FieldLabel>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (touched.name) validateField("name");
                }}
                onBlur={() => handleBlur("name")}
                placeholder="John Doe"
                className={
                  touched.name && errors.name
                    ? "border-red-500 focus:ring-red-500"
                    : ""
                }
              />
              {touched.name && errors.name && (
                <FieldDescription className="text-red-500 text-xs mt-1">
                  {errors.name}
                </FieldDescription>
              )}
            </Field>
          )}

          {/* Password Field */}
          <Field>
            <FieldLabel htmlFor="password">
              Password <span className="text-red-500">*</span>
            </FieldLabel>
            <div className="relative">
              <Input
                id="password"
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (touched.password) validateField("password");
                  if (touched.confirmPassword && view === "signup")
                    validateField("confirmPassword");
                }}
                onBlur={() => handleBlur("password")}
                placeholder="••••••••"
                className={
                  touched.password && errors.password
                    ? "border-red-500 focus:ring-red-500 pr-10"
                    : "pr-10"
                }
              />
              {showPass ? (
                <Eye
                  size={20}
                  onClick={() => toggleShowPass(false)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                />
              ) : (
                <EyeOff
                  size={20}
                  onClick={() => toggleShowPass(true)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                />
              )}
            </div>
            {touched.password && errors.password && (
              <FieldDescription className="text-red-500 text-xs mt-1">
                {errors.password}
              </FieldDescription>
            )}
            {view === "signup" && !errors.password && (
              <FieldDescription className="text-xs mt-1">
                Must be at least 8 characters with uppercase, lowercase, and
                number
              </FieldDescription>
            )}
          </Field>

          {/* Confirm Password Field (Signup only) */}
          {view === "signup" && (
            <Field>
              <FieldLabel htmlFor="confirmPassword">
                Confirm Password <span className="text-red-500">*</span>
              </FieldLabel>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPass ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (touched.confirmPassword)
                      validateField("confirmPassword");
                  }}
                  onBlur={() => handleBlur("confirmPassword")}
                  placeholder="••••••••"
                  className={
                    touched.confirmPassword && errors.confirmPassword
                      ? "border-red-500 focus:ring-red-500 pr-10"
                      : "pr-10"
                  }
                />
                {showConfirmPass ? (
                  <Eye
                    size={20}
                    onClick={() => toggleShowConfirmPass(false)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                  />
                ) : (
                  <EyeOff
                    size={20}
                    onClick={() => toggleShowConfirmPass(true)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                  />
                )}
              </div>
              {touched.confirmPassword && errors.confirmPassword && (
                <FieldDescription className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword}
                </FieldDescription>
              )}
            </Field>
          )}

          {/* Submit Button */}
          <Field>
            <Button
              className="cursor-pointer w-full"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner />
                  Processing...
                </>
              ) : view === "login" ? (
                "Log In"
              ) : (
                "Create Account"
              )}
            </Button>
          </Field>

          <FieldSeparator />

          {/* Toggle View */}
          <div className="text-center text-sm">
            {view === "login" ? "Don't" : "Already"} have an account?{" "}
            <span
              className="underline cursor-pointer font-medium hover:text-primary"
              onClick={handleToggleView}
            >
              {view === "signup" ? "Log In" : "Sign Up"}
            </span>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}

export default function Page() {
  return (
    <PublicRoute>
      <div className="bg-background flex min-h-svh flex-col w-screen items-center justify-center gap-6 p-6 md:p-10">
        <div className="w-full max-w-sm">
          <AuthPage />
        </div>
      </div>
    </PublicRoute>
  );
}