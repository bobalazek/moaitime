import { format } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';

import {
  BackgroundInterface,
  EventInterface,
  GreetingInterface,
  ListInterface,
  QuoteInterface,
  TASK_LIST_COLORS,
} from '@myzenbuddy/shared-common';

// TODO: deprecate all this once we have the API set up

export const lists: ListInterface[] = [
  {
    id: 'inbox',
    name: 'Inbox',
    color: TASK_LIST_COLORS[0].value,
  },
  {
    id: 'today',
    name: 'Today',
    color: TASK_LIST_COLORS[1].value,
  },
  {
    id: 'groceries',
    name: 'Groceries',
    color: TASK_LIST_COLORS[2].value,
  },
  {
    id: 'errands',
    name: 'Errands',
    color: TASK_LIST_COLORS[3].value,
  },
];

export const quotes: QuoteInterface[] = [
  {
    text: 'If you sum 1 and 1 together, you get 2.',
    author: 'Me, an intellectual',
  },
  {
    text: "I told my computer I needed a break, and now it won't stop sending me Kit-Kat ads.",
    author: 'Me, a snack enthusiast',
  },
  {
    text: "Why don't scientists trust atoms? Because they make up everything!",
    author: 'A pun-loving physicist',
  },
  {
    text: "I asked my dog what's two minus two. He said nothing.",
    author: 'A dog whisperer',
  },
  {
    text: "Parallel lines have so much in common. It's a shame they'll never meet.",
    author: 'A geometry fan',
  },
  {
    text: 'My bed is a magical place where I suddenly remember everything I forgot to do.',
    author: 'A night thinker',
  },
  {
    text: 'I am on a seafood diet. I see food, and I eat it.',
    author: 'A food philosopher',
  },
  {
    text: "I'm reading a book on anti-gravity. It's impossible to put down.",
    author: 'A gravity defier',
  },
  {
    text: "I would tell you a construction joke, but I'm still working on it.",
    author: 'A builder with a sense of humor',
  },
  {
    text: 'I used to play piano by ear, but now I use my hands.',
    author: 'A musical comedian',
  },
  {
    text: 'I told my wife she should embrace her mistakes. She gave me a hug.',
    author: 'A humorous husband',
  },
  {
    text: "I have a joke about time travel, but you didn't like it.",
    author: 'A future comedian',
  },
  {
    text: "I'm not lazy, I'm on energy-saving mode.",
    author: 'A power saver',
  },
  {
    text: 'The future, the present, and the past walked into a bar. Things got a little tense.',
    author: 'A time-traveling bartender',
  },
  {
    text: 'I asked my computer for a petabyte. It brought me a bowl of food.',
    author: 'A confused techie',
  },
  {
    text: 'I have a split personality, said Tom, being Frank.',
    author: 'A dual-natured speaker',
  },
  {
    text: "I wanted to grow my own food but I couldn't get bacon seeds anywhere.",
    author: 'A hopeful farmer',
  },
  {
    text: "I'm reading a book about anti-gravity. It's impossible to put down.",
    author: 'A fascinated reader',
  },
  {
    text: 'I told the doctor I broke my arm in two places. He told me to stop going to those places.',
    author: 'An accident-prone patient',
  },
  {
    text: "I have a joke about chemistry, but I don't think it will get a reaction.",
    author: 'A cautious chemist',
  },
  {
    text: "Some people think prison is one word…but to robbers, it's the whole sentence.",
    author: 'A wordplay warden',
  },
];

