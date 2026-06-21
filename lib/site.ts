export const siteConfig = {
  name: "DropShadow",
  tagline: "Every second has weight.",
  description:
    "Guide a living drop through deadly maze rooms while the Shadow hunts every hesitation. DropShadow is a survival maze game for iPhone and iPad, coming soon on the App Store.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://dropshadow.it",
  contactEmail: "hello@dropshadow.it",
  fallbackEmail: "thedropmaze@gmail.com",
  privacyVersion: "privacy-2026-06-21",
  privacyUpdatedAt: "June 21, 2026",
  legalController: "Alessandro Nobile",
  legalControllerAddress: "Via delle Sorgenti 24, 23874 Montevecchia (LC), Italy",
  legalControllerCountry: "Italy",
  legalPec: "alessandro-nobile@pec.it",
  legalDpo: "Not appointed",
  socialImage: "/assets/social/dropshadow-og.jpg",
  keywords: [
    "DropShadow",
    "DropShadow game",
    "iOS maze game",
    "iPhone maze game",
    "iPad maze game",
    "survival maze game",
    "daily run game",
    "mobile arcade puzzle game",
    "App Store survival game"
  ],
  consentVersion: "website-launch-2026-06-18",
  consentText:
    "I agree to receive DropShadow launch updates and major game news by email, and I confirm that I have read the Privacy Policy."
};

export const navItems = [
  { label: "DropShadow", href: "/" },
  { label: "The Chase", href: "/#chase" },
  { label: "DropLab", href: "/#droplab" },
  { label: "Daily Run", href: "/#daily" }
];

export const media = {
  appIcon: "/assets/app-icon.svg",
  roomMap: "/assets/labyrinth/room-021-map.svg",
  roomSheet: "/assets/labyrinth/room-021-contact-sheet.svg",
  posters: {
    abilities: "/assets/posters/abilities.jpg",
    feed: "/assets/posters/feed-the-drop.jpg",
    mass: "/assets/posters/mass-is-speed.jpg",
    wind: "/assets/posters/ride-the-wind.jpg",
    switch: "/assets/posters/rotating-switch.jpg",
    slow: "/assets/posters/slow-zones.jpg",
    compass: "/assets/posters/the-compass.jpg"
  },
  videos: {
    trailer: "/assets/videos/campaign/dropshadow-trailer-01.mp4",
    smoothRun: "/assets/videos/campaign/full-sequence-smooth-run.mp4",
    dailyChallenge: "/assets/videos/campaign/full-sequence-daily-challenge.mp4",
    finalSequence: "/assets/videos/campaign/full-sequence-final-sequence.mp4",
    compass: "/assets/videos/campaign/thecompass.mp4",
    mass: "/assets/videos/campaign/mass.mp4",
    dash: "/assets/videos/campaign/ability-dash.mp4",
    massGenerator: "/assets/videos/campaign/ability-mass-generator.mp4",
    phase: "/assets/videos/campaign/ability-phase.mp4",
    shield: "/assets/videos/campaign/ability-shield.mp4",
    shield02: "/assets/videos/campaign/ability-shield-02.mp4",
    wallErase: "/assets/videos/campaign/ability-wall-erase.mp4",
    shadow: "/assets/videos/campaign/shadow.mp4",
    shadow2: "/assets/videos/campaign/shadow-2.mp4",
    shadow3: "/assets/videos/campaign/shadow-3.mp4",
    shadow4: "/assets/videos/campaign/shadow-4.mp4",
    buttonGate: "/assets/videos/campaign/obstacle-button-gate.mp4",
    buttonGate02: "/assets/videos/campaign/obstacle-button-gate-02.mp4",
    crumblingTile: "/assets/videos/campaign/obstacle-crumbling-tile.mp4",
    pistons: "/assets/videos/campaign/obstacle-pistons-sequence.mp4",
    pressWall: "/assets/videos/campaign/obstacle-press-wall.mp4",
    pressWall02: "/assets/videos/campaign/obstacle-press-wall-02.mp4",
    pulseHazard: "/assets/videos/campaign/obstacle-pulse-hazard.mp4",
    rotatingGate: "/assets/videos/campaign/obstacle-rotating-gate.mp4",
    teleport: "/assets/videos/campaign/obstacle-teletrasporto.mp4"
  },
  screenshots: {
    iphone01: "/assets/screenshots/iphone/DropShadow_Iphone_01.png",
    iphone02: "/assets/screenshots/iphone/DropShadow_Iphone_02.png",
    iphone03: "/assets/screenshots/iphone/DropShadow_Iphone_03.png",
    iphone04: "/assets/screenshots/iphone/DropShadow_Iphone_04.png",
    iphone05: "/assets/screenshots/iphone/DropShadow_Iphone_05.png",
    iphone06: "/assets/screenshots/iphone/DropShadow_Iphone_06.png",
    ipad01: "/assets/screenshots/ipad/DropShadow_Ipad_01.png",
    ipad02: "/assets/screenshots/ipad/DropShadow_Ipad_02.png"
  }
};

