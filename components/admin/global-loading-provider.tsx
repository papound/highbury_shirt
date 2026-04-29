"use client";

import { createContext, useContext, useState } from "react";
import { Loader2 } from "lucide-react";

interface GlobalLoadingContextValue {
  setGlobalLoading: (loading: boolean, message?: string) => void;
}

const GlobalLoadingContext = createContext<GlobalLoadingContextValue>({
  setGlobalLoading: () => {},
});

export function useGlobalLoading() {
  return useContext(GlobalLoadingContext);
}

export function GlobalLoadingProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("กำลังดำเนินการ...");

  function setGlobalLoading(v: boolean, msg = "กำลังดำเนินการ...") {
    setMessage(msg);
    setLoading(v);
  }

  return (
    <GlobalLoadingContext.Provider value={{ setGlobalLoading }}>
      {loading && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-3 bg-black/50 backdrop-blur-sm">
          <Loader2 className="w-10 h-10 animate-spin text-white" />
          <p className="text-white text-sm font-medium">{message}</p>
        </div>
      )}
      {children}
    </GlobalLoadingContext.Provider>
  );
}
