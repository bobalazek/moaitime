import { useState } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@moaitime/web-ui';

import StatisticsCalendarTabContent from '../../tabs/calendar/StatisticsCalendarTabContent';
import StatisticsFocusTabContent from '../../tabs/focus/StatisticsFocusTabContent';
import StatisticsHabitsTabContent from '../../tabs/habits/StatisticsHabitsTabContent';
import StatisticsMoodTabContent from '../../tabs/mood/StatisticsMoodTabContent';
import StatisticsNotesTabContent from '../../tabs/notes/StatisticsNotesTabContent';
import StatisticsGeneralTabContent from '../../tabs/StatisticsGeneralTabContent';
import StatisticsTasksTabContent from '../../tabs/tasks/StatisticsTasksTabContent';

const StatisticsPageMain = () => {
  const [tab, setTab] = useState('general');

  return (
    <main className="h-full w-full flex-grow overflow-auto p-4" data-test="statistics--main">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-2">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="habits">Habits</TabsTrigger>
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
        <TabsContent value="habits">
          <StatisticsHabitsTabContent />
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