export function posterForVideo(src: string) {
  const filename = src.split("/").pop()?.replace(/\.mp4$/i, ".jpg");
  return filename ? `/assets/posters/videos/${filename}` : media.posters.mass;
}

export const abilities = [
  {
    name: "Dash",
    copy: "For the moment when waiting is already a mistake.",
    video: media.videos.dash,
    poster: media.posters.wind
  },
  {
    name: "Shield",
    copy: "For the hit you saw coming and took anyway.",
    video: media.videos.shield,
    poster: media.posters.slow
  },
  {
    name: "Phase",
    copy: "For the obstacle that should have ended the run.",
    video: media.videos.phase,
    poster: media.posters.compass
  },
  {
    name: "Wall Erase",
    copy: "For players who prefer making exits to finding them.",
    video: media.videos.wallErase,
    poster: media.posters.switch
  },
  {
    name: "Mass Generator",
    copy: "For one more second when one second is everything.",
    video: media.videos.massGenerator,
    poster: media.posters.feed
  }
];

export const shadowClips = [
  { label: "Close pursuit", src: media.videos.shadow },
  { label: "Long pressure", src: media.videos.shadow2 },
  { label: "Late escape", src: media.videos.shadow3 },
  { label: "Corner chase", src: media.videos.shadow4 }
];

export const obstacleClips = [
  { label: "Rotating Gate", cue: "WAIT", src: media.videos.rotatingGate },
  { label: "Gate", cue: "PRESS", src: media.videos.buttonGate02 },
  { label: "Pistons", cue: "TIME", src: media.videos.pistons },
  { label: "Press Wall", cue: "RUN", src: media.videos.pressWall02 },
  { label: "Pulse Hazard", cue: "SLIP", src: media.videos.pulseHazard },
  { label: "Teleport", cue: "JUMP", src: media.videos.teleport },
  { label: "Crumbling Tile", cue: "DON'T STOP", src: media.videos.crumblingTile }
];

export const abilityClips = [
  { label: "Dash", cue: "Move", src: media.videos.dash },
  { label: "Shield", cue: "Hold", src: media.videos.shield02 },
  { label: "Phase", cue: "Vanish", src: media.videos.phase },
  { label: "Wall Erase", cue: "Make exits", src: media.videos.wallErase },
  { label: "Mass Generator", cue: "One second", src: media.videos.massGenerator }
];

