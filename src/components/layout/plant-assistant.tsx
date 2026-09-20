import { Botanic, MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { miscApi } from "@/api/services";
import { normalizeApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { PromptInput, PromptInputFooter, PromptInputSubmit, PromptInputTextarea } from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import type { ChatMessage } from "@/types/api";

export function PlantAssistant() {
  const [open, setOpen] = useState(false); const [pending, setPending] = useState(false); const [messages, setMessages] = useState<ChatMessage[]>([]);
  const submit = async ({ text }: { text: string }) => { const clean = text.trim(); if (!clean || pending) return; setMessages((m) => [...m, { id: crypto.randomUUID(), role: "user", content: clean }]); setPending(true); try { const result = await miscApi.chat(clean); const reply = result.response || result.reply || result.message; if (!reply) throw new Error("No response"); setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", content: reply }]); } catch (error) { toast.error(normalizeApiError(error).message); } finally { setPending(false); } };
  return <><Button onClick={() => setOpen((v) => !v)} className="fixed bottom-5 right-5 z-40 size-12 rounded-full shadow-xl" size="icon" aria-label={open ? "Close plant assistant" : "Open plant assistant"}>{open ? <X /> : <MessageCircle />}</Button>
    {open && <section className="fixed bottom-20 right-4 z-40 flex h-[min(620px,72vh)] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-lg border bg-background shadow-2xl" aria-label="Plant assistant">
      <div className="flex items-center gap-3 border-b bg-secondary px-4 py-3"><span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground"><Botanic className="size-5" /></span><div><h2 className="text-sm font-bold">Plant care assistant</h2><p className="text-xs text-muted-foreground">Answers from the nursery</p></div></div>
      <Conversation><ConversationContent className="gap-5">{messages.length === 0 && <div className="mx-auto max-w-xs py-10 text-center"><Botanic className="mx-auto mb-4 size-8 text-primary"/><h3 className="font-display text-xl">How can we help your plants thrive?</h3><p className="mt-2 text-sm text-muted-foreground">Ask about light, watering, care, or an order.</p></div>}{messages.map((m) => <Message key={m.id} from={m.role}><MessageContent className={m.role === "user" ? "bg-primary text-primary-foreground" : undefined}><MessageResponse>{m.content}</MessageResponse></MessageContent></Message>)}{pending && <Message from="assistant"><MessageContent><Shimmer>Thinking...</Shimmer></MessageContent></Message>}<ConversationScrollButton /></ConversationContent></Conversation>
      <div className="border-t p-3"><PromptInput onSubmit={submit}><PromptInputTextarea placeholder="Ask about your plants..." /><PromptInputFooter className="justify-end"><PromptInputSubmit status={pending ? "submitted" : "ready"} disabled={pending} /></PromptInputFooter></PromptInput></div>
    </section>}
  </>;
}