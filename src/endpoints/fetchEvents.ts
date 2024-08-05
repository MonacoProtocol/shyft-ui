import { DefaultAppSettings } from '@/config/settings';
import { EventCategories, EventCategory } from '@/types/events';

export const fetchEvents = async (): Promise<EventCategory[]> => {
  const eventData = await fetch(DefaultAppSettings.eventsUrl);
  const jsonData = (await eventData.json()) as EventCategories;
  const filteredData = jsonData.eventCategories.filter(
    (category: EventCategory) => category.id != 'HISTORICAL',
  );
  return sortEventCategories(filteredData);
};

function sortEventCategories(eventCategories: EventCategory[]): EventCategory[] {
  const sortedCategories = [...eventCategories];
  sortedCategories.sort((a, b) => a.id.localeCompare(b.id));

  sortedCategories.forEach((category) => {
    if (category.eventGroup && Array.isArray(category.eventGroup)) {
      category.eventGroup.sort((a, b) => a.id.localeCompare(b.id));
    }
  });

  return sortedCategories;
}
