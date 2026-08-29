import type { CategoryName, ChatThread, Product } from "./types";

export const MOCK_CATEGORIES: CategoryName[] = [
  "All",
  "⚡ Electronics",
  "👗 Fashion",
  "📚 Books",
  "🔄 Barter/Swap",
  "🌱 Eco-Deals",
];

export const MOCK_LOCATIONS = [
  "Downtown Yangon • 1.5 km",
  "Hlaing • 2.4 km",
  "Kamayut • 3.1 km",
  "Bahan • 4.8 km",
  "Mandalay Chanayethazan • 2.0 km",
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    title: "MacBook Air M1 13\" (2020)",
    price: 520,
    originalPrice: 999,
    marketAverage: 590,
    category: "⚡ Electronics",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
    distance: "1.2 km away",
    location: "Downtown",
    aiConditionScore: 92,
    aiConditionLabel: "Like New",
    co2SavedKg: 4.5,
    eWastePreventedKg: 3.2,
    defects: [
      { x: 72, y: 38, label: "Minor surface scratch on lid corner", severity: "minor" },
      { x: 28, y: 62, label: "Faint keyboard shine on WASD keys", severity: "minor" },
    ],
    seller: {
      name: "Maya Chen",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
      trustScore: 98,
      verified: true,
      responseRate: "< 15 mins",
    },
    aiVerified: true,
    barterAvailable: true,
    description:
      "Gently used M1 MacBook Air with 8GB RAM and 256GB SSD. Battery health 92%. Original charger included. Perfect for students and remote work.",
    descriptionMy:
      "သုံးထားသော M1 MacBook Air (RAM ၈ GB၊ SSD ၂၅၆ GB)။ ဘက်ထရီကျန်းမာရေး ၉၂%။ မူရင်းအားသွင်းကိရိယာ ပါဝင်သည်။",
  },
  {
    id: "p2",
    title: "Vintage Brown Leather Jacket",
    price: 68,
    originalPrice: 180,
    marketAverage: 75,
    category: "👗 Fashion",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=80",
    distance: "0.8 km away",
    location: "Riverside",
    aiConditionScore: 86,
    aiConditionLabel: "Good",
    co2SavedKg: 12.4,
    eWastePreventedKg: 0.6,
    defects: [
      { x: 40, y: 55, label: "Light crease on left elbow", severity: "minor" },
    ],
    seller: {
      name: "Jordan Blake",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      trustScore: 94,
      verified: true,
      responseRate: "< 30 mins",
    },
    aiVerified: true,
    barterAvailable: false,
    description:
      "Classic 90s-cut genuine leather jacket, size M. Warm lining, brass zippers, and a lived-in patina that photographs beautifully.",
    descriptionMy:
      "၉၀ ခုနှစ်များပုံစံ စစ်မှန်သောသားရေဂျာကင် (အရွယ် M)။ အတွင်းခံနွေးထွေးပြီး ဇစ်များ ကောင်းမွန်သည်။",
  },
  {
    id: "p3",
    title: "Hardcover Book Bundle (12 titles)",
    price: 24,
    originalPrice: 160,
    marketAverage: 28,
    category: "📚 Books",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80",
    distance: "2.1 km away",
    location: "University Quarter",
    aiConditionScore: 88,
    aiConditionLabel: "Very Good",
    co2SavedKg: 6.8,
    eWastePreventedKg: 1.1,
    defects: [
      { x: 50, y: 30, label: "Softened spine on two paperbacks", severity: "minor" },
    ],
    seller: {
      name: "Priya Nair",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      trustScore: 99,
      verified: true,
      responseRate: "< 10 mins",
    },
    aiVerified: true,
    barterAvailable: true,
    description:
      "Curated mix of design, climate, and fiction hardcovers. No writing inside. Open to swapping for plant books or vinyl.",
    descriptionMy:
      "ဒီဇိုင်း၊ ရာသီဥတုနှင့် စိတ်ကူးယဉ်စာအုပ်များ ရောနှောထားသော အထုပ်။ အတွင်းစာမျက်နှာများ သန့်ရှင်းသည်။",
  },
  {
    id: "p4",
    title: "Compact Oak Standing Desk",
    price: 85,
    originalPrice: 249,
    marketAverage: 95,
    category: "🔄 Barter/Swap",
    image:
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80",
    distance: "1.5 km away",
    location: "Downtown",
    aiConditionScore: 90,
    aiConditionLabel: "Like New",
    co2SavedKg: 18.2,
    eWastePreventedKg: 8.4,
    defects: [
      { x: 62, y: 48, label: "Hairline scratch near cable grommet", severity: "minor" },
    ],
    seller: {
      name: "Leo Santos",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
      trustScore: 91,
      verified: true,
      responseRate: "< 1 hr",
    },
    aiVerified: true,
    barterAvailable: true,
    description:
      "Solid oak compact standing desk (110cm). Prefers swap for a bike or monitor arm, but will sell locally for pickup.",
    descriptionMy:
      "ကျစ်လစ်သော ဝက်သစ်ချသား ရပ်အလုပ်စားပွဲ (၁၁၀ စင်တီမီတာ)။ စက်ဘီး သို့မဟုတ် မော်နီတာလက်တံနှင့် လဲလှယ်လိုသည်။",
  },
  {
    id: "p5",
    title: "Refurbished HEPA Air Purifier",
    price: 45,
    originalPrice: 129,
    marketAverage: 52,
    category: "🌱 Eco-Deals",
    image:
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=1200&q=80",
    distance: "3.0 km away",
    location: "East Market",
    aiConditionScore: 84,
    aiConditionLabel: "Good",
    co2SavedKg: 9.1,
    eWastePreventedKg: 4.7,
    defects: [
      { x: 35, y: 70, label: "Replacement filter has 2 months of use", severity: "moderate" },
    ],
    seller: {
      name: "Amina Yusuf",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
      trustScore: 96,
      verified: true,
      responseRate: "< 20 mins",
    },
    aiVerified: true,
    barterAvailable: false,
    description:
      "Quiet bedroom HEPA purifier, factory-refurbished. Includes extra carbon pre-filter. Ideal for small apartments.",
    descriptionMy:
      "အသံတိတ် HEPA လေသန့်စင်ကိရိယာ။ အပိုကာဗွန်စစ်ထုတ်စက် ပါဝင်သည်။ တိုက်ခန်းငယ်များအတွက် သင့်တော်သည်။",
  },
  {
    id: "p6",
    title: "iPhone 13 128GB Midnight",
    price: 310,
    originalPrice: 799,
    marketAverage: 340,
    category: "⚡ Electronics",
    image:
      "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=1200&q=80",
    distance: "2.6 km away",
    location: "University Quarter",
    aiConditionScore: 81,
    aiConditionLabel: "Good",
    co2SavedKg: 7.3,
    eWastePreventedKg: 0.2,
    defects: [
      { x: 78, y: 42, label: "Tiny chip on aluminum frame", severity: "minor" },
      { x: 48, y: 80, label: "Faint screen micro-scratches (not visible on)", severity: "minor" },
    ],
    seller: {
      name: "Chris Nguyen",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      trustScore: 88,
      verified: false,
      responseRate: "< 2 hrs",
    },
    aiVerified: false,
    barterAvailable: false,
    description:
      "Factory-unlocked iPhone 13, battery 87%. Face ID works. No box. Local meetup preferred near campus.",
    descriptionMy:
      "Unlock လုပ်ထားသော iPhone 13၊ ဘက်ထရီ ၈၇%။ Face ID အလုပ်လုပ်သည်။ ကျောင်းဝင်းအနီး တွေ့ဆုံရောင်းချလိုသည်။",
  },
  {
    id: "p7",
    title: "Ceramic Planter Set (x4)",
    price: 18,
    originalPrice: 48,
    marketAverage: 20,
    category: "🌱 Eco-Deals",
    image:
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1200&q=80",
    distance: "0.5 km away",
    location: "Downtown",
    aiConditionScore: 95,
    aiConditionLabel: "Like New",
    co2SavedKg: 2.2,
    eWastePreventedKg: 3.8,
    defects: [],
    seller: {
      name: "Sofia Alvarez",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
      trustScore: 97,
      verified: true,
      responseRate: "< 15 mins",
    },
    aiVerified: true,
    barterAvailable: true,
    description:
      "Four glazed ceramic planters with drainage. Barely used. Happy to swap for succulents or compost bins.",
    descriptionMy:
      "ရေထွက်ပေါက်ပါသော ကြွေအိုး လေးလုံး။ သုံးနီးပါးမရှိ။ အရည်ရွှမ်းပင်များနှင့် လဲလှယ်နိုင်သည်။",
  },
  {
    id: "p8",
    title: "Keychron K2 Mechanical Keyboard",
    price: 42,
    originalPrice: 89,
    marketAverage: 48,
    category: "⚡ Electronics",
    image:
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1200&q=80",
    distance: "1.9 km away",
    location: "Riverside",
    aiConditionScore: 89,
    aiConditionLabel: "Very Good",
    co2SavedKg: 3.4,
    eWastePreventedKg: 1.5,
    defects: [
      { x: 22, y: 44, label: "Slight shine on spacebar", severity: "minor" },
    ],
    seller: {
      name: "Noah Patel",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
      trustScore: 93,
      verified: true,
      responseRate: "< 25 mins",
    },
    aiVerified: true,
    barterAvailable: true,
    description:
      "Hot-swappable Keychron K2 with brown switches. Bluetooth + USB-C. Open to swapping for a compact wooden desk under 180,000 Ks.",
    descriptionMy:
      "Hot-swap Keychron K2 (brown switch)။ Bluetooth နှင့် USB-C ပါသည်။ ကျစ်လစ်သော သစ်သားစားပွဲနှင့် လဲလှယ်နိုင်သည်။",
  },
];

