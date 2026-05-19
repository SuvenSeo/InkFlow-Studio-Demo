export const stories = [
  {
    id: "sable-crown",
    title: "The Sable Crown",
    genre: "Fantasy",
    tags: ["royalty", "betrayal", "slow burn"],
    author: "Mira Vale",
    verified: true,
    reads: "3.8M",
    rating: 4.8,
    trend: 98,
    progress: 68,
    premium: true,
    earlyAccess: true,
    chapters: 42,
    minutes: 18,
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    blurb:
      "A fugitive princess trades court politics for a rebel mapmaker and discovers the crown is not the kingdom's greatest weapon.",
  },
  {
    id: "orbit-seven",
    title: "Orbit Seven",
    genre: "Sci-Fi",
    tags: ["space", "found family", "mystery"],
    author: "Noah Rens",
    verified: false,
    reads: "980K",
    rating: 4.6,
    trend: 89,
    progress: 22,
    premium: false,
    earlyAccess: false,
    chapters: 31,
    minutes: 12,
    image:
      "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?auto=format&fit=crop&w=900&q=80",
    blurb:
      "Seven students wake on a silent orbital academy with one rule written across every wall: do not answer Earth.",
  },
  {
    id: "cafe-after-midnight",
    title: "Cafe After Midnight",
    genre: "Romance",
    tags: ["second chance", "music", "city nights"],
    author: "Elara Jun",
    verified: true,
    reads: "5.1M",
    rating: 4.9,
    trend: 95,
    progress: 84,
    premium: true,
    earlyAccess: false,
    chapters: 56,
    minutes: 9,
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
    blurb:
      "A late-night pianist and a bakery owner rebuild trust one song, one chapter, and one apology at a time.",
  },
  {
    id: "paper-alibis",
    title: "Paper Alibis",
    genre: "Mystery",
    tags: ["detective", "campus", "twists"],
    author: "Anika Stone",
    verified: false,
    reads: "612K",
    rating: 4.4,
    trend: 74,
    progress: 0,
    premium: false,
    earlyAccess: false,
    chapters: 19,
    minutes: 15,
    image:
      "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=900&q=80",
    blurb:
      "A journalism student finds a confession letter for a murder that has not happened yet.",
  },
];

export const chapters = [
  {
    title: "Chapter 18: The Lantern Bridge",
    words: 2840,
    locked: false,
    body: [
      "The bridge appeared only after the rain stopped, each lantern catching in the mist like a quiet verdict. Ari kept her hood low and counted the guards twice. Four at the western steps, two above the arch, one pretending to repair a chain he had already repaired before dusk.",
      "Cassian touched the brass compass at his throat. The needle pointed toward the palace, then away from it, then spun in a way no honest compass should. He smiled without humor. The old roads still know your name.",
      "Ari wanted to tell him that names were the least dangerous thing the court had stolen from her. Instead she stepped onto the first plank and felt the whole bridge listen.",
      "Halfway across, a blue flare rose over the palace roofs. The search had widened. The city below answered with shutters closing, market fires dying, and the hush of people deciding whether a princess was worth sheltering.",
      "At the far end, a child in an oversized guard coat held out a folded page. Your mother said you would come this way, the child whispered. She said to run only after reading the last line.",
    ],
  },
  {
    title: "Chapter 19: Salt Letters",
    words: 3175,
    locked: true,
    body: [
      "The sea wrote warnings in foam, and every warning carried the same royal seal.",
      "Ari broke the wax with a kitchen knife because the rebels had no ceremonial blades, only useful ones.",
    ],
  },
];

export const comments = [
  {
    id: 1,
    name: "Ishara",
    text: "The bridge scene feels cinematic. Ari noticing the repaired chain was such a sharp detail.",
    reactions: { heart: 42, laugh: 3, fire: 11 },
    replies: [
      {
        id: 11,
        name: "Mira Vale",
        author: true,
        text: "That chain comes back later.",
      },
    ],
  },
  {
    id: 2,
    name: "Jayden",
    text: "Cassian's compass is suspicious and I am choosing to trust him anyway.",
    reactions: { heart: 28, laugh: 18, fire: 7 },
    replies: [],
  },
];

export const badges = [
  { label: "14-day streak", type: "Reader", value: "Active" },
  { label: "100 chapters", type: "Reader", value: "Milestone" },
  { label: "Rising author", type: "Writer", value: "Creator" },
  { label: "Verified voice", type: "Author", value: "Approved" },
];

export const notifications = [
  { title: "Chapter release alert", group: "Followers", status: "Queued", reach: "214K" },
  { title: "Premium weekend offer", group: "All users", status: "Delivered", reach: "1.8M" },
  { title: "LK romance readers", group: "Sri Lanka", status: "Draft", reach: "72K" },
];

export const moderationItems = [
  { name: "Mira Vale", type: "Verification", status: "Approved", risk: "Low" },
  { name: "Chapter 12 report", type: "Story moderation", status: "Reviewing", risk: "Medium" },
  { name: "Ad campaign: May Reads", type: "Ad management", status: "Live", risk: "Low" },
  { name: "Noah Rens", type: "Verification", status: "Pending", risk: "Low" },
];
