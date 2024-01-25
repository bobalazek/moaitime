import { useState } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@moaitime/web-ui';

import StatisticsCalendarTabContent from '../../tabs/StatisticsCalendarTabContent';
import StatisticsFocusTabContent from '../../tabs/StatisticsFocusTabContent';
import StatisticsGeneralTabContent from '../../tabs/StatisticsGeneralTabContent';
import StatisticsMoodTabContent from '../../tabs/StatisticsMoodTabContent';
import StatisticsNotesTabContent from '../../tabs/StatisticsNotesTabContent';
import StatisticsTasksTabContent from '../../tabs/StatisticsTasksTabContent';

const StatisticsPageMain = () => {
  const [tab, setTab] = useState('general');

  return (
    <main className="h-full w-full flex-grow overflow-auto p-4" data-test="statistics--main">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-2">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="mood">Mood</TabsTrigger>
          <TabsTrigger value="focus">Focus</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <StatisticsGeneralTabContent />
        </TabsContent>
        <TabsContent value="calendar">
          <StatisticsCalendarTabContent />
        </TabsContent>
        <TabsContent value="tasks">
          <StatisticsTasksTabContent />
        </TabsContent>
        <TabsContent value="notes">
          <StatisticsNotesTabContent />
        </TabsContent>
        <TabsContent value="mood">
          <StatisticsMoodTabContent />
        </TabsContent>
        <TabsContent value="focus">
          <StatisticsFocusTabContent />
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default StatisticsPageMain;
