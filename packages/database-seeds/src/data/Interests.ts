import { NewInterest } from '@moaitime/database-core';

export const getInterestsSeeds = async (): Promise<(NewInterest & { parentSlug?: string })[]> => {
  return [
    // Technology
    {
      slug: 'technology',
      name: 'Technology',
    },
    {
      slug: 'hardware',
      name: 'Hardware',
      parentSlug: 'technology',
    },
    {
      slug: 'software-and-applications',
      name: 'Software and Applications',
      parentSlug: 'technology',
    },
    {
      slug: 'emerging-tech',
      name: 'Emerging Tech',
      parentSlug: 'technology',
    },
    {
      slug: 'networking',
      name: 'Networking',
      parentSlug: 'technology',
    },
    {
      slug: 'electronics',
      name: 'Electronics',
      parentSlug: 'technology',
    },
    {
      slug: 'data-science-and-analytics',
      name: 'Data Science and Analytics',
      parentSlug: 'technology',
    },
    {
      slug: 'digital-media',
      name: 'Digital Media',
      parentSlug: 'technology',
    },
    {
      slug: 'tech-industry-and-culture',
      name: 'Tech Industry and Culture',
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
    {
      slug: 'theater',
      name: 'Theater',
      parentSlug: 'entertainment',
    },
    {
      slug: 'dance',
      name: 'Dance',
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
    {
      slug: 'entropreneurship',
      name: 'Entrepreneurship',
      parentSlug: 'business',
    },
    {
      slug: 'marketing',
      name: 'Marketing',
      parentSlug: 'business',
    },
    {
      slug: 'real-estate',
      name: 'Real Estate',
      parentSlug: 'business',
    },
    // Sports
    {
      slug: 'sports',
      name: 'Sports',
    },
    {
      slug: 'team-sports',
      name: 'Team Sports',
      parentSlug: 'sports',
    },
    {
      slug: 'individual-sports',
      name: 'Individual Sports',
      parentSlug: 'sports',
    },
    {
      slug: 'water-sports',
      name: 'Water Sports',
      parentSlug: 'sports',
    },
    {
      slug: 'winter-sports',
      name: 'Winter Sports',
      parentSlug: 'sports',
    },
    {
      slug: 'athletics',
      name: 'Athletics',
      parentSlug: 'sports',
    },
    {
      slug: 'combat-sports',
      name: 'Combat Sports',
      parentSlug: 'sports',
    },
    {
      slug: 'motor-sports',
      name: 'Motor Sports',
      parentSlug: 'sports',
    },
    {
      slug: 'adventure-sports',
      name: 'Adventure Sports',
      parentSlug: 'sports',
    },
    {
      slug: 'outdoor-activities',
      name: 'Outdoor Activities',
      parentSlug: 'travel-and-outdoors',
    },
    {
      slug: 'mind-sports',
      name: 'Mind Sports',
      parentSlug: 'sports',
    },
    // Health and Wellness
    {
      slug: 'health-and-wellness',
      name: 'Health and Wellness',
    },
    {
      slug: 'Fitness',
      name: 'Fitness',
      parentSlug: 'health-and-wellness',
    },
    {
      slug: 'mental-health',
      name: 'Mental Health',
      parentSlug: 'health-and-wellness',
    },
    {
      slug: 'nutrition',
      name: 'Nutrition',
      parentSlug: 'health-and-wellness',
    },
    // Art and Design
    {
      slug: 'art-and-design',
      name: 'Art and Design',
    },
    {
      slug: 'visual-arts',
      name: 'Visual Arts',
      parentSlug: 'art-and-design',
    },
    {
      slug: 'crafts',
      name: 'Crafts',
      parentSlug: 'art-and-design',
    },
    {
      slug: 'design',
      name: 'Design',
      parentSlug: 'art-and-design',
    },
    // Science and Nature
    {
      slug: 'science-and-nature',
      name: 'Science and Nature',
    },
    {
      slug: 'natural-science',
      name: 'Natural Science',
      parentSlug: 'science-and-nature',
    },
    {
      slug: 'environmentalism',
      name: 'Environmentalism',
      parentSlug: 'science-and-nature',
    },
    {
      slug: 'social-science',
      name: 'Social Science',
      parentSlug: 'science-and-nature',
    },
    // Education and Learning
    {
      slug: 'education-and-learning',
      name: 'Education and Learning',
    },
    {
      slug: 'cultural-and-language-studies',
      name: 'Cultural and Language Studies',
      parentSlug: 'education-and-learning',
    },
    {
      slug: 'cultural-activities',
      name: 'Cultural Activities',
      parentSlug: 'education-and-learning',
    },
    // Food and Cooking
    {
      slug: 'food-and-cooking',
      name: 'Food and Cooking',
    },
    {
      slug: 'culinary-arts',
      name: 'Culinary Arts',
      parentSlug: 'food-and-cooking',
    },
    {
      slug: 'gastronomy-and-techniques',
      name: 'Gastronomy and Techniques',
      parentSlug: 'food-and-cooking',
    },
    {
      slug: 'beverages',
      name: 'Beverages',
      parentSlug: 'food-and-cooking',
    },
    // Social and Cultural
    {
      slug: 'social-and-cultural',
      name: 'Social and Cultural',
    },
    {
      slug: 'comunity-service',
      name: 'Community Service',
      parentSlug: 'social-and-cultural',
    },
    {
      slug: 'social-issues',
      name: 'Social Issues',
      parentSlug: 'social-and-cultural',
    },
    {
      slug: 'social-movements',
      name: 'Social Movements',
      parentSlug: 'social-and-cultural',
    },
    // Lifestyle and Travel
    {
      slug: 'lifestyle-and-travel',
      name: 'Lifestyle and Travel',
    },
    {
      slug: 'travel',
      name: 'Travel',
      parentSlug: 'lifestyle-and-travel',
    },
    {
      slug: 'home-improvements',
      name: 'Home Improvements',
      parentSlug: 'lifestyle-and-travel',
    },
    {
      slug: 'gardening',
      name: 'Gardening',
      parentSlug: 'lifestyle-and-travel',
    },
    {
      slug: 'personal-finance',
      name: 'Personal Finance',
      parentSlug: 'lifestyle-and-travel',
    },
    {
      slug: 'pets',
      name: 'Pets',
      parentSlug: 'lifestyle-and-travel',
    },
  ];
};
