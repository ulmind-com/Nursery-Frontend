/* Help & Support — the nursery's live chat.
 *
 * Two rules shape this component:
 *
 * 1. **Buttons are answered by the server's deterministic action endpoint**,
 *    not by the language model. Tracking and cancelling an order are real
 *    operations, so tapping them can never fail into "sorry, I'm having
 *    trouble" the way a model call can.
 * 2. **Nothing is stored server-side.** The transcript lives in this browser
 *    under a per-order key and is thrown away the moment the order reaches a
 *    final state — delivered or cancelled — so a finished order leaves no
 *    conversation behind.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft, CalendarDays, CheckCheck, ChevronRight, Headset, Leaf, Loader2,
  MapPin, MessageCircle, Send, Sparkles, X, XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { chatApi, ordersApi, queryKeys } from "@/api/services";
import { normalizeApiError } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";
import { useSupportChat } from "@/contexts/support-chat-context";
import { cn } from "@/lib/utils";
import type { ChatMessage, SupportAction, SupportConfirm, SupportOrderCard } from "@/types/api";

interface Turn {
  id: string;
  role: "user" | "assistant";
  content: string;
  at: number;
  actions?: SupportAction[] | undefined;
  confirm?: SupportConfirm | undefined;
  order?: SupportOrderCard | null | undefined;
  timeline?: boolean | undefined;
  escalated?: boolean | undefined;
}

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Math.random() + Date.now());

const STORE_PREFIX = "sage.support.v1:";
const storeKey = (orderId?: string | null) => `${STORE_PREFIX}${orderId || "general"}`;

/* Threads only ever belong to a live order, so anything left behind for an
   order that has since finished is cleared on the next visit too. */
function readThread(key: string): Turn[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Turn[]) : [];
  } catch {
    return [];
  }
}
function writeThread(key: string, turns: Turn[]) {
  try {
    localStorage.setItem(key, JSON.stringify(turns.slice(-60)));
  } catch { /* private mode — the chat just won't survive a reload */ }
}
function dropThread(key: string) {
  try { localStorage.removeItem(key); } catch { /* ignore */ }
}

const ICONS: Record<string, typeof MapPin> = {
  pin: MapPin, cancel: XCircle, headset: Headset, leaf: Leaf, calendar: CalendarDays,
};

const clock = (at: number) =>
  new Date(at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }).toLowerCase();

/** Minimal inline markdown — the agent only ever emits **bold** and `code`. */
function Rich({ text }: { text: string }) {
  const nodes = useMemo(() => {
    return text.split("\n").map((line, li) => {
      const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
      return (
        <span key={li} className="block">
          {parts.map((part, pi) => {
            if (part.startsWith("**") && part.endsWith("**"))
              return <strong key={pi} className="font-bold text-forest">{part.slice(2, -2)}</strong>;
            if (part.startsWith("`") && part.endsWith("`"))
              return <code key={pi} className="rounded bg-primary-soft px-1.5 py-0.5 font-mono text-[0.8em] text-forest">{part.slice(1, -1)}</code>;
            return <span key={pi}>{part}</span>;
          })}
        </span>
      );
    });
  }, [text]);
  return <span className="space-y-1">{nodes}</span>;
}

/* ── pieces ─────────────────────────────────────────────────────────────── */

