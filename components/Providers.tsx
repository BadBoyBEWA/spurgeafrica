"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { CartItem } from "@/lib/types";

type CartContextValue = {
  items: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  count: number;
  subtotal: number;
  toast: string;
};

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const value = useContext(CartContext);
  if (!value) {
    throw new Error("useCart must be used inside Providers");
  }
  return value;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const closeCartTimeout = useRef<number | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 2400);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    return () => {
      if (closeCartTimeout.current) {
        window.clearTimeout(closeCartTimeout.current);
      }
    };
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return {
      items,
      isCartOpen,
      openCart: () => setIsCartOpen(true),
      closeCart: () => setIsCartOpen(false),
      addItem: item => {
        setItems(current => {
          const existing = current.find(entry => entry.id === item.id);
          if (existing) {
            return current.map(entry =>
              entry.id === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry
            );
          }
          return [...current, { ...item, quantity: 1 }];
        });
        setToast(`${item.name} added to cart`);
        setIsCartOpen(true);
        if (closeCartTimeout.current) {
          window.clearTimeout(closeCartTimeout.current);
        }
        closeCartTimeout.current = window.setTimeout(() => {
          setIsCartOpen(false);
          closeCartTimeout.current = null;
        }, 4000);
      },
      updateQuantity: (id, quantity) =>
        setItems(current =>
          current.map(item => (item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item))
        ),
      removeItem: id => setItems(current => current.filter(item => item.id !== id)),
      clearCart: () => setItems([]),
      count,
      subtotal,
      toast
    };
  }, [items, isCartOpen, toast]);

  return (
    <CartContext.Provider value={value}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        {children}
      </ThemeContext.Provider>
    </CartContext.Provider>
  );
}

type ThemeContextValue = {
  theme: "dark" | "light";
  setTheme: (theme: "dark" | "light") => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useThemeMode() {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error("useThemeMode must be used inside Providers");
  }
  return value;
}
