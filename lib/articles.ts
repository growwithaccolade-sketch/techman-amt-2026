export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  sections: Array<{ heading: string; body: string }>;
};

export const articles: Article[] = [
  {
    slug: "how-to-choose-a-phone-for-content-creation",
    title: "Which phone should you buy for TikTok, Reels or YouTube?",
    excerpt: "If you record often, camera stabilization, storage and battery life can matter more than a long spec list. Here is what to check before paying.",
    category: "Phone Guide",
    readTime: "6 min read",
    sections: [
      {
        heading: "Start with the videos you actually make",
        body: "If most of your content is TikTok or Instagram Reels, you may care more about reliable video, a good front camera and battery life than extreme zoom. If you shoot long YouTube videos, product videos or events, storage, heat management and external microphone support become more important."
      },
      {
        heading: "Think about storage before camera features",
        body: "Video fills a phone quickly. If you record several clips every day, edit on the phone and keep finished videos locally, a small storage option can become frustrating. Think about how much you shoot in a normal week and how often you are willing to move files to a laptop, drive or cloud service."
      },
      {
        heading: "A better microphone can improve a video more than a small camera upgrade",
        body: "For talking videos, interviews and outdoor clips, clear speech matters. A compatible wireless clip-on microphone can be more useful than paying extra for a phone with a slightly better camera while still recording poor audio."
      },
      {
        heading: "Do not forget battery, charging and a stable mount",
        body: "If you record outside, at events or away from a charger, battery life and a power bank matter. A simple tripod or phone rig also makes a big difference for interviews, product videos and talking-head content. Price the phone together with the accessories you will actually use."
      }
    ]
  },
  {
    slug: "laptop-buying-guide-for-work-school-and-creative-use",
    title: "What laptop specs do you need for school, work, editing or coding?",
    excerpt: "Google Docs and Zoom do not need the same hardware as Premiere Pro, AutoCAD, large code projects or gaming. Match the laptop to the apps you use every week.",
    category: "Laptop Guide",
    readTime: "7 min read",
    sections: [
      {
        heading: "Write down the apps you use every week",
        body: "A student using Chrome, Microsoft Word, Google Docs and Zoom has very different needs from someone editing 4K video, running AutoCAD, building software or playing modern games. Start with your real apps instead of buying the highest specification you can find."
      },
      {
        heading: "More memory helps when you keep many things open",
        body: "If your normal day includes a browser with many tabs, Zoom, spreadsheets, Slack and other apps running together, memory matters. If you edit video or work with large creative files, you will usually need more headroom than someone using documents and web apps."
      },
      {
        heading: "Storage is about both space and convenience",
        body: "School files and office documents use little space compared with video projects, photos, game libraries and large development files. If you regularly work with large files, decide whether you want more internal storage or are comfortable carrying an external SSD."
      },
      {
        heading: "Check the ports before you buy",
        body: "Think about what you connect every week: an external monitor, projector, USB drive, memory card, mouse, microphone or Ethernet cable. A laptop can be fast and still be annoying to use if you need three adapters every day."
      }
    ]
  },
  {
    slug: "creator-audio-starter-guide",
    title: "What microphone should you use for videos, interviews or podcasts?",
    excerpt: "A wireless clip-on mic, USB desk mic and podcast setup solve different problems. Choose based on where you record and how you move.",
    category: "Audio Guide",
    readTime: "5 min read",
    sections: [
      {
        heading: "For walking videos and interviews, wireless is usually easier",
        body: "If you move around while recording, film outside or interview people away from a desk, a wireless clip-on microphone keeps the mic close to the speaker without a long cable. Check that the receiver works with your phone or camera before buying."
      },
      {
        heading: "For desk videos, streaming and podcasts, you can use a fixed microphone",
        body: "If you sit in one place, a USB or studio-style microphone can make more sense. You do not need wireless freedom if the microphone stays on a desk. What matters is keeping it close enough to your mouth and using it in a reasonably quiet room."
      },
      {
        heading: "The room matters as much as the microphone",
        body: "A very expensive microphone can still sound poor in a noisy or echo-heavy room. Turn off loud fans where possible, avoid recording beside traffic, reduce empty-room echo and do a short test before the full recording."
      },
      {
        heading: "Check the full connection before paying",
        body: "Confirm the microphone, receiver, cable or interface works with the exact phone, camera or laptop you plan to use. This prevents buying a good microphone that still needs an adapter or accessory you did not budget for."
      }
    ]
  }
];

export const getArticle = (slug: string) => articles.find((article) => article.slug === slug);
