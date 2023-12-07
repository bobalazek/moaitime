import { useBackgroundStore } from '../../background/state/backgroundStore';
import { useGreetingStore } from '../../greeting/state/greetingStore';
import { useQuoteStore } from '../../quote/state/quoteStore';
import { useWeatherStore } from '../../weather/state/weatherStore';

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

  _isInitialized = true;
};

// Background
export const prepareBackground = async () => {
  const { loadBackgrounds, setRandomBackground } = useBackgroundStore.getState();

  await loadBackgrounds();

  setRandomBackground();
  setInterval(setRandomBackground, 1000 * 60 * 2);
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
export const prepareGreeting = async () => {
  const { loadGreetings, setRandomGreeting } = useGreetingStore.getState();

  await loadGreetings();

  setRandomGreeting();
  setInterval(setRandomGreeting, 1000 * 60 * 5);
};

// Quote
export const prepareQuote = async () => {
  const { loadQuotes, setRandomQuote } = useQuoteStore.getState();

  await loadQuotes();

  setRandomQuote();
  setTimeout(setRandomQuote, 1000 * 60 * 2);
};