export const greetings: GreetingInterface[] = [
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

export const backgrounds: BackgroundInterface[] = [
  {
    imageUrl:
      'https://images.unsplash.com/photo-1477882244523-716124bf91a1?ixlib=rb-0.3.5&q=99&fm=jpg&crop=entropy&cs=tinysrgb&w=2048&fit=max&s=fa299e55dd53567a6c3c99c4b427687b?momo_cache_bg_uuid=f45d83c1-614b-449a-a5ca-6ae63fa1cd72',
    title: 'Brooklyn Bridge, NY, United States',
    author: 'Pedro Lastra, Unsplash',
    url: 'https://unsplash.com/photos/brooklyn-bridge-with-lights-at-night-time-DiBu1qTQQ8s',
  },
  {
    imageUrl:
      'https://images.unsplash.com/photo-1698522146643-48af8d585b10?q=80&w=2672&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'A dalmatian dog standing in a field of tall grass',
    author: 'Megan Dujardin',
    url: 'https://unsplash.com/photos/a-dalmatian-dog-standing-in-a-field-of-tall-grass-FcK5gVoUs6Q',
  },
  {
    imageUrl:
      'https://images.unsplash.com/photo-1682686581362-796145f0e123?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'A desert landscape with mountains in the distance',
    author: 'NEOM',
    url: 'https://unsplash.com/photos/a-desert-landscape-with-mountains-in-the-distance-SGZ5DkDOoRo',
  },
  {
    imageUrl:
      'https://images.unsplash.com/photo-1699519395723-016506210ee1?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'A hot air balloon flying over a small town',
    author: 'Chloé Chavanon',
    url: 'https://unsplash.com/photos/a-hot-air-balloon-flying-over-a-small-town-RcaEdvnTPpk',
  },
  {
    imageUrl:
      'https://images.unsplash.com/photo-1699823242809-0386f4592503?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'A small black and white bird',
    author: 'Erik Kartis',
    url: 'https://unsplash.com/photos/a-small-black-and-white-bird-perched-on-a-branch-zt9o-5hQT6Y',
  },
  {
    imageUrl:
      'https://images.unsplash.com/photo-1519962551779-514fa155be9a?q=80&w=2570&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Body of water during golden hour',
    author: 'Lucan Ludwig',
    url: 'https://unsplash.com/photos/body-of-water-during-golden-hour-Q6sdzNWsg2o',
  },
];

const now = new Date();
const todaysDate = format(now, 'yyyy-MM-dd');
const timezone = 'Europe/Ljubljana';
const createdAt = now.toISOString();
export const events: EventInterface[] = [
  {
    id: '1',
    title: 'Event 1',
    description: 'Event 1 Description',
    isAllDay: false,
    startsAt: zonedTimeToUtc(`${todaysDate}T12:00:00.000`, timezone).toISOString(),
    endsAt: zonedTimeToUtc(`${todaysDate}T13:00:00.000`, timezone).toISOString(),
    createdAt,
    updatedAt: createdAt,
  },
  {
    id: '2',
    title: 'Event 2',
    description: 'Event 2 Description',
    isAllDay: false,
    startsAt: zonedTimeToUtc(`${todaysDate}T14:00:00.000`, timezone).toISOString(),
    endsAt: zonedTimeToUtc(`${todaysDate}T17:00:00.000`, timezone).toISOString(),
    createdAt,
    updatedAt: createdAt,
  },
  {
    id: '3',
    title: 'Event 3 Overlap',
    description: 'Event 3 Description',
    isAllDay: false,
    startsAt: zonedTimeToUtc(`${todaysDate}T12:00:00.000`, timezone).toISOString(),
    endsAt: zonedTimeToUtc(`${todaysDate}T19:00:00.000`, timezone).toISOString(),
    createdAt,
    updatedAt: createdAt,
  },
  {
    id: '4',
    title: 'Event 4 Overlap',
    description: 'Event 4 Description',
    isAllDay: false,
    startsAt: zonedTimeToUtc(`${todaysDate}T10:00:00.000`, timezone).toISOString(),
    endsAt: zonedTimeToUtc(`${todaysDate}T20:00:00.000`, timezone).toISOString(),
    createdAt,
    updatedAt: createdAt,
  },
  {
    id: '10',
    title: 'Event Full Day',
    description: 'Event Full Day Description',
    isAllDay: true,
    startsAt: zonedTimeToUtc(`${todaysDate}T00:00:00.000`, timezone).toISOString(),
    endsAt: zonedTimeToUtc(`${todaysDate}T23:59:59.999`, timezone).toISOString(),
    createdAt,
    updatedAt: createdAt,
  },
  {
    id: '11',
    title: 'Second Event Full Day',
    description: 'Second Event Full Day Description',
    isAllDay: true,
    startsAt: zonedTimeToUtc(`${todaysDate}T00:00:00.000`, timezone).toISOString(),
    endsAt: zonedTimeToUtc(`${todaysDate}T23:59:59.999`, timezone).toISOString(),
    createdAt,
    updatedAt: createdAt,
  },
];
