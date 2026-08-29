import { Suspense } from "react";
import ChatWorkspace from "@/components/ChatWorkspace";

export default function ChatPage() {
  return (
    <div className="px-3 py-4 md:px-6">
      <Suspense fallback={<div className="p-8 text-slate-500">Loading chat…</div>}>
        <ChatWorkspace />
      </Suspense>
    </div>
  );
}
