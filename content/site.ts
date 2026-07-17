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
  greeting: "My Beautiful Queen,",
  body: [
    "Today isn't just another date on the calendar.",
    "Today is the day the world was blessed with someone truly extraordinary.",
    "A woman whose kindness comforts others, whose strength inspires, whose smile brightens even the darkest days, and whose heart carries warmth wherever she goes.",
    "I'm incredibly grateful that our paths crossed, because knowing you has been one of the most meaningful gifts life has given me.",
    "Although an ocean and thousands of miles separate Addis Ababa and Cleveland, I have never believed that distance has the power to diminish what is genuine. Maps can measure miles, clocks can measure time, but neither can measure appreciation, prayers, or the place someone holds in another person's heart.",
    "Whenever I look at the night sky, I smile knowing that the same moon shines over both of us. Different countries. Different time zones. The same sky above us.",
    "On your birthday, my greatest wish is that this new chapter of your life is filled with God's peace, overflowing joy, renewed strength, good health, wisdom for every decision, and countless moments that remind you just how valuable you are.",
    "May every dream placed in your heart grow closer to becoming reality. May every challenge become a testimony of your resilience. May every step you take be guided with grace, favor, and purpose.",
    "Thank you for being exactly who you are.",
    "Thank you for every conversation, every laugh, every encouraging word, and every moment we've shared.",
    "You have brought light into my life in ways you may never fully realize, and for that, I will always be grateful.",
    "So today, smile a little bigger. Laugh a little louder. Celebrate the incredible woman you are.",
    "Because today isn't only your birthday — today, we celebrate you.",
  ],
  closing: "Happy Birthday, Ebony. May this year become your most beautiful chapter yet.",
  signoff: "With all my prayers, admiration, and warmest wishes,",
  signature: "Nebyu ❤️",
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
 * The single background song — the emotional soundtrack of the whole
 * experience (~35 min). Drop the file at:  public/song/Happy_Birthday_My_Love_song.mp3
 * It starts only after "Begin Experience", fades in, and remembers its position.
 */
export const soundtrack = {
  // Served straight from the GitHub repo (sends CORS + range headers so it
  // streams and feeds the Web-Audio analyser). jsDelivr can't be used here —
  // it rejects files over 20 MB and this song is ~25 MB. To self-host instead,
  // drop the file at public/song/… and set src to "/song/Happy_Birthday_My_Love_song.mp3".
  src: "https://raw.githubusercontent.com/Nebyudejenie/birthday/main/song/Happy_Birthday_My_Love_song.mp3",
  title: "Happy Birthday, My Love",
  targetVolume: 0.35, // fade to 35%
  fadeSeconds: 5, // 0% → 35% over 5s
  /**
   * Song-time chapters (in seconds) that guide the emotional pacing.
   * The player surfaces the current chapter + mood as the song plays.
   */
  chapters: [
    { at: 0, label: "Opening Universe", mood: "Wonder", anchor: "hero" },
    { at: 180, label: "Her Celebration", mood: "Admiration", anchor: "hero" },
    { at: 480, label: "Our Story", mood: "Nostalgia", anchor: "story" },
    { at: 900, label: "Love Letter", mood: "Emotional", anchor: "letter" },
    { at: 1200, label: "Faith & Blessings", mood: "Peace", anchor: "prayer" },
    { at: 1500, label: "Birthday Celebration", mood: "Joy", anchor: "cake" },
    { at: 1800, label: "Final Chapter", mood: "Hope & Love", anchor: "finale" },
  ] as { at: number; label: string; mood: string; anchor: string }[],
};

/**
 * ── HER ENTRANCE ──
 * The one portrait that anchors the whole experience.
 * Drop the file at:  public/photos/ebony-portrait.jpg
 * If the file isn't there yet, the section quietly hides itself — nothing breaks.
 */
export const portrait = {
  src: "/photos/ebony-portrait.jpg", // ✏️ set to "" to hide the section entirely
  /** Alt text matters — this is how the moment reads to a screen reader. */
  alt: "Ebony smiling radiantly, her copper locs catching a warm rim of light against a terracotta backdrop.",
  /**
   * Focal point for the crop. Her face sits in the upper third, so we bias
   * upward — this keeps her smile centred and never crops it awkwardly.
   */
  objectPosition: "50% 30%",
  script: "and then, her",
  title: "Her Entrance",
  caption: "The day the world got a little brighter.",
};

/**
 * Photos for the gallery. Drop images in /public/photos and list them.
 * Leave empty to show elegant placeholders instead. ✏️
 */
export const photos: { src: string; caption: string }[] = [];
