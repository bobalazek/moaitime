import { NewGreeting } from '@moaitime/database-core';

export const getGreetingSeeds = async (): Promise<NewGreeting[]> => {
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
      text: "Hello {displayName}, if you were a vegetable, you'd be a cute-cumber!",
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
    {
      text: 'It is good to be a {displayName}!',
    },
    {
      text: 'Rise and shine, {displayName}!',
      query: 'vars.hour < 12',
    },
    {
      text: 'Top of the morning to you, {displayName}!',
      query: 'vars.hour < 12',
    },
    {
      text: 'Hey {displayName}, ready to seize the day?',
      query: 'vars.hour < 12',
    },
    {
      text: 'Hello {displayName}, keep blooming!',
    },
    {
      text: 'Howdy {displayName}, stay wild!',
    },
    {
      text: "Hey {displayName}, you're a gem!",
    },
    {
      text: 'Ahoy {displayName}, sail smoothly today!',
    },
    {
      text: 'Bonjour {displayName}, embrace the day!',
    },
    {
      text: 'Hi {displayName}, ready for an adventure?',
    },
    {
      text: 'Hola {displayName}, make today amazing!',
    },
    {
      text: "Hey {displayName}, let's make today epic!",
    },
    {
      text: 'Hello {displayName}, keep soaring high!',
    },
    {
      text: 'Hi {displayName}, unleash your awesomeness!',
    },
    {
      text: "What's new, {displayName}? Keep rocking!",
    },
    {
      text: 'Good day {displayName}, shine bright like a diamond!',
    },
    {
      text: "Hey {displayName}, let's make some magic today!",
    },
    {
      text: "How's it going, {displayName}? Stay cool as a cucumber!",
    },
    {
      text: 'Hello {displayName}, keep conquering the day!',
    },
    {
      text: 'Greetings {displayName}, may your day be as fabulous as you are!',
    },
    {
      text: 'Hey {displayName}, remember, you are amazing!',
    },
    {
      text: "Hi {displayName}, let's tackle today with a smile!",
    },
    {
      text: 'Hello {displayName}, ready to sparkle?',
    },
    {
      text: 'Hey {displayName}, every day is a new adventure!',
    },
    {
      text: 'Yo {displayName}, keep making waves!',
    },
    {
      text: "Hi {displayName}, let's rock this day together!",
    },
    {
      text: 'Buenos días, {displayName}! Embrace the sunshine!',
      query: 'vars.hour < 12',
    },
    {
      text: 'Hello {displayName}, ready to outshine the stars?',
    },
    {
      text: "Hey {displayName}, you're cooler than a polar bear's toenails!",
    },
    {
      text: "What's kicking, {displayName}? Stay fabulous!",
    },
    {
      text: "Hey {displayName}, you're the bee's knees!",
    },
    {
      text: 'Hola {displayName}, ready to spice things up today?',
    },
    {
      text: "Hi {displayName}, you're the cherry on top of this day!",
    },
    {
      text: "Hey {displayName}, you're the salsa to my taco!",
    },
    {
      text: "What's buzzing, {displayName}? Keep being awesome!",
    },
    {
      text: "Hi {displayName}, you're a true ninja today!",
    },
    {
      text: "Hey {displayName}, you're sweeter than honey!",
    },
    {
      text: 'Hello {displayName}, ready to dance through the day?',
    },
    {
      text: 'Hey {displayName}, stay as cool as ice!',
    },
    {
      text: "What's up, {displayName}? You're a shooting star!",
    },
    {
      text: 'Hey {displayName}, keep ruling your kingdom!',
    },
    {
      text: "Hi {displayName}, you're a legend in the making!",
    },
    {
      text: "Hey {displayName}, you're the captain of this ship!",
    },
    {
      text: 'Hello {displayName}, ready to explore new galaxies?',
    },
    {
      text: "Hey {displayName}, you're the hero of your story!",
    },
    {
      text: "Hey {displayName}, you're the spark in the dark!",
    },
    {
      text: "Hey {displayName}, you're as cool as a cucumber in a bowl of hot sauce!",
    },
    {
      text: 'Hello {displayName}, ready to conquer the world today?',
    },
    {
      text: "What's cooking, {displayName}? You're hotter than a jalapeño!",
    },
    {
      text: "Hi {displayName}, you're the peanut butter to the jelly of life!",
    },
    {
      text: "Good to see you, {displayName}! You're a ray of sunshine in a cloudy sky!",
    },
    {
      text: "Hey {displayName}, you're the melody in the music of life!",
    },
    {
      text: 'Hello {displayName}, ready to make today your masterpiece?',
    },
    {
      text: "Hi {displayName}, you're a wizard with a wand of positivity!",
    },
    {
      text: "What's the word, {displayName}? You're as mighty as an oak!",
    },
    {
      text: "Hey {displayName}, you're the captain of your own destiny!",
    },
    {
      text: 'Hello {displayName}, ready to spread your wings and fly?',
    },
    {
      text: "Hi {displayName}, you're the lighthouse in the storm of life!",
    },
    {
      text: "Hey {displayName}, you're the rhythm to life's dance!",
    },
    {
      text: "Hey {displayName}, you're the spice in the recipe of life!",
    },
    {
      text: 'Hello {displayName}, ready to shine like the star you are?',
    },
    {
      text: "What's up, {displayName}? You're a hurricane of happiness!",
    },
    {
      text: "Hey {displayName}, you're the symphony in the orchestra of life!",
    },
    {
      text: "Hi {displayName}, you're the hero in your own story!",
    },
    {
      text: 'Hey {displayName}, ready to blaze your own trail?',
    },
    {
      text: "Hello {displayName}, you're the secret ingredient in the dish of life!",
    },
    {
      text: 'Hello {displayName}, ready to dazzle the world today?',
    },
    {
      text: "Hey {displayName}, let's make today unforgettable!",
    },
    {
      text: 'Good morning {displayName}, may your day be as splendid as your smile!',
      query: 'vars.hour < 12',
    },
    {
      text: 'Hi {displayName}, embrace your inner awesomeness!',
    },
    {
      text: 'Rise and be amazing today, {displayName}!',
    },
    {
      text: 'Bonjour {displayName}, ready to sprinkle some joy today?',
    },
    {
      text: "Hey {displayName}, let's add some sparkle to the day!",
    },
    {
      text: "Hey {displayName}, let's turn dreams into reality today!",
    },
    {
      text: 'Hello {displayName}, time to be the hero of your own story!',
    },
    {
      text: 'Hi {displayName}, ready to climb mountains and reach new heights?',
    },
    {
      text: "Hey {displayName}, let's make waves and move mountains!",
    },
    {
      text: 'Hey {displayName}, ready to capture the day?',
    },
    {
      text: "Good morning {displayName}, today's a perfect day for a new adventure!",
      query: 'vars.hour < 12',
    },
    {
      text: "Hello {displayName}, let's weave some magic into today!",
    },
    {
      text: 'Hi {displayName}, ready to make today ridiculously amazing?',
    },
    {
      text: "Hey {displayName}, let's create some extraordinary moments today!",
    },
    {
      text: "Hello {displayName}, today's chapter is yours to write!",
    },
    {
      text: 'Hi {displayName}, ready to make today shine bright?',
    },
    {
      text: "Hey {displayName}, let's turn the ordinary into extraordinary!",
    },
    {
      text: 'Rise and shine {displayName}, today is full of possibilities!',
      query: 'vars.hour < 12',
    },
    {
      text: "Morning {displayName}, let's catch the sunrise of success!",
      query: 'vars.hour < 12',
    },
    {
      text: 'Wakey wakey {displayName}, a new dawn awaits!',
      query: 'vars.hour < 12',
    },
    {
      text: "Good morning {displayName}, let's brew some dreams today!",
      query: 'vars.hour < 12',
    },
    {
      text: "Sun's up, {displayName}! Time to sparkle!",
      query: 'vars.hour < 12',
    },
    {
      text: 'Rise up, {displayName}, and greet a day full of promise!',
      query: 'vars.hour < 12',
    },
    {
      text: 'Hello {displayName}, let the morning be your playground!',
      query: 'vars.hour < 12',
    },
    {
      text: 'Morning glory {displayName}, today holds new treasures!',
      query: 'vars.hour < 12',
    },
    {
      text: 'Hey {displayName}, awaken to a day of wonders!',
      query: 'vars.hour < 12',
    },
    {
      text: "Good morning {displayName}, let's unfold the day's magic!",
      query: 'vars.hour < 12',
    },
    {
      text: 'Morning {displayName}, ready to bloom with the day?',
      query: 'vars.hour < 12',
    },
    {
      text: "Hey {displayName}, let's rise and thrive today!",
      query: 'vars.hour < 12',
    },
    {
      text: 'Good morning {displayName}, a new adventure awaits!',
      query: 'vars.hour < 12',
    },
    {
      text: 'Good morning {displayName}, ready to sprinkle joy all around?',
      query: 'vars.hour < 12',
    },
    {
      text: 'Rise, shine, and conquer, {displayName}!',
      query: 'vars.hour < 12',
    },
    {
      text: 'Good morning {displayName}, set sail for success!',
      query: 'vars.hour < 12',
    },
    {
      text: "Hey {displayName}, let's greet this day with a smile!",
      query: 'vars.hour < 12',
    },
    {
      text: 'Good morning {displayName}, ready to chase your dreams?',
      query: 'vars.hour < 12',
    },
    {
      text: "Morning {displayName}, let's turn today into a symphony of success!",
      query: 'vars.hour < 12',
    },
    {
      text: "Hey {displayName}, rise and embark on today's journey!",
      query: 'vars.hour < 12',
    },
    {
      text: 'Good morning {displayName}, ready to spread some sunshine?',
      query: 'vars.hour < 12',
    },
    {
      text: "Morning {displayName}, let's welcome the day with open arms!",
      query: 'vars.hour < 12',
    },
    {
      text: "Good morning {displayName}, embrace today's new opportunities!",
      query: 'vars.hour < 12',
    },
    {
      text: "Hey {displayName}, let's unwrap the gift of this new morning!",
    },
    {
      text: 'Rise and be splendid today, {displayName}!',
      query: 'vars.hour < 12',
    },
    {
      text: 'Hello {displayName}, a fresh day awaits your touch!',
      query: 'vars.hour < 12',
    },
    {
      text: 'Good morning {displayName}, ready to shine like the dawn?',
      query: 'vars.hour < 12',
    },
    {
      text: 'Hey {displayName}, awaken your inner brilliance this morning!',
      query: 'vars.hour < 12',
    },
    {
      text: "Hi {displayName}, let's start the day with positive vibes!",
    },
    {
      text: "Good morning {displayName}, let's blossom with the day!",
      query: 'vars.hour < 12',
    },
    {
      text: 'Morning, {displayName}! Ready to make today uniquely yours?',
      query: 'vars.hour < 12',
    },
    {
      text: "Hello {displayName}, let's greet this beautiful morning with a smile!",
      query: 'vars.hour < 12',
    },
    {
      text: 'Good morning {displayName}, today is yours to shape!',
      query: 'vars.hour < 12',
    },
    {
      text: "Hi {displayName}, let's make this morning unforgettable!",
      query: 'vars.hour < 12',
    },
    {
      text: "Hey {displayName}, let's make the morning hours count!",
      query: 'vars.hour < 12',
    },
    {
      text: 'Hello {displayName}, a new morning brings new possibilities!',
      query: 'vars.hour < 12',
    },
    {
      text: 'Good morning {displayName}, ready to spread your wings?',
      query: 'vars.hour < 12',
    },
    {
      text: "Hi {displayName}, let's make the most of this glorious morning!",
      query: 'vars.hour < 12',
    },
    {
      text: "Morning {displayName}, let's rise and shine brightly!",
      query: 'vars.hour < 12',
    },
    {
      text: 'Good afternoon {displayName}, keep shining bright!',
      query: 'vars.hour > 12 && vars.hour < 18',
    },
    {
      text: "Hello {displayName}, let's make this afternoon one to remember!",
      query: 'vars.hour > 12 && vars.hour < 18',
    },
    {
      text: "Hey {displayName}, let's conquer the second half of the day!",
      query: 'vars.hour > 12 && vars.hour < 18',
    },
    {
      text: 'Afternoon delight, {displayName}! Keep up the great work!',
      query: 'vars.hour > 12 && vars.hour < 18',
    },
    {
      text: 'Good afternoon {displayName}, ready to continue the adventure?',
      query: 'vars.hour > 12 && vars.hour < 18',
    },
    {
      text: "Hey {displayName}, the day's still young and full of potential!",
      query: 'vars.hour > 12 && vars.hour < 18',
    },
    {
      text: "Good afternoon {displayName}, let's make waves this afternoon!",
      query: 'vars.hour > 12 && vars.hour < 18',
    },
    {
      text: 'Hello {displayName}, ready to seize the rest of the day?',
      query: 'vars.hour > 12 && vars.hour < 18',
    },
    {
      text: 'Good afternoon {displayName}, keep fueling your dreams!',
      query: 'vars.hour > 12 && vars.hour < 18',
    },
    {
      text: 'Afternoon greetings, {displayName}! Stay energized and focused!',
      query: 'vars.hour > 12 && vars.hour < 18',
    },
    {
      text: 'Good afternoon {displayName}, ready for round two of awesomeness?',
      query: 'vars.hour > 12 && vars.hour < 18',
    },
    {
      text: "Hello {displayName}, let's keep the momentum going!",
      query: 'vars.hour > 12 && vars.hour < 18',
    },
    {
      text: 'Hey {displayName}, keep soaring through the afternoon sky!',
      query: 'vars.hour > 12 && vars.hour < 18',
    },
    {
      text: 'Good afternoon {displayName}, keep your spirits high!',
      query: 'vars.hour > 12 && vars.hour < 18',
    },
    {
      text: "Hi {displayName}, let's make the most of this beautiful afternoon!",
      query: 'vars.hour > 12 && vars.hour < 18',
    },
    {
      text: 'Good afternoon {displayName}, ready to tackle new challenges?',
      query: 'vars.hour > 12 && vars.hour < 18',
    },
    {
      text: "Hey {displayName}, let's brighten up this afternoon together!",
      query: 'vars.hour > 12 && vars.hour < 18',
    },
    {
      text: 'Good afternoon {displayName}, the best part of the day is still to come!',
      query: 'vars.hour > 12 && vars.hour < 18',
    },
    {
      text: 'Hello {displayName}, keep blooming, no matter the hour!',
      query: 'vars.hour > 12 && vars.hour < 18',
    },
    {
      text: 'Afternoon cheers, {displayName}! Keep making a difference!',
      query: 'vars.hour > 12 && vars.hour < 18',
    },
    {
      text: "Good afternoon {displayName}, let's continue our journey with joy!",
      query: 'vars.hour > 12 && vars.hour < 18',
    },
    {
      text: 'Hey {displayName}, ready to add more achievements to the day?',
      query: 'vars.hour > 12 && vars.hour < 18',
    },
    {
      text: "Good afternoon {displayName}, let's thrive through the rest of the day!",
      query: 'vars.hour > 12 && vars.hour < 18',
    },
    {
      text: "Good afternoon {displayName}, let's keep the day amazing!",
      query: 'vars.hour > 12 && vars.hour < 18',
    },
    {
      text: 'Hey {displayName}, ready to add some afternoon awesomeness?',
      query: 'vars.hour > 12 && vars.hour < 18',
    },
    {
      text: 'Afternoon sunshine, {displayName}! Keep glowing!',
      query: 'vars.hour > 12 && vars.hour < 18',
    },
    {
      text: "Good afternoon {displayName}, let's keep the positive energy flowing!",
      query: 'vars.hour > 12 && vars.hour < 18',
    },
    {
      text: 'Hello {displayName}, ready to rock the rest of your day?',
      query: 'vars.hour > 12 && vars.hour < 18',
    },
    {
      text: 'Hey {displayName}, keep shining bright this afternoon!',
      query: 'vars.hour > 12 && vars.hour < 18',
    },
    {
      text: "Good afternoon {displayName}, let's make every moment count!",
      query: 'vars.hour > 12 && vars.hour < 18',
    },
    {
      text: "Hello {displayName}, let's make this afternoon one to remember!",
      query: 'vars.hour > 12 && vars.hour < 18',
    },
    {
      text: 'Good afternoon {displayName}, ready to keep up the great work?',
      query: 'vars.hour > 12 && vars.hour < 18',
    },
    {
      text: "Hey {displayName}, let's keep the day's momentum going!",
      query: 'vars.hour > 12 && vars.hour < 18',
    },
    {
      text: 'Afternoon vibes, {displayName}! Stay fabulous!',
      query: 'vars.hour > 12 && vars.hour < 18',
    },
    {
      text: "Good afternoon {displayName}, let's turn challenges into opportunities!",
      query: 'vars.hour > 12 && vars.hour < 18',
    },
    {
      text: 'Hello {displayName}, ready to add some afternoon magic?',
      query: 'vars.hour > 12 && vars.hour < 18',
    },
    {
      text: 'Good afternoon {displayName}, keep your spirits soaring high!',
      query: 'vars.hour > 12 && vars.hour < 18',
    },
    {
      text: "Hey {displayName}, let's add a splash of joy to the afternoon!",
      query: 'vars.hour > 12 && vars.hour < 18',
    },
    {
      text: 'Good afternoon {displayName}, ready to continue the adventure?',
      query: 'vars.hour > 12 && vars.hour < 18',
    },
    {
      text: "Hi {displayName}, let's make this afternoon unforgettable!",
      query: 'vars.hour > 12 && vars.hour < 18',
    },
    {
      text: 'Good afternoon {displayName}, keep conquering your goals!',
      query: 'vars.hour > 12 && vars.hour < 18',
    },
    {
      text: "Hey {displayName}, let's make the afternoon hours shine!",
      query: 'vars.hour > 12 && vars.hour < 18',
    },
    {
      text: 'Afternoon greetings, {displayName}! Keep being awesome!',
      query: 'vars.hour > 12 && vars.hour < 18',
    },
    {
      text: "Good afternoon {displayName}, let's brighten up the day even more!",
      query: 'vars.hour > 12 && vars.hour < 18',
    },
    {
      text: "Good evening {displayName}, let's wind down with positivity!",
      query: 'vars.hour > 18',
    },
    {
      text: 'Hey {displayName}, ready to relax after a day well spent?',
      query: 'vars.hour > 18',
    },
    {
      text: "Evening serenity, {displayName}! Time to reflect on today's joys!",
      query: 'vars.hour > 18',
    },
    {
      text: "Good evening {displayName}, let's cherish the peaceful night moments!",
      query: 'vars.hour > 18',
    },
    {
      text: 'Hello {displayName}, ready to embrace the calm of the evening?',
      query: 'vars.hour > 18',
    },
    {
      text: "Hey {displayName}, let's unwind and enjoy the evening tranquility!",
      query: 'vars.hour > 18',
    },
    {
      text: 'Hi {displayName}, ready to bask in the glow of the evening stars?',
      query: 'vars.hour > 18',
    },
    {
      text: "Good evening {displayName}, let's make the night time magical!",
      query: 'vars.hour > 18',
    },
    {
      text: "Hello {displayName}, let's enjoy the beauty of this quiet evening!",
      query: 'vars.hour > 18',
    },
    {
      text: 'Good evening {displayName}, ready for some well-deserved relaxation?',
      query: 'vars.hour > 18',
    },
    {
      text: "Hey {displayName}, let's savor the peacefulness of the night!",
      query: 'vars.hour > 18',
    },
    {
      text: 'Evening blessings, {displayName}! May your night be cozy and calm!',
      query: 'vars.hour > 18',
    },
    {
      text: "Good evening {displayName}, let's fill the night with dreams and rest!",
      query: 'vars.hour > 18',
    },
    {
      text: 'Hello {displayName}, ready to capture the essence of this beautiful evening?',
      query: 'vars.hour > 18',
    },
    {
      text: "Hi {displayName}, let's enjoy the gentle whispers of the night!",
      query: 'vars.hour > 18',
    },
    {
      text: 'Good evening {displayName}, may your night be as rewarding as your day!',
      query: 'vars.hour > 18',
    },
    {
      text: 'Good evening {displayName}, ready to relax under the starlit sky?',
      query: 'vars.hour > 18',
    },
    {
      text: 'Hi {displayName}, ready to unwind and feel the evening breeze?',
      query: 'vars.hour > 18',
    },
    {
      text: 'Good evening {displayName}, let the night bring rest and rejuvenation!',
      query: 'vars.hour > 18',
    },
    {
      text: "Hey {displayName}, let's cherish the moonlit tranquility!",
      query: 'vars.hour > 18',
    },
    {
      text: 'Evening joy, {displayName}! Enjoy the calmness of the night!',
      query: 'vars.hour > 18',
    },
    {
      text: "Good evening {displayName}, let's embrace the night's gentle embrace!",
      query: 'vars.hour > 18',
    },
    {
      text: 'Hey {displayName}, ready to soak in the beauty of the twilight?',
      query: 'vars.hour > 18',
    },
    {
      text: 'Evening calm, {displayName}! May your night be as serene as a quiet sea!',
      query: 'vars.hour > 18',
    },
    {
      text: "Good evening {displayName}, let's bask in the peaceful end of the day!",
      query: 'vars.hour > 18',
    },
    {
      text: 'Hello {displayName}, ready to relax under the velvet sky?',
      query: 'vars.hour > 18',
    },
    {
      text: 'Good evening {displayName}, may your night be filled with sweet dreams!',
      query: 'vars.hour > 18',
    },
    {
      text: "Hey {displayName}, let's appreciate the tranquility of the evening!",
      query: 'vars.hour > 18',
    },
    {
      text: 'Hi {displayName}, ready to enjoy the symphony of the night?',
      query: 'vars.hour > 18',
    },
    {
      text: "Good evening {displayName}, let's watch the stars come to life!",
      query: 'vars.hour > 18',
    },
    {
      text: "Hello {displayName}, let's indulge in the quietude of the evening!",
      query: 'vars.hour > 18',
    },
    {
      text: 'Good evening {displayName}, ready to cozy up with some good vibes?',
      query: 'vars.hour > 18',
    },
    {
      text: "Hey {displayName}, let's enjoy the night's gentle lullaby!",
      query: 'vars.hour > 18',
    },
    {
      text: 'Evening delights, {displayName}! May your night be as delightful as a dream!',
      query: 'vars.hour > 18',
    },
    {
      text: "Good evening {displayName}, let's relax in the moon's soft glow!",
      query: 'vars.hour > 18',
    },
    {
      text: "Hi {displayName}, let's embrace the night's soothing whispers!",
      query: 'vars.hour > 18',
    },
    {
      text: "Hey {displayName}, let's welcome the stars and the cool night air!",
      query: 'vars.hour > 18',
    },
    {
      text: "Hello {displayName}, let's savor the calmness of this beautiful night!",
      query: 'vars.hour > 18',
    },
    {
      text: 'Good evening {displayName}, may the night wrap you in its peaceful arms!',
      query: 'vars.hour > 18',
    },
    {
      text: 'Evening peace, {displayName}! Enjoy the gentle close of the day!',
      query: 'vars.hour > 18',
    },
    {
      text: 'Good evening {displayName}, let the night bring you rest and renewal!',
      query: 'vars.hour > 18',
    },
    {
      text: 'Hey {displayName}, superstar in the house!',
    },
    {
      text: "Hey {displayName}, you're the cat's meow!",
    },
    {
      text: "You're brew-tiful today, {displayName}!",
    },
    {
      text: 'Have an egg-cellent day, {displayName}!',
    },
    {
      text: "You're one in a melon, {displayName}!",
    },
    {
      text: 'Stay pawsome, {displayName}!',
    },
    {
      text: 'Have a wheelie good day, {displayName}!',
    },
    {
      text: "You're grape, {displayName}!",
    },
    {
      text: "Let's ketchup later, {displayName}!",
    },
    {
      text: "You're a-maize-ing, {displayName}!",
    },
    {
      text: 'Owl be seeing you, {displayName}!',
    },
    {
      text: "You're tea-riffic, {displayName}!",
    },
    {
      text: 'Donut worry, be happy, {displayName}!',
    },
    {
      text: "You're soda-lightful, {displayName}!",
    },
    {
      text: "You're spec-tacular, {displayName}!",
    },
    {
      text: 'Stay sharp, {displayName}!',
    },
    {
      text: "You're a real fungi, {displayName}!",
    },
    {
      text: 'Have a purr-fect day, {displayName}!',
    },
    {
      text: "Hey {displayName}, if you were a fruit, you'd be a fine-apple!",
    },
    {
      text: "Hello {displayName}, if you were a dessert, you'd be a cupcake, sweet and delightful!",
    },
    {
      text: "Hello {displayName}, if you were a coffee, you'd be espresso, strong and energizing!",
    },
    {
      text: 'Hello {displayName}. Remember, that you are doing it for them.',
    },
  ];
};
