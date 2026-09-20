import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CartItem } from "@/types/api";
const CART_KEY = "plant-nursery-cart";
interface CartContextValue { items: CartItem[]; count: number; subtotal: number; addItem: (item: CartItem) => void; updateQty: (productId: string, qty: number, size?: string) => void; removeItem: (productId: string, size?: string) => void; clear: () => void }
const CartContext = createContext<CartContextValue | null>(null);
export function CartProvider({ children }: { children: ReactNode }) {
 const [items, setItems] = useState<CartItem[]>([]); const [hydrated, setHydrated] = useState(false);
 useEffect(() => { try { const value = window.localStorage.getItem(CART_KEY); if (value) setItems(JSON.parse(value) as CartItem[]); } catch { window.localStorage.removeItem(CART_KEY); } setHydrated(true); }, []);
 useEffect(() => { if (hydrated) window.localStorage.setItem(CART_KEY, JSON.stringify(items)); }, [items, hydrated]);
 const addItem = useCallback((next: CartItem) => setItems((current) => { const index = current.findIndex((item) => item.product_id === next.product_id && item.size_variant === next.size_variant && item.pot_type === next.pot_type); if (index < 0) return [...current, next]; return current.map((item, i) => i === index ? { ...item, qty: Math.min(item.qty + next.qty, item.stock ?? 99) } : item); }), []);
 const updateQty = useCallback((id: string, qty: number, size?: string) => setItems((current) => current.map((item) => item.product_id === id && item.size_variant === size ? { ...item, qty: Math.max(1, Math.min(qty, item.stock ?? 99)) } : item)), []);
 const removeItem = useCallback((id: string, size?: string) => setItems((current) => current.filter((item) => !(item.product_id === id && item.size_variant === size))), []);
 const clear = useCallback(() => setItems([]), []);
 const value = useMemo(() => ({ items, count: items.reduce((sum, item) => sum + item.qty, 0), subtotal: items.reduce((sum, item) => sum + item.qty * item.unit_price, 0), addItem, updateQty, removeItem, clear }), [items, addItem, updateQty, removeItem, clear]);
 return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart() { const context = useContext(CartContext); if (!context) throw new Error("useCart must be used inside CartProvider"); return context; }
