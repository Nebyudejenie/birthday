/**
 * ─────────────────────────────────────────────────────────────
 *  EBONY'S BIRTHDAY — SINGLE SOURCE OF TRUTH
 * ─────────────────────────────────────────────────────────────
 *  Nebyu: this is the ONE file to personalize. Every word, memory,
 *  reason, prayer and photo on the site is read from here.
 *  Replace the sample text with your own real words — that is what
 *  will make it unforgettable. Look for the  // ✏️  markers.
 * ─────────────────────────────────────────────────────────────
 */

export const site = {
  recipient: "Ebony",
  sender: "Nebyu",
  birthday: "July 21, 2026",
  // Used by the live countdown. ISO, local-ish midnight is fine.
  birthdayISO: "2026-07-21T00:00:00",
  queenLine: "My Beautiful Queen",
  subtitle: "Because love isn't measured in miles, but in moments.",
  // Optional passcode gate. Leave empty ("") to disable the lock screen.
  passcode: "", // ✏️ e.g. "ebony" or a shared inside word

  // Long-distance anchors
  places: {
    her: { city: "Cleveland", region: "Ohio", country: "USA", flag: "🇺🇸" },
    you: { city: "Addis Ababa", region: "", country: "Ethiopia", flag: "🇪🇹" },
  },
} as const;

/** The letter that unfolds from the envelope. ✏️ Make this yours. */
export const loveLetter = {
  greeting: "My beautiful queen,",
  body: [
    "Today the world celebrates the day God blessed it with someone truly special. Your kindness, your strength, your beautiful smile and your loving heart make every ordinary day feel brighter.",
    "An ocean and thousands of miles sit between Addis Ababa and Cleveland, but none of it has ever reached the place where I keep you. Distance is measured on a map — never in the heart.",
    "I pray this new year of your life overflows with peace, joy, healing, favor and endless blessings.",
  ],
  closing: "Happy Birthday. I love you.",
  signature: "Nebyu",
};

/** Chapter 5 — Our Story. Each becomes a card in the timeline. ✏️ */
export const timeline: { year: string; title: string; text: string; emoji: string }[] = [
  {
    year: "The Beginning",
    title: "First Hello",
    text: "Two strangers under the same sky, a whole world apart — and somehow, the first word felt like coming home.",
    emoji: "✨",
  },
  {
    year: "Then",
    title: "The Longest Conversation",
    text: "Hours disappeared like minutes. Different time zones, the very same heartbeat.",
    emoji: "🌙",
  },
  {
    year: "Along the way",
    title: "Laughter",
    text: "The jokes only we understand. The kind of laugh that reaches across continents.",
    emoji: "😊",
  },
  {
    year: "When it was hard",
    title: "We Held On",
    text: "On the heavy days we carried each other. That is when I knew what this really was.",
    emoji: "🕊️",
  },
  {
    year: "Today",
    title: "Your Birthday",
    text: "This little universe, built by hand, just to say: you are deeply, deeply loved.",
    emoji: "❤️",
  },
];

/** Chapter 6 — a sky of reasons. Click a star, read one. ✏️ Add more. */
export const reasons: string[] = [
  "Your heart.",
  "Your kindness.",
  "Your faith.",
  "The way you laugh.",
  "Your patience.",
  "Your strength.",
  "Your beautiful smile.",
  "The way you encourage me.",
  "Your gentle spirit.",
  "Your honesty.",
  "How deeply you care.",
  "Your resilience.",
  "The peace you bring.",
  "Your wisdom.",
  "The way you see the good.",
  "Your prayers.",
  "Your warmth.",
  "How you make ordinary days feel special.",
  "Your courage.",
  "Simply — that you are you.",
];

/** Compliment / "tell me something sweet" generator. ✏️ */
export const compliments: string[] = [
  "You are beautifully and wonderfully made.",
  "God made you with intention and with love.",
  "Your smile could light up the darkest sky.",
  "You inspire me to be better.",
  "You are deeply, endlessly loved.",
  "The world is softer because you're in it.",
  "You are someone's answered prayer.",
  "Your kindness is a quiet kind of miracle.",
];

/** Prayer section. ✏️ */
export const prayer = {
  title: "A Prayer For Your New Year",
  lines: [
    "Heavenly Father,",
    "Thank You for blessing Ebony with another beautiful year of life.",
    "Protect her. Guide her. Give her peace.",
    "Let this year overflow with joy, health, wisdom, favor and love.",
    "Amen.",
  ],
};

/** Rotating scripture. */
export const verses: { ref: string; text: string }[] = [
  {
    ref: "Jeremiah 29:11",
    text: "“For I know the plans I have for you,” declares the Lord, “plans to prosper you and not to harm you, plans to give you hope and a future.”",
  },
  {
    ref: "Numbers 6:24–26",
    text: "“The Lord bless you and keep you; the Lord make His face shine on you and be gracious to you; the Lord turn His face toward you and give you peace.”",
  },
  {
    ref: "Isaiah 41:10",
    text: "“So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you.”",
  },
  {
    ref: "Psalm 91:11",
    text: "“For He will command His angels concerning you to guard you in all your ways.”",
  },
  {
    ref: "Zephaniah 3:17",
    text: "“The Lord your God is with you, the Mighty Warrior who saves. He will take great delight in you.”",
  },
];

/** The lines the golden beam carries across the ocean. */
export const distanceLines: string[] = [
  "Love travels farther than any airplane.",
  "Different time zones. Same heartbeat.",
  "Two skies. One moon.",
  "The map separates us. Love does not.",
  "Our hearts meet where distance ends.",
];

/** Chapter 12 — surprise gift boxes. ✏️ */
export const gifts: { icon: string; label: string; title: string; body: string }[] = [
  {
    icon: "💌",
    label: "A Message",
    title: "Just so you know…",
    body: "You are the best thing to ever cross an ocean and land in my life. Thank you for being you.",
  },
  {
    icon: "🙏",
    label: "A Prayer",
    title: "For you, today",
    body: "May God surround you with peace you can feel and joy you can't explain.",
  },
  {
    icon: "🌹",
    label: "A Memory",
    title: "I still remember…",
    body: "The first time you made me laugh so hard I forgot there was a whole ocean between us.",
  },
  {
    icon: "⭐",
    label: "A Wish",
    title: "This year, I hope…",
    body: "Every door you knock on opens, and every dream you whisper finds its way to you.",
  },
];

/** Final letter — the emotional landing. ✏️ */
export const finale = {
  lines: [
    "No matter how many miles separate us,",
    "my appreciation, my prayers and my care for you",
    "travel farther than any distance.",
    "Thank you for being part of my life.",
    "May this new year bring you peace, joy, strength, hope and abundant blessings.",
  ],
  signOff: "Happy Birthday, Ebony.",
  signature: "With love, Nebyu ❤️",
};

/**
 * Optional background music.
 * Drop an .mp3 into /public/audio and set the filename here.
 * Leave "" to hide the player. (No copyrighted tracks are bundled.)
 */
export const music = {
  src: "", // ✏️ e.g. "/audio/soft-piano.mp3"
  title: "Soft Piano",
};

/**
 * Photos for the gallery. Drop images in /public/photos and list them.
 * Leave empty to show elegant placeholders instead. ✏️
 */
export const photos: { src: string; caption: string }[] = [];
