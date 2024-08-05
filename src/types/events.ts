export interface EventCategory {
  id: string;
  title: string;
  eventGroup: EventGroup[];
}

export interface EventGroup {
  id: string;
  title: string;
  events: MonacoProtocolEvent[];
}

export interface MonacoProtocolEvent {
  eventAccount: string;
  eventName: string;
  eventStart: number;
  estimatedEnd: number;
  category: string;
  categoryTitle: string;
  eventGroup: string;
  eventGroupTitle: string;
  markets: EventCategoryMarket[];
}

export interface EventCategoryMarket {
  marketAccount: string;
}

export interface EventCategories {
  eventCategories: EventCategory[];
}
