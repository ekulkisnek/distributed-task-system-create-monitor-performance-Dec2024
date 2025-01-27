
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';

type EventsContextType = {
  connected: boolean;
};

const EventsContext = createContext<EventsContextType>({ connected: false });

export function EventsProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const events = new EventSource('/api/events');

    events.onopen = () => {
      setConnected(true);
    };

    events.onerror = () => {
      setConnected(false);
    };

    events.addEventListener('task-update', () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
    });

    events.addEventListener('worker-update', () => {
      queryClient.invalidateQueries({ queryKey: ['/api/workers'] });
    });

    events.addEventListener('metrics-update', () => {
      queryClient.invalidateQueries({ queryKey: ['/api/metrics'] });
    });

    return () => {
      events.close();
    };
  }, [queryClient]);

  return (
    <EventsContext.Provider value={{ connected }}>
      {children}
    </EventsContext.Provider>
  );
}

export const useEvents = () => useContext(EventsContext);
