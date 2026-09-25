import { Leaf, LogIn, MessageCircle, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { chatApi } from "@/api/services";
import { normalizeApiError } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { PromptInput, PromptInputFooter, PromptInputSubmit, PromptInputTextarea } from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import type { ChatMessage } from "@/types/api";

/* The agent answers from the whole conversation, not the last line, so the
   transcript is what gets posted. Each turn also carries a local id purely so
   React has a stable key — the API never sees it. */
interface Turn extends ChatMessage {
  id: string;
}

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Math.random());

export function PlantAssistant() {
  const { isAuthenticated, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const asked = useRef(false);

  /* Quick questions are fetched once, the first time the panel is opened by a
     signed-in customer — they're order-aware, so they need the session. */
  useEffect(() => {
    if (!open || asked.current || !isAuthenticated) return;
    asked.current = true;
    chatApi
      .suggestions()
      .then((data) => setSuggestions(data.questions ?? []))
      .catch(() => setSuggestions([]));
  }, [open, isAuthenticated]);

  const ask = async (text: string) => {
    const clean = text.trim();
    if (!clean || pending) return;

    const history: Turn[] = [...turns, { id: newId(), role: "user", content: clean }];
    setTurns(history);
    setPending(true);
    try {
      const { reply } = await chatApi.send(history.map(({ role, content }) => ({ role, content })));
      if (!reply) throw new Error("The assistant didn't have an answer for that.");
      setTurns((current) => [...current, { id: newId(), role: "assistant", content: reply }]);
    } catch (error) {
      // Drop the unanswered question so a retry doesn't double it up.
      setTurns((current) => current.filter((turn) => turn.id !== history[history.length - 1]?.id));
      toast.error(normalizeApiError(error).message);
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] right-4 z-40 size-12 rounded-full shadow-xl sm:right-5 lg:bottom-6"
        size="icon"
        aria-label={open ? "Close plant assistant" : "Open plant assistant"}
      >
        {open ? <X /> : <MessageCircle />}
      </Button>

      {open && (
        <section
          className="fixed bottom-[calc(8rem+env(safe-area-inset-bottom,0px))] right-4 z-40 flex h-[min(620px,64vh)] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl lg:bottom-24 lg:h-[min(620px,72vh)]"
          aria-label="Plant assistant"
        >
          <div className="flex items-center gap-3 border-b bg-secondary px-4 py-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Leaf className="size-5" />
            </span>
            <div>
              <h2 className="text-sm font-bold">Plant care assistant</h2>
              <p className="text-xs text-muted-foreground">Answers from the nursery</p>
            </div>
          </div>

          {!loading && !isAuthenticated ? (
            /* The agent can act on real orders, so it only talks to a signed-in
               customer — say so plainly instead of failing on send. */
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
              <Leaf className="size-8 text-primary" aria-hidden="true" />
              <div>
                <h3 className="font-display text-xl">Sign in to chat</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  The assistant can look up your orders and arrange a return, so it needs to know who you are.
                </p>
              </div>
              <Button asChild className="h-11 rounded-full px-7">
                <Link to="/login" onClick={() => setOpen(false)}>
                  <LogIn className="size-4" aria-hidden="true" /> Sign in
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <Conversation>
                <ConversationContent className="gap-5">
                  {turns.length === 0 && (
                    <div className="mx-auto max-w-xs py-8 text-center">
                      <Leaf className="mx-auto mb-4 size-8 text-primary" />
                      <h3 className="font-display text-xl">How can we help your plants thrive?</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Ask about light, watering, care, or an order.
                      </p>
                      {suggestions.length > 0 && (
                        <div className="mt-5 flex flex-wrap justify-center gap-2">
                          {suggestions.slice(0, 6).map((question) => (
                            <button
                              key={question}
                              type="button"
                              onClick={() => void ask(question)}
                              className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-forest transition hover:border-primary hover:bg-primary-tint"
                            >
                              {question}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {turns.map((turn) => (
                    <Message key={turn.id} from={turn.role}>
                      <MessageContent className={turn.role === "user" ? "bg-primary text-primary-foreground" : undefined}>
                        <MessageResponse>{turn.content}</MessageResponse>
                      </MessageContent>
                    </Message>
                  ))}

                  {pending && (
                    <Message from="assistant">
                      <MessageContent>
                        <Shimmer>Thinking...</Shimmer>
                      </MessageContent>
                    </Message>
                  )}
                  <ConversationScrollButton />
                </ConversationContent>
              </Conversation>

              <div className="border-t p-3">
                <PromptInput onSubmit={({ text }: { text: string }) => void ask(text)}>
                  <PromptInputTextarea placeholder="Ask about your plants..." />
                  <PromptInputFooter className="justify-end">
                    <PromptInputSubmit status={pending ? "submitted" : "ready"} disabled={pending} />
                  </PromptInputFooter>
                </PromptInput>
              </div>
            </>
          )}
        </section>
      )}
    </>
  );
}
