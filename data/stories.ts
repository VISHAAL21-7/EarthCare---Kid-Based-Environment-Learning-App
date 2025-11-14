import { Story } from '../types';

export const stories: Story[] = [
  // Story 1: Protecting Forests
  {
    title: "Sammy the Squirrel's Snack Attack",
    character: "🐿️",
    pages: [
      { image: "🌳", text: "In a big, beautiful forest lived a squirrel named Sammy. He loved acorns, but today he found something new..." },
      { image: "🍫", text: "A hiker left a shiny wrapper! 'Ooh, a crinkly treasure!' he chattered. But nearby, other pieces of litter dotted the forest floor." },
      {
        image: "🧹",
        text: "The forest floor is our home, and it's looking a bit messy. Can you help Sammy clean it up?",
        interaction: {
          type: 'tap-collect',
          prompt: "Tap all the litter to clean the forest!",
          data: {
            targets: [
              { id: 1, emoji: "🥤", x: 20, y: 50 },
              { id: 2, emoji: "🍫", x: 70, y: 60 },
              { id: 3, emoji: "🛍️", x: 45, y: 75 },
            ]
          }
        }
      },
      { image: "🦉", text: "Wise old Owl hooted, 'Well done, little one! A clean home is a happy home for everyone, from the tiniest beetle to the biggest bear.'" },
      { image: "✨", text: "Sammy felt proud! He learned that keeping the forest clean helps all his friends. Moral: A clean home is a happy home." }
    ]
  },
  // Story 2: Cleaning Rivers
  {
    title: "Lily the Otter's Sparkling Stream",
    character: "🦦",
    pages: [
        { image: "🏞️", text: "Lily the otter loved to slide down the muddy banks of her river. But one morning, the water looked gloomy and full of trash." },
        { image: "😢", text: "More and more trash floated by! 'This is too much for one otter!' she cried. Can you help Lily sort the trash before it flows away?" },
        {
            image: "🌊",
            text: "Help Lily sort the trash!",
            interaction: {
                type: 'catch-and-sort',
                prompt: 'Drag the floating trash into the correct bins!',
                data: {
                    catchAndSort: {
                        itemsToSpawn: [
                            { emoji: '🍾', correctZoneId: 1 },
                            { emoji: '🛍️', correctZoneId: 1 },
                            { emoji: '🥤', correctZoneId: 1 },
                            { emoji: '🍎', correctZoneId: 2 },
                            { emoji: '🌿', correctZoneId: 2 },
                        ],
                        zones: [
                            { id: 1, emoji: '♻️', x: 10, y: 80, width: 35, height: 18, name: 'Recycling' },
                            { id: 2, emoji: '🌱', x: 55, y: 80, width: 35, height: 18, name: 'Compost' },
                        ],
                        totalToCatch: 6,
                    }
                }
            }
        },
        { image: "🤝", text: "Wow! With your help, the river is clean again. Ferdinand the Frog cheered, 'You're a river hero!'" },
        { image: "💙", text: "The river sparkled brightly. Lily did a happy flip in the water. Moral: Teamwork can solve even big problems." }
    ]
  },
   // Story 3: Helping Lost Animals
  {
    title: "Pip the Sparrow and the Lost Ladybug",
    character: "🐦",
    pages: [
        { image: "🐞", text: "A tiny ladybug named Lucy woke up on a big green leaf, far from her family. 'Oh dear, I'm lost!' she whispered, her voice trembling." },
        { image: "🐦", text: "Pip the sparrow was practicing his loop-de-loops when he saw the sad little ladybug. He flew down. 'What's wrong, little friend?'" },
        {
            image: "👀",
            text: "Pip soared into the air to get a bird's-eye view of the garden below. It was a sea of colors! Can you help him spot Lucy's family?",
            interaction: {
                type: 'tap-collect',
                prompt: 'Find the patch of red roses!',
                data: {
                    targets: [
                        { id: 1, emoji: '🌹', x: 65, y: 70, isCorrect: true },
                        { id: 2, emoji: '🌻', x: 20, y: 55 },
                        { id: 3, emoji: '🌷', x: 70, y: 20 },
                        { id: 4, emoji: '🌸', x: 15, y: 25 },
                        { id: 5, emoji: '🌼', x: 40, y: 45 },
                    ]
                }
            }
        },
        { image: "🌹", text: "From the sky, Pip spotted a big, beautiful patch of red roses! He swooped down and guided Lucy all the way there." },
        { image: "🥰", text: "Lucy's family cheered! Pip learned that using your unique talents to help others is a wonderful feeling. Moral: A little kindness can make a very big difference." }
    ]
  },
  // Story 4: Discovering Recycling Secrets
  {
    title: "The Tin Can Trio's New Job",
    character: "🥫",
    pages: [
        { image: "🗑️", text: "Three empty tin cans sat in a recycling bin. 'Our job is over,' sighed one. 'We held yummy beans, but now what?'" },
        { image: "🚚", text: "Suddenly, a big truck whisked them away on an adventure to a magical place called the 'Recycling Center'!" },
        {
            image: "✨",
            text: "A friendly machine needs your help to sort everything! Drag each item to the correct bin.",
            interaction: {
                type: 'sort',
                prompt: 'Drag the items to the right bins!',
                data: {
                    sortables: {
                        items: [
                            { id: 1, emoji: '🥫', correctZoneId: 1, startX: 20, startY: 20 },
                            { id: 2, emoji: '🍎', correctZoneId: 2, startX: 45, startY: 25 },
                            { id: 3, emoji: '📰', correctZoneId: 3, startX: 70, startY: 20 },
                        ],
                        zones: [
                            { id: 1, name: "Recycle", emoji: '♻️', x: 5, y: 70, width: 25, height: 25 },
                            { id: 2, name: "Compost", emoji: '🌿', x: 37, y: 70, width: 25, height: 25 },
                            { id: 3, name: "Paper", emoji: '📄', x: 70, y: 70, width: 25, height: 25 },
                        ]
                    }
                }
            }
        },
        { image: "🚲", text: "The cans were melted down and reformed into a shiny new bicycle for a child to ride! They weren't trash; they were treasure!" },
        { image: "♻️", text: "They had a new, exciting job. Moral: Old things can have amazing new beginnings when we recycle." }
    ]
  },
  // Story 5: A Butterfly's Journey
  {
    title: "Flutter's Big Adventure",
    character: "🦋",
    pages: [
        { image: "🐛", text: "Flutter began as a tiny caterpillar, dreaming of flying. After a long nap in a cozy chrysalis, she woke up with beautiful wings!" },
        { image: "🦋", text: "On her first flight, she felt a very important job stirring inside her. She needed to help the flowers." },
        {
            image: "🌸",
            text: "Flutter learned she could help flowers create seeds by sharing pollen. This is called pollination!",
            interaction: {
                type: 'tap-collect',
                prompt: 'Tap the flowers to help Flutter pollinate them!',
                data: {
                    targets: [
                        { id: 1, emoji: '🌸', x: 15, y: 50 },
                        { id: 2, emoji: '🌷', x: 45, y: 65 },
                        { id: 3, emoji: '🌻', x: 75, y: 55 },
                    ]
                }
            }
        },
        { image: "🗺️", text: "As she visited each flower, a little bit of magic sparkle was left behind. The whole garden looked brighter because of her work!" },
        { image: "❤️", text: "She learned that even a small creature can play a big part in helping the world grow. Moral: Every journey, big or small, has a purpose." }
    ]
  },
    // Story 6: Helping a Sick Plant
  {
    title: "Rosie the Rose's Droopy Day",
    character: "🌹",
    pages: [
        { image: "🥀", text: "Rosie the rose bush felt tired and droopy. The sun was very hot, and her leaves were so thirsty." },
        { image: "☀️", text: "A little girl named Maya saw how sad Rosie looked. 'You need a drink!' she said kindly." },
        {
            image: "💧",
            text: "Maya found her little blue watering can. It was time to give Rosie the water she desperately needed.",
            interaction: {
                type: 'drag-drop',
                prompt: 'Drag the watering can to Rosie!',
                data: {
                    draggable: { id: 1, emoji: '💧', startX: 10, startY: 60 },
                    dropZone: { id: 1, emoji: '🥀', x: 60, y: 50, width: 30, height: 40 }
                }
            }
        },
        { image: "😊", text: "As the cool water soaked her roots, Rosie's leaves perked up and her petals felt strong again. She looked brighter than ever!" },
        { image: "🌱", text: "Maya learned that plants are living things that need care, just like us. Moral: A little care can bring something beautiful back to life." }
    ]
  },
  // Story 7: Night Sky Pollution
  {
    title: "Twinkle the Star Wants to Shine",
    character: "⭐",
    pages: [
        { image: "🌃", text: "High in the sky lived a little star named Twinkle. She loved to sparkle for the world below." },
        { image: "🏙️", text: "But the city below was so bright with unneeded lights that it was hard for anyone to see her. This is called light pollution." },
        {
            image: "💡",
            text: "The stars need the dark to be seen. Can you help turn off the lights that nobody is using?",
            interaction: {
                type: 'tap-collect',
                prompt: "Tap the bright lights to dim them!",
                data: {
                    targets: [
                        { id: 1, emoji: '💡', x: 20, y: 70 },
                        { id: 2, emoji: '💡', x: 50, y: 80 },
                        { id: 3, emoji: '💡', x: 80, y: 75 },
                    ]
                }
            }
        },
        { image: "🏕️", text: "With some of the city lights dimmed, the sky grew darker. A family camping nearby looked up and gasped. 'Look at all the stars!'" },
        { image: "✨", text: "Twinkle sparkled with joy! She learned that darkness is important, too. Moral: Sometimes, we need to turn off our lights to see true beauty." }
    ]
  },
  // Story 8: An Eco-Friendly Village
  {
    title: "A Visit to Sunny Meadow",
    character: "🏡",
    pages: [
        { image: "🗺️", text: "Leo visited a special place called Sunny Meadow Village. Instead of cars, people rode bikes, and old boots were used as flowerpots!" },
        { image: "🥕", text: "They grew food in a shared garden and traded old toys instead of buying new ones. 'We believe in using things wisely,' a villager explained." },
        {
            image: "♻️",
            text: "A villager smiled. 'Our secret is that everything has a special place!' Can you help Leo sort these items the Sunny Meadow way?",
            interaction: {
                type: 'sort',
                prompt: 'Drag the items to the right bins!',
                data: {
                    sortables: {
                        items: [
                            { id: 1, emoji: '☀️', correctZoneId: 1, startX: 20, startY: 20 },
                            { id: 2, emoji: '🥕', correctZoneId: 2, startX: 45, startY: 25 },
                            { id: 3, emoji: '👢', correctZoneId: 3, startX: 70, startY: 20 },
                        ],
                        zones: [
                            { id: 1, name: 'Energy', emoji: '⚡', x: 5, y: 70, width: 25, height: 25 },
                            { id: 2, name: 'Garden', emoji: '🌱', x: 37, y: 70, width: 25, height: 25 },
                            { id: 3, name: 'Reuse', emoji: '🎨', x: 70, y: 70, width: 25, height: 25 },
                        ]
                    }
                }
            }
        },
        { image: "♻️", text: "Leo saw a clever water wheel powering lights and a market where kids traded toys. 'Our secret is helping each other and the Earth,' they said." },
        { image: "💡", text: "Leo went home full of ideas, realizing that being eco-friendly is about being creative and kind. Moral: We can build a better world by being smart and sharing." }
    ]
  },
  // Story 9: Meeting Wind and Rain
  {
    title: "The Sky's Helpful Children",
    character: "🌬️",
    pages: [
        { image: "🍃", text: "A little seed needed to fly from its mother tree to find a place to grow. 'I wish I could see the world!' it sighed." },
        { image: "🌬️", text: "A gentle voice whispered, 'I can help!' It was Gale, the wind spirit. With a soft puff, she lifted the seed into the air." },
        {
            image: "🌱",
            text: "Now the seed is flying! It needs to find a nice, sunny patch of soil to land in so it can grow big and strong.",
            interaction: {
                type: 'drag-drop',
                prompt: 'Help the wind guide the seed to the sunny spot!',
                data: {
                    draggable: { id: 1, emoji: '🍃', startX: 10, startY: 20 },
                    dropZone: { id: 1, emoji: '☀️', x: 65, y: 70, width: 25, height: 20 }
                }
            }
        },
        { image: "💧", text: "The seed landed safely. 'Now I'm thirsty,' it worried. Just then, Drizzle, the rain spirit, arrived to give it a gentle drink." },
        { image: "🌍", text: "The seed learned that nature's helpers work together to make the world grow. Moral: The wind and rain are our friends, helping life thrive." }
    ]
  },
  // Story 10: Earth Needs Rest Days
  {
    title: "Mother Earth's Quiet Day",
    character: "🌍",
    pages: [
        { image: "😴", text: "Mother Earth felt tired. The world was always so busy and noisy. 'I need a little rest,' she yawned to the clouds." },
        { image: "🤫", text: "A child named Chloe noticed how peaceful it was. The birds were singing softly, and the air felt calm. But some things were still making noise." },
        {
            image: "🎧",
            text: "Even the Earth needs peace and quiet to feel healthy. Can you help make the world a little quieter for her?",
            interaction: {
                type: 'tap-collect',
                prompt: 'Tap the noisy things to make them quiet.',
                data: {
                    targets: [
                        { id: 1, emoji: '📢', x: 15, y: 60 },
                        { id: 2, emoji: '🥁', x: 75, y: 65 },
                        { id: 3, emoji: '💥', x: 45, y: 75 },
                    ]
                }
            }
        },
        { image: "✨", text: "As the world grew quiet, Mother Earth took a deep, refreshing breath. The quiet day helped her recharge her magic." },
        { image: "💖", text: "Chloe learned that everyone, even the whole planet, needs a rest day. Moral: Quiet moments help us and our world heal and feel strong." }
    ]
  }
];