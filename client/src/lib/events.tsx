import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, ReactNode } from 'react';

interface EventsContextType {
  isConnected: boolean;
}

const EventsContext = createContext<EventsContextType>({ isConnected: false });

export function EventsProvider({ children }: { children: ReactNode }) {
  const { data: status } = useQuery({
    queryKey: ['status'],
    queryFn: async () => {
      const response = await fetch('/api/status');
      return response.json();
    },
    refetchInterval: 1000
  });

  return (
    <EventsContext.Provider value={{ isConnected: !!status?.connected }}>
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  return useContext(EventsContext);
}