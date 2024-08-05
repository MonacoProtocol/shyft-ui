import { FC, createContext, useContext, useEffect, useState, ReactNode } from 'react';

import { fetchEvents } from '@/endpoints/fetchEvents';
import { EventCategory, MonacoProtocolEvent } from '@/types/events';

interface EventContextProps {
  eventCategories: EventCategory[];
  events: MonacoProtocolEvent[];
  fetchEventsData: () => Promise<EventCategory[]>;
  eventByAccount: (eventAccount: string) => MonacoProtocolEvent | undefined;
  eventByMarketPk: (marketPk: string) => MonacoProtocolEvent | undefined;
  loading: boolean;
}

const EventContext = createContext<EventContextProps | undefined>(undefined);

type EventProviderProps = {
  children: ReactNode;
};

export const EventProvider: FC<EventProviderProps> = ({ children }) => {
  const [eventCategories, setEventCategories] = useState<EventCategory[]>([]);
  const [events, setEvents] = useState<MonacoProtocolEvent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEventsData();
  }, []);

  const fetchEventsData = async () => {
    setLoading(true);
    const eventsData = await fetchEvents();
    setEventCategories(eventsData);
    setEvents(flattenEvents(eventsData));
    setLoading(false);
    return eventsData;
  };

  const eventByAccount = (eventAccount: string) => {
    return events.find((event) => event.eventAccount === eventAccount);
  };

  const eventByMarketPk = (marketPk: string) => {
    return events.find((event) => {
      const marketPks = event.markets.map((market) => market.marketAccount);
      return marketPks.includes(marketPk);
    });
  };

  return (
    <EventContext.Provider
      value={{
        eventCategories,
        events,
        fetchEventsData,
        eventByAccount,
        eventByMarketPk,
        loading,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = (): EventContextProps => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within a EventProvider');
  } else {
    return context;
  }
};

const flattenEvents = (eventCategories: EventCategory[]) => {
  const events = [];
  for (const category of eventCategories) {
    for (const eventGroup of category.eventGroup) {
      for (const event of eventGroup.events) {
        events.push(event);
      }
    }
  }
  return events;
};