function Timeline({ order }: { order: SupportOrderCard }) {
  if (order.status === "cancelled") return null;
  return (
    <div className="mt-3 rounded-2xl border border-primary/15 bg-primary-tint/70 p-3">
      <ol className="space-y-2.5">
        {order.stages.map((stage, i) => {
          const done = i <= order.stage_index;
          const current = i === order.stage_index;
          return (
            <li key={stage.key} className="flex items-center gap-3">
              <span className="relative flex size-5 shrink-0 items-center justify-center">
                {i < order.stages.length - 1 && (
                  <span className={cn("absolute top-5 h-[14px] w-px", done ? "bg-primary/50" : "bg-primary/15")} />
                )}
                <span className={cn(
                  "size-2.5 rounded-full ring-4 transition-colors",
                  done ? "bg-primary ring-primary/15" : "bg-primary/20 ring-transparent",
                  current && "ring-primary/25",
                )} />
              </span>
              <span className={cn("text-xs", done ? "font-semibold text-forest" : "text-muted-foreground")}>
                {stage.label}
              </span>
              {current && <CheckCheck className="size-3.5 text-primary" />}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function ActionList({ actions, onPick, disabled }: { actions: SupportAction[]; onPick: (a: SupportAction) => void; disabled?: boolean }) {
  if (!actions.length) return null;
  return (
    <div className="mt-3 overflow-hidden rounded-2xl border border-primary/15 bg-card shadow-[0_1px_2px_rgba(16,60,40,0.04)]">
      {actions.map((action, i) => {
        const Icon = ICONS[action.icon || "leaf"] || Leaf;
        return (
          <button
            key={action.id}
            type="button"
            disabled={disabled}
            onClick={() => onPick(action)}
            className={cn(
              "flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors duration-200",
              "hover:bg-primary-tint disabled:opacity-50",
              i > 0 && "border-t border-primary/10",
            )}
          >
            <Icon className={cn("size-[18px] shrink-0", action.tone === "danger" ? "text-destructive" : "text-primary")} />
            <span className="flex-1 text-sm font-semibold text-forest">{action.label}</span>
            <ChevronRight className="size-4 shrink-0 text-muted-foreground/60" />
          </button>
        );
      })}
    </div>
  );
}

function ConfirmBlock({ confirm, onConfirm, onDismiss, disabled }: {
  confirm: SupportConfirm; onConfirm: (reason: string) => void; onDismiss: () => void; disabled?: boolean;
}) {
  const [reason, setReason] = useState("");
  return (
    <div className="mt-3 rounded-2xl border border-primary/15 bg-card p-3.5">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Reason</p>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {confirm.reasons.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setReason(r)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors duration-200",
              reason === r
                ? "border-primary bg-primary text-primary-foreground"
                : "border-primary/20 bg-primary-tint text-forest hover:border-primary/50",
            )}
          >
            {r}
          </button>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          disabled={disabled || !reason}
          onClick={() => onConfirm(reason)}
          className="flex-1 rounded-full bg-destructive px-4 py-2.5 text-xs font-bold text-white transition-opacity duration-200 disabled:opacity-40"
        >
          {confirm.cta}
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={onDismiss}
          className="flex-1 rounded-full border border-primary/25 bg-card px-4 py-2.5 text-xs font-bold text-forest transition-colors duration-200 hover:bg-primary-tint"
        >
          {confirm.dismiss}
        </button>
      </div>
    </div>
  );
}

function Bubble({ turn, children }: { turn: Turn; children?: React.ReactNode }) {
  const mine = turn.role === "user";
  return (
    <div className={cn("flex w-full gap-2.5", mine && "justify-end")}>
      {!mine && (
        <span className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-soft">
          <Sparkles className="size-3.5 text-primary" />
        </span>
      )}
      <div className={cn("min-w-0 max-w-[85%]", mine && "flex flex-col items-end")}>
        <div
          className={cn(
            "w-fit max-w-full rounded-2xl px-4 py-2.5 text-sm leading-6 shadow-[0_1px_2px_rgba(16,60,40,0.05)]",
            mine
              ? "rounded-br-md bg-primary text-primary-foreground"
              : "rounded-tl-md border border-primary/10 bg-card text-foreground",
          )}
        >
          <Rich text={turn.content} />
        </div>
        <p className={cn("mt-1 px-1 text-[11px] text-muted-foreground", mine && "text-right")}>{clock(turn.at)}</p>
        {children}
      </div>
    </div>
  );
}

/* ── panel ──────────────────────────────────────────────────────────────── */

function Panel({ orderId, productId, onClose }: { orderId?: string | undefined; productId?: string | undefined; onClose: () => void }) {
  const key = storeKey(orderId);
  const [turns, setTurns] = useState<Turn[]>(() => (typeof window === "undefined" ? [] : readThread(key)));
  const [order, setOrder] = useState<SupportOrderCard | null>(null);
  const [prompt, setPrompt] = useState("What can I help you with?");
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [booting, setBooting] = useState(true);
  const scroller = useRef<HTMLDivElement>(null);
  const booted = useRef(false);

  const live = turns.length > 0 ? turns[turns.length - 1] : null;
  const actions = live?.actions ?? [];
  const confirm = live?.confirm;

  useEffect(() => { if (turns.length) writeThread(key, turns); }, [turns, key]);

  /* Action cards and the order timeline are laid out after the bubble, so the
     scroll has to wait for the frame that includes them. */
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const toBottom = () => el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    const frame = requestAnimationFrame(toBottom);
    const timer = setTimeout(toBottom, 160);
    return () => { cancelAnimationFrame(frame); clearTimeout(timer); };
  }, [turns, pending]);

  /* First open: ask the server who we're talking about. A finished order has
     no live conversation, so its stored thread is dropped rather than shown. */
  useEffect(() => {
    if (booted.current) return;
    booted.current = true;
    chatApi
      .open({ order_id: orderId, product_id: productId })
      .then((data) => {
        setOrder(data.order);
        setPrompt(data.prompt);
        const stored = readThread(key);
        if (data.order?.final || !stored.length) {
          if (data.order?.final) dropThread(key);
          const at = Date.now();
          setTurns(
            data.greeting.map((line, i) => ({
              id: newId(),
              role: "assistant" as const,
              content: line,
              at: at + i,
              ...(i === data.greeting.length - 1 ? { actions: data.actions, order: data.order } : {}),
            })),
          );
        } else {
          setTurns(stored);
        }
      })
      .catch((error) => toast.error(normalizeApiError(error).message))
      .finally(() => setBooting(false));
  }, [orderId, productId, key]);

  const push = useCallback((turn: Omit<Turn, "id" | "at">) => {
    setTurns((cur) => [...cur, { ...turn, id: newId(), at: Date.now() }]);
  }, []);

  const land = useCallback((reply: Awaited<ReturnType<typeof chatApi.action>>) => {
    if (reply.order) setOrder(reply.order);
    push({
      role: "assistant",
      content: reply.reply,
      actions: reply.confirm ? [] : reply.actions,
      confirm: reply.confirm,
      order: reply.order,
      timeline: reply.timeline,
      escalated: reply.escalated,
    });
    /* A cancelled order is a closed conversation — clear the stored thread so
       it doesn't come back on the next visit. */
    if (reply.order?.final) dropThread(key);
  }, [push, key]);

  const history = useCallback(
    (): ChatMessage[] => turns.slice(-10).map(({ role, content }) => ({ role, content })),
    [turns],
  );

  const runAction = async (action: string, label?: string, reason?: string) => {
    if (pending) return;
    if (label) push({ role: "user", content: label });
    setPending(true);
    try {
      land(await chatApi.action({ action, order_id: order?.id || orderId, product_id: productId, reason, messages: history() }));
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setPending(false);
    }
  };

  const ask = async (text: string) => {
    const clean = text.trim();
    if (!clean || pending) return;
    setDraft("");
    const next: ChatMessage[] = [...history(), { role: "user", content: clean }];
    push({ role: "user", content: clean });
    setPending(true);
    try {
      land(await chatApi.send(next, order?.id || orderId));
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-primary-tint">
      {/* Header */}
      <header className="relative z-10 flex items-center gap-3 border-b border-primary/10 bg-card px-4 py-3 shadow-[0_2px_12px_rgba(16,60,40,0.05)]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close support chat"
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-tint text-forest transition-colors duration-200 hover:bg-primary-soft lg:hidden"
        >
          <ArrowLeft className="size-[18px]" />
        </button>
        <span className="hidden size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-forest text-primary-foreground shadow-md lg:flex">
          <Leaf className="size-5" />
        </span>
        <div className="min-w-0 flex-1 text-center lg:text-left">
          <h2 className="truncate text-[15px] font-bold tracking-tight text-forest">Help &amp; Support</h2>
          <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground lg:justify-start">
            <span className="size-1.5 rounded-full bg-primary" />
            {order ? `Order #${order.short} · ${order.status_label}` : "Sage · usually replies instantly"}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close support chat"
          className="hidden size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors duration-200 hover:bg-primary-tint hover:text-forest lg:flex"
        >
          <X className="size-[18px]" />
        </button>
      </header>

      {/* Transcript */}
      <div ref={scroller} className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-5">
        {booting && (
          <div className="flex justify-center py-10">
            <Loader2 className="size-5 animate-spin text-primary" />
          </div>
        )}

        {turns.map((turn, i) => {
          const last = i === turns.length - 1;
          return (
            <div key={turn.id} className="space-y-0">
              <Bubble turn={turn}>
                {turn.timeline && turn.order && <Timeline order={turn.order} />}
              </Bubble>
              {last && !pending && (actions.length > 0 || confirm) && (
                <div className="ml-[38px] mt-3">
                  {actions.length > 0 && (
                    <>
                      <p className="mb-2 text-[13px] font-bold text-forest">{prompt}</p>
                      <ActionList actions={actions} onPick={(a) => void runAction(a.id, a.label)} disabled={pending} />
                    </>
                  )}
                  {confirm && (
                    <ConfirmBlock
                      confirm={confirm}
                      disabled={pending}
                      onConfirm={(reason) => void runAction(confirm.action, `Yes — ${reason.toLowerCase()}`, reason)}
                      onDismiss={() => void runAction("track", "Keep my order")}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}

        {pending && (
          <div className="flex gap-2.5">
            <span className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-soft">
              <Sparkles className="size-3.5 text-primary" />
            </span>
            <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-md border border-primary/10 bg-card px-4 py-3.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="size-1.5 animate-bounce rounded-full bg-primary/60"
                  style={{ animationDelay: `${i * 120}ms` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="border-t border-primary/10 bg-card px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
        <form
          onSubmit={(e) => { e.preventDefault(); void ask(draft); }}
          className="flex items-end gap-2 rounded-full border border-primary/20 bg-primary-tint/60 py-1 pl-4 pr-1 focus-within:border-primary/50"
        >
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void ask(draft); }
            }}
            rows={1}
            placeholder="Type your message..."
            aria-label="Message"
            className="max-h-24 flex-1 resize-none bg-transparent py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            disabled={pending || !draft.trim()}
            aria-label="Send message"
            className="mb-1 flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity duration-200 disabled:opacity-40"
          >
            {pending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ── shell ──────────────────────────────────────────────────────────────── */

export function SupportChat() {
  const { isAuthenticated } = useAuth();
  const { isOpen, context, open, close } = useSupportChat();

  /* The launcher is for people with something to talk about — the account
     screens already hold this list, so it costs no extra request. */
  const orders = useQuery({ queryKey: queryKeys.orders, queryFn: ordersApi.list, enabled: isAuthenticated });
  const hasOrdered = (orders.data?.length ?? 0) > 0;

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = window.innerWidth < 1024 ? "hidden" : "";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  if (!isAuthenticated) return null;

  return (
    <>
      {!isOpen && hasOrdered && (
        <button
          type="button"
          onClick={() => open()}
          aria-label="Open help and support"
          className="group fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] right-4 z-40 flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-forest text-primary-foreground shadow-[0_10px_30px_-8px_rgba(16,100,60,0.55)] transition-transform duration-200 hover:scale-105 active:scale-95 sm:right-5 lg:bottom-6"
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-primary/25 [animation-duration:3s]" />
          <MessageCircle className="relative size-6" />
        </button>
      )}

      {isOpen && (
        <>
          {/* Mobile: full screen. Desktop: docked panel. */}
          <div
            className="fixed inset-0 z-50 hidden bg-forest/25 backdrop-blur-[2px] lg:block"
            onClick={close}
            aria-hidden
          />
          <section
            aria-label="Help and support"
            className={cn(
              "fixed z-50 flex flex-col overflow-hidden bg-primary-tint",
              "inset-0",
              "lg:inset-auto lg:bottom-6 lg:right-6 lg:h-[min(660px,82vh)] lg:w-[400px] lg:rounded-3xl lg:border lg:border-primary/15 lg:shadow-[0_24px_60px_-20px_rgba(16,60,40,0.45)]",
            )}
          >
            <Panel orderId={context.orderId} productId={context.productId} onClose={close} />
          </section>
        </>
      )}
    </>
  );
}
