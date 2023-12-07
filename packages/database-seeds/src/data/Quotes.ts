import { NewQuote } from '@myzenbuddy/database-core';

export const getQuotesSeeds = async (): Promise<NewQuote[]> => {
  return [
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
};
