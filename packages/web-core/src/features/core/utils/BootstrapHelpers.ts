import { useBackgroundStore } from '../../background/state/backgroundStore';
import { useCalendarStore } from '../../calendar/state/calendarStore';
import { useGreetingStore } from '../../greeting/state/greetingStore';
import { useQuoteStore } from '../../quote/state/quoteStore';
import { useTasksStore } from '../../tasks/state/tasksStore';
import { useWeatherStore } from '../../weather/state/weatherStore';
import { events, greetings, lists, quotes } from './BootstrapData';

let _isInitialized = false;
export const initializeApp = () => {
  if (_isInitialized) {
    return;
  }

  document.body.classList.add('dark');

  // Background
  prepareBackground();

  // Weather
  prepareWeather();

  // Greeting
  prepareGreeting();

  // Quote
  prepareQuote();

  // Tasks
  prepareTasks();

  // Calendar
  prepareCalendar();

  _isInitialized = true;
};

// Background
export const prepareBackground = async () => {
  const { loadBackgrounds, setRandomBackground } = useBackgroundStore.getState();

  await loadBackgrounds();

  setRandomBackground();

  setInterval(
    () => {
      setRandomBackground();
    },
    1000 * 60 * 2
  );
};

// Weather
export const prepareWeather = () => {
  const { setWeather } = useWeatherStore.getState();

  setWeather({
    location: 'Veržej, Slovenia',
    time: new Date().toISOString(),
    conditions: 'Sunny',
    temperatureCelsius: 20,
    windSpeedKilometersPerHour: 0,
  });
};

// Greeting
export const prepareGreeting = () => {
  const { setGreetings, setRandomGreeting } = useGreetingStore.getState();
  setGreetings(greetings);

  setRandomGreeting();
  setInterval(setRandomGreeting, 1000 * 60 * 5);
};

// Quote
export const prepareQuote = () => {
  const { setQuotes, setRandomQuote } = useQuoteStore.getState();
  setQuotes(quotes);

  setRandomQuote();
  setTimeout(setRandomQuote, 1000 * 60 * 2);
};

// Tasks
export const prepareTasks = () => {
  const { setLists } = useTasksStore.getState();

  setLists(lists);
};

// Calendar
export const prepareCalendar = () => {
  const { setEvents } = useCalendarStore.getState();

  setEvents(events);
};
