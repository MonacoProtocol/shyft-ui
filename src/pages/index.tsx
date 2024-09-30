import {
  Accordion,
  AccordionItem,
  Card,
  CardBody,
  CardFooter,
  Chip,
  Image,
} from '@nextui-org/react';
import { useRouter } from 'next/router';

import { LoadingComponent } from '@/components/navigation/loading';
import { useEvents } from '@/context/EventProvider';
import { convertTimestampToDateString } from '@/utils/dateTime';

function HomePage() {
  const { eventCategories, loading } = useEvents();
  const router = useRouter();

  const navigateToEvent = (eventAccount: string) => {
    router.push(`/events/${eventAccount}`);
  };

  if (loading) {
    return <LoadingComponent />;
  }
  return (
    <div className="main-layout">
      <div className="left-section">
        <Accordion
          variant="bordered"
          defaultExpandedKeys={[eventCategories.length > 0 ? eventCategories[0].id : '']}
        >
          {eventCategories.map((eventCategory) => {
            return (
              <AccordionItem key={eventCategory?.id} title={eventCategory?.title}>
                <Accordion defaultExpandedKeys={[eventCategory?.eventGroup[0].title]}>
                  {eventCategory?.eventGroup.map((eventGroup) => {
                    return (
                      <AccordionItem
                        key={eventGroup?.title}
                        startContent={
                          <span>
                            {eventGroup?.title}{' '}
                            <Chip size="sm" color="secondary">
                              {eventGroup.events.length}
                            </Chip>
                          </span>
                        }
                      >
                        <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
                          {eventGroup?.events.map((event, index) => {
                            return (
                              <Card
                                shadow="md"
                                key={index}
                                isPressable
                                onPress={() => navigateToEvent(event.eventAccount)}
                              >
                                <CardBody className="overflow-visible p-0">
                                  <Image
                                    shadow="sm"
                                    radius="lg"
                                    width="100%"
                                    alt="alt"
                                    className="w-full object-cover h-[140px]"
                                    src="/eventCards/1.png"
                                  />
                                </CardBody>
                                <CardFooter className="text-small text-left">
                                  {event.eventName}
                                  <br />
                                  {convertTimestampToDateString(event.eventStart)}
                                </CardFooter>
                              </Card>
                            );
                          })}
                        </div>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
      <div className="right-section">
        <div className="pl-10 font-bold text-blue-500 pointer-cursor">
          <a href="/wallet">View Your Positions</a>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
