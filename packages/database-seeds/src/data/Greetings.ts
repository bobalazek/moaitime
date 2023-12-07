import { NewGreeting } from '@myzenbuddy/database-core';

export const getGreetingsSeeds = async (): Promise<NewGreeting[]> => {
  return [
    {
      text: 'Good Morning, {displayName}!',
      query: 'vars.hour < 12',
    },
    {
      text: 'Morning, {displayName}! Got your cup of coffee just yet?',
      query: 'vars.hour < 12',
    },
    {
      text: 'Good Afternoon, {displayName}!',
      query: 'vars.hour > 12 && vars.hour < 18',
    },
    {
      text: 'Good Evening, {displayName}!',
      query: 'vars.hour > 18',
    },
    {
      text: 'It is a great day to be a {displayName}!',
    },
    {
      text: 'Carpe diem, {displayName}!',
    },
    {
      text: 'Just Do It, {displayName}!',
    },
    {
      text: 'You are a rockstar, {displayName}!',
    },
    {
      text: 'You are a superstar, {displayName}!',
    },
    {
      text: 'You are a banana, {displayName}!',
    },
    {
      text: 'You are a wizard, {displayName}!',
    },
    {
      text: 'You are a superhero, {displayName}!',
    },
    {
      text: 'You are breathtaking, {displayName}!',
    },
    {
      text: "Hello {displayName}, if you were a vegetable, you'd be a 'cute-cumber'!",
    },
    {
      text: 'Hey {displayName}, stay sharp!',
    },
    {
      text: "What's up, {displayName}? Rocking it as usual!",
    },
    {
      text: 'Yo {displayName}, keep rolling!',
    },
    {
      text: "Hey {displayName}, you're on fire today!",
    },
    {
      text: "What's cooking, {displayName}?",
    },
    {
      text: 'Hey {displayName}, stay cool!',
    },
    {
      text: 'Hello {displayName}, keep shining!',
    },
    {
      text: 'Hi {displayName}, stay awesome!',
    },
    {
      text: 'Yo {displayName}, keep buzzing!',
    },
    {
      text: 'Hey {displayName}, stay groovy!',
    },
    {
      text: 'I Am {displayName}!',
    },
  ];
};
