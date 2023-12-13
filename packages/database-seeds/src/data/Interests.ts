import { NewInterest } from '@moaitime/database-core';

export const getInterestsSeeds = async (): Promise<(NewInterest & { parentSlug?: string })[]> => {
  return [
    // Technology
    {
      slug: 'technology',
      name: 'Technology',
    },
    {
      slug: 'programming',
      name: 'Programming',
      parentSlug: 'technology',
    },
    // Entertainment
    {
      slug: 'entertainment',
      name: 'Entertainment',
    },
    {
      slug: 'movies',
      name: 'Movies',
      parentSlug: 'entertainment',
    },
    {
      slug: 'tv',
      name: 'TV',
      parentSlug: 'entertainment',
    },
    {
      slug: 'music',
      name: 'Music',
      parentSlug: 'entertainment',
    },
    {
      slug: 'books',
      name: 'Books',
      parentSlug: 'entertainment',
    },
    {
      slug: 'games',
      name: 'Games',
      parentSlug: 'entertainment',
    },
    // Business
    {
      slug: 'business',
      name: 'Business',
    },
    {
      slug: 'finance',
      name: 'Finance',
      parentSlug: 'business',
    },
    {
      slug: 'economics',
      name: 'Economics',
      parentSlug: 'business',
    },
    // Sports
    {
      slug: 'sports',
      name: 'Sports',
    },
    {
      slug: 'football',
      name: 'football',
      parentSlug: 'sports',
    },
  ];
};
