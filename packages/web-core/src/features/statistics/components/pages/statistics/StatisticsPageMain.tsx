import { useState } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@moaitime/web-ui';

import StatisticsGeneralTabContent from '../../tabs/StatisticsGeneralTabContent';

const StatisticsPageMain = () => {
  const [tab, setTab] = useState('general');

  return (
    <main className="h-full w-full flex-grow overflow-auto p-4" data-test="statistics--main">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="Mood">Mood</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="focus">Focus</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <StatisticsGeneralTabContent />
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default StatisticsPageMain;