export const MOCK_CHATS: ChatThread[] = [
  {
    id: "c1",
    productId: "p1",
    otherParty: {
      name: "Maya Chen",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
      role: "seller",
    },
    unread: 2,
    activeOffer: 490,
    messages: [
      {
        id: "m1",
        sender: "buyer",
        text: "Hi Maya — is the M1 Air still available for pickup downtown?",
        timestamp: "10:12 AM",
      },
      {
        id: "m2",
        sender: "seller",
        text: "Yes! Battery is 92% and I can meet tonight after 6.",
        timestamp: "10:18 AM",
      },
      {
        id: "m3",
        sender: "buyer",
        text: "Would you take $490 if I come today?",
        timestamp: "10:21 AM",
        offerAmount: 490,
      },
      {
        id: "m4",
        sender: "seller",
        text: "That's close. I can do $510 including the sleeve.",
        timestamp: "10:24 AM",
        offerAmount: 510,
      },
    ],
  },
  {
    id: "c2",
    productId: "p4",
    otherParty: {
      name: "Leo Santos",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
      role: "seller",
    },
    unread: 0,
    activeOffer: null,
    messages: [
      {
        id: "m5",
        sender: "buyer",
        text: "I have a 27\" monitor arm — interested in a swap for the oak desk?",
        timestamp: "Yesterday",
      },
      {
        id: "m6",
        sender: "seller",
        text: "Possibly! Send a photo of the arm and we can meet at City Mall.",
        timestamp: "Yesterday",
      },
    ],
  },
  {
    id: "c3",
    productId: "p7",
    otherParty: {
      name: "Sofia Alvarez",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
      role: "seller",
    },
    unread: 1,
    activeOffer: 16,
    messages: [
      {
        id: "m7",
        sender: "seller",
        text: "Planters are still free for pickup this weekend 🌱",
        timestamp: "8:02 AM",
      },
      {
        id: "m8",
        sender: "buyer",
        text: "Can I offer $16 and grab them at 4pm?",
        timestamp: "8:40 AM",
        offerAmount: 16,
      },
    ],
  },
];

export const CURRENT_USER = {
  name: "Alex Rivera",
  avatar:
    "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=200&q=80",
  location: "Downtown",
  trustScore: 96,
};

export const AI_SCAN_STEPS = [
  "Detecting object silhouette & brand marks",
  "Scoring surface wear and defect clusters",
  "Comparing local second-hand market comps",
];
