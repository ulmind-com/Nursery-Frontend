/* Lets any screen open Help & Support with the right thing already in context —
   an order from the order detail page, a plant from a product page — so the
   customer never has to explain which one they mean. */
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export interface SupportContextValue {
  orderId?: string | undefined;
  productId?: string | undefined;
}

interface SupportChatState {
  isOpen: boolean;
  context: SupportContextValue;
  open: (ctx?: SupportContextValue) => void;
  close: () => void;
}

const SupportChatCtx = createContext<SupportChatState | null>(null);

export function SupportChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [context, setContext] = useState<SupportContextValue>({});

  const open = useCallback((ctx: SupportContextValue = {}) => {
    setContext(ctx);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({ isOpen, context, open, close }), [isOpen, context, open, close]);
  return <SupportChatCtx.Provider value={value}>{children}</SupportChatCtx.Provider>;
}

export function useSupportChat(): SupportChatState {
  const ctx = useContext(SupportChatCtx);
  if (!ctx) throw new Error("useSupportChat must be used inside <SupportChatProvider>");
  return ctx;
}