export const campaignVideoLibrary = [
  {
    slug: "trailer",
    name: "DropShadow gameplay trailer",
    description: "A first look at DropShadow's maze chase, mass recovery, obstacles, and the Shadow.",
    src: media.videos.trailer,
    duration: "PT39S"
  },
  {
    slug: "smooth-run",
    name: "Smooth run gameplay",
    description: "A clean DropShadow run through maze rooms built around movement, timing, and pressure.",
    src: media.videos.smoothRun,
    duration: "PT19S"
  },
  {
    slug: "daily-challenge",
    name: "Daily Challenge gameplay",
    description: "A Daily Run preview where every player faces the same room and the same pressure.",
    src: media.videos.dailyChallenge,
    duration: "PT23S"
  },
  {
    slug: "final-sequence",
    name: "Final Sequence gameplay",
    description: "The last stretch of a DropShadow run as the maze tightens and the exit gets close.",
    src: media.videos.finalSequence,
    duration: "PT10S"
  },
  {
    slug: "compass",
    name: "Compass reveal gameplay",
    description: "The compass reveals the maze, points toward the exit, and returns the player to the chase.",
    src: media.videos.compass,
    duration: "PT10S"
  },
  {
    slug: "mass-system",
    name: "Mass system gameplay",
    description: "DropShadow's mass mechanic: every move costs mass, while risky play can recover it.",
    src: media.videos.mass,
    duration: "PT5S"
  },
  {
    slug: "ability-dash",
    name: "Dash ability gameplay",
    description: "Dash through danger when waiting is already a mistake.",
    src: media.videos.dash,
    duration: "PT4S"
  },
  {
    slug: "ability-shield",
    name: "Shield ability gameplay",
    description: "Use Shield to survive a hit and keep the run alive.",
    src: media.videos.shield02,
    duration: "PT6S"
  },
  {
    slug: "ability-phase",
    name: "Phase ability gameplay",
    description: "Phase past a trap that should have ended the run.",
    src: media.videos.phase,
    duration: "PT3S"
  },
  {
    slug: "ability-wall-erase",
    name: "Wall Erase ability gameplay",
    description: "Erase a wall and create a new exit through the maze.",
    src: media.videos.wallErase,
    duration: "PT8S"
  },
  {
    slug: "ability-mass-generator",
    name: "Mass Generator ability gameplay",
    description: "Generate enough mass for one more second under pressure.",
    src: media.videos.massGenerator,
    duration: "PT8S"
  },
  {
    slug: "obstacle-rotating-gate",
    name: "Rotating Gate obstacle gameplay",
    description: "Time movement through a rotating gate without losing momentum.",
    src: media.videos.rotatingGate,
    duration: "PT2S"
  },
  {
    slug: "obstacle-gate",
    name: "Gate obstacle gameplay",
    description: "Press through a gate room built around speed and timing.",
    src: media.videos.buttonGate02,
    duration: "PT6S"
  },
  {
    slug: "obstacle-pistons",
    name: "Pistons obstacle gameplay",
    description: "Read the rhythm of pistons and move before the path closes.",
    src: media.videos.pistons,
    duration: "PT3S"
  },
  {
    slug: "obstacle-press-wall",
    name: "Press Wall obstacle gameplay",
    description: "Escape a press wall before the room removes the space you needed.",
    src: media.videos.pressWall02,
    duration: "PT4S"
  },
  {
    slug: "obstacle-pulse-hazard",
    name: "Pulse Hazard obstacle gameplay",
    description: "Slip through a pulse hazard by reading timing and distance.",
    src: media.videos.pulseHazard,
    duration: "PT2S"
  },
  {
    slug: "obstacle-teleport",
    name: "Teleport obstacle gameplay",
    description: "Use teleport timing to cross the maze under pressure.",
    src: media.videos.teleport,
    duration: "PT9S"
  },
  {
    slug: "obstacle-crumbling-tile",
    name: "Crumbling Tile obstacle gameplay",
    description: "Keep moving over crumbling tiles before the path disappears.",
    src: media.videos.crumblingTile,
    duration: "PT2S"
  },
  {
    slug: "shadow-pressure",
    name: "The Shadow chase gameplay",
    description: "The Shadow follows hesitation through the maze and turns delay into danger.",
    src: media.videos.shadow2,
    duration: "PT12S"
  }
];

export const roomCards = [
  { word: "Timing", title: "Rotating Gate", asset: "/assets/labyrinth/rotating-gate.svg" },
  { word: "Recovery", title: "Mass Orb", asset: "/assets/labyrinth/mass-orb.svg" },
  { word: "Breathe", title: "Safe Room", asset: "/assets/labyrinth/safe-chamber.svg" },
  { word: "Pressure", title: "Slow Zones", asset: media.posters.slow },
  { word: "Flow", title: "Ride the Wind", asset: media.posters.wind },
  { word: "Risk", title: "Read the Map", asset: media.roomMap }
];

export const socialSources = [
  "homepage",
  "notify_page",
  "tiktok",
  "instagram",
  "youtube",
  "reddit",
  "apple_candidate"
];
