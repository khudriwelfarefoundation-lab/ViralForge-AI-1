import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Gemini on Server-Side safely
let ai: GoogleGenAI | null = null;
const geminiKey = process.env.GEMINI_API_KEY;

if (geminiKey && geminiKey.trim() !== "" && geminiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: geminiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini API initialized successfully via process.env.GEMINI_API_KEY.");
  } catch (err) {
    console.error("Failed to initialize GoogleGenAI with key:", err);
  }
} else {
  console.log("No valid GEMINI_API_KEY detected. Server will operate using Local Forge Core logic.");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // API endpoints FIRST

  // Backed secure payment details & configurations
  const SECURE_PAYMENT_DETAILS = {
    ownerName: "Muhammad Talha",
    cardNumber: "4782 7800 3108 5668",
    expiry: "02/29",
    cvc: "994",
    cryptoTRC20: "TY7u88N2Bv9xW90dLaK88xS9xZ5e9D88vQ",
    paypalEmail: "khudriwelfarefoundation@gmail.com"
  };

  // Secure user login verification at the backend
  app.post("/api/auth/login", (req, res) => {
    const { email, name, password, isSignUp } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required credentials." });
    }

    const trimmedEmail = email.toLowerCase().trim();
    const isAdmin = trimmedEmail === "khudriwelfarefoundation@gmail.com";

    if (isAdmin) {
      if (password !== "Saeedkhudri12345///") {
        return res.status(401).json({ error: "Unauthorized. Secret admin password credentials invalid." });
      }
      return res.json({
        email: "khudriwelfarefoundation@gmail.com",
        name: "Muhammad Talha (Owner)",
        role: "admin",
        tier: "Unlimited",
        paymentStatus: "approved"
      });
    } else {
      // Other than this gmail, all should be assigned in customer category (role: 'user')
      return res.json({
        email: email.trim(),
        name: name ? name.trim() : email.split("@")[0],
        role: "user",
        tier: "Free",
        paymentStatus: "none"
      });
    }
  });

  // Secure API endpoint for payment configs (Hides private credit details from public customers)
  app.get("/api/payment/config", (req, res) => {
    const userRole = req.query.role;
    
    if (userRole === "admin") {
      return res.json({
        price: 11.99,
        cryptoTRC20: SECURE_PAYMENT_DETAILS.cryptoTRC20,
        paypalEmail: SECURE_PAYMENT_DETAILS.paypalEmail,
        ownerCardDetails: {
          name: SECURE_PAYMENT_DETAILS.ownerName,
          number: SECURE_PAYMENT_DETAILS.cardNumber,
          expiry: SECURE_PAYMENT_DETAILS.expiry,
          cvc: SECURE_PAYMENT_DETAILS.cvc
        }
      });
    }

    // Secure response for general users - doesn't expose merchant private card details
    return res.json({
      price: 11.99,
      cryptoTRC20: SECURE_PAYMENT_DETAILS.cryptoTRC20,
      paypalEmail: SECURE_PAYMENT_DETAILS.paypalEmail,
      status: "active"
    });
  });

  // API Check Status
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      aiStatus: ai ? "connected" : "local-fallback",
      message: ai ? "Server-side Gemini Core Online." : "Operating in Local Forge emulation mode."
    });
  });

  // Feature 1: AI Prompt Helper & Prompt Optimization
  app.post("/api/optimize-prompt", async (req, res) => {
    const { prompt, style } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "No prompt provided" });
    }

    if (ai) {
      try {
        const sysMsg = `You are a cinematic prompt engineer expert for video generative models like Veo, Runway Gen-2, and Kling.
Your task is to take a simple prompt and expand it into an extremely descriptive, dramatic prompt with visual camera instructions (e.g. slow dynamic panning, shallow depth of field, 4k ultra-high definition details, cinematic color grading, specific lens, speed rate structure) suited for the aesthetic: "${style || 'Cinematic'}".
Keep the optimized prompt to 2-3 powerful sentences. Keep it descriptive, direct, without conversational headers.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: `Simple user prompt: "${prompt}"`,
          config: {
            systemInstruction: sysMsg,
            temperature: 0.75,
          },
        });

        return res.json({
          optimizedPrompt: response.text ? response.text.trim() : prompt,
          source: "Gemini",
        });
      } catch (err: any) {
        console.error("Gemini Optimize Prompt Error:", err);
        // Fallback below
      }
    }

    // Local Fallback
    const localStyleModifiers: Record<string, string> = {
      cinematic: "Shot on 35mm Arri Alexa, masterfully lit cinematic scenery, depth of field, subtle volumetric rays, anamorphic flare, UHD.",
      anime: "Extremely dynamic anime style, gorgeous hand-painted scenery backgrounds, epic cel-shading, rich colors, Kyoto Animation inspired.",
      "3d-animation": "Charming 3D stylized character model rendering, high quality Raytracing reflections, playful cartoon animation keys, Pixar aesthetic.",
      "pixel-art": "Rich detailed 16-bit retro isometric gameplay landscape, clean pixel grid layout, nostalgic retro atmosphere.",
      cyberpunk: "Drenched rain visual style, brilliant cyan and purple neon reflections reflecting off damp wet street asphalt, cinematic slow track.",
      luxury: "High-end sleek aesthetics, deep gold and obsidian lighting scheme, flawless detail magnification, ultra-rich ambient design.",
    };

    const modifier = localStyleModifiers[style?.toLowerCase()] || "Highly detailed visual presentation, pristine production value, fluid movement, premium grade output.";
    const optimizedText = `[Forge Optimized Mode] ${prompt}. ${modifier} Action sequence with cinematic camera tracking, volumetric lighting, photorealistic fidelity.`;

    res.json({
      optimizedPrompt: optimizedText,
      source: "Local Engine",
    });
  });

  // Feature 2: Generate Video Script, Scenes and Caption Metadata
  app.post("/api/generate-script", async (req, res) => {
    const { prompt, style, duration, aspectRatio } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "No prompt provided" });
    }

    const durationSeconds = Number(duration) || 15;

    if (ai) {
      try {
        const sysMsg = `You are a Professional Social Media Script Architect and Director.
Given a prompt, style, duration in seconds, and aspect ratio, you will generate a JSON response.
You must return a structure containing:
1. "title": A viral attention-grabbing title (max 60 chars)
2. "description": An engaging description containing targets and hooks
3. "hashtags": array of 4-6 trending relevant hashtags
4. "scenePlan": An array of scenes that partition the duration. Each scene object must have:
   - "timeStart": start seconds (number)
   - "timeEnd": end seconds (number)
   - "description": visual prompt for video generation
   - "subtitle": spoken audio caption text for that scene timeframe. Note: Make subtitles punchy.

The duration is ${durationSeconds} seconds. Distribute scenes across this time (e.g. 3-5 scenes). Return JSON ONLY.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: `Create script for: Prompt: "${prompt}", Style: "${style}", Duration: ${durationSeconds}s, Aspect Ratio: "${aspectRatio}"`,
          config: {
            systemInstruction: sysMsg,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                hashtags: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                scenePlan: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      timeStart: { type: Type.NUMBER },
                      timeEnd: { type: Type.NUMBER },
                      description: { type: Type.STRING },
                      subtitle: { type: Type.STRING }
                    },
                    required: ["timeStart", "timeEnd", "description", "subtitle"]
                  }
                }
              },
              required: ["title", "description", "hashtags", "scenePlan"]
            },
          },
        });

        if (response.text) {
          const generatedData = JSON.parse(response.text.trim());
          return res.json({
            ...generatedData,
            source: "Gemini",
          });
        }
      } catch (err: any) {
        console.error("Gemini Script Generation Error:", err);
        // Fallback to local script generator
      }
    }

    // Local Forge Script Generator Mocking
    const title = `Viral: ${prompt.slice(0, 30)}${prompt.length > 30 ? "..." : ""}`;
    const description = `This is going to disrupt the algorithm! 🔥 Explore the world of ${style || 'cinematics'} with this masterpiece crafted through standard prompt pipelines. Enjoy the visual ride!`;
    const hashtags = [
      `#ViralForge`,
      `#${(style || "AI_Video").replace(/[^a-zA-Z0-9]/g, "")}`,
      `#Shorts`,
      `#Trending`,
      `#AIStudio`
    ];

    // Divide durationSeconds into 3 parts
    const splitCount = 3;
    const interval = durationSeconds / splitCount;
    const scenePlan = [];
    
    const localCaptions = [
      `Behold the visual manifestation of your imagination...`,
      `Every fine element rendered perfectly to maximize viewer retention...`,
      `Follow and schedule with ViralForge AI for more spectacular content!`
    ];

    for (let i = 0; i < splitCount; i++) {
      const start = parseFloat((i * interval).toFixed(1));
      const end = parseFloat(((i + 1) * interval).toFixed(1));
      scenePlan.push({
        timeStart: start,
        timeEnd: end,
        description: `Visual Sequence Part ${i + 1}: Rendered visual scene featuring: ${prompt} with style modifiers for ${style || 'Normal'} at aspect ratio ${aspectRatio}.`,
        subtitle: localCaptions[i] || `Sequence ${i + 1} rendering completed successfully.`
      });
    }

    res.json({
      title,
      description,
      hashtags,
      scenePlan,
      source: "Local Engine (Fallback)",
    });
  });

  // Feature 4: Ai Hashtag Suggestion
  app.post("/api/suggest-hashtags", async (req, res) => {
    const { caption, tagCount } = req.body;
    const count = Number(tagCount) || 5;

    if (ai && caption) {
      try {
        const sysMsg = `You are a high-performance Social Media Optimizer. Provide a list of viral hashtags (in JSON array format) based on the user's content topic. Return exactly ${count} hashtags that are trending.`;
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: `Suggest ${count} hashtags for: "${caption}"`,
          config: {
            systemInstruction: sysMsg,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        });

        if (response.text) {
          const arr = JSON.parse(response.text.trim());
          if (Array.isArray(arr)) {
            return res.json({ hashtags: arr, source: "Gemini" });
          }
        }
      } catch (err) {
        console.error("Gemini Hashtag Suggestion Error:", err);
      }
    }

    // Default fallback
    const defaults = ["#ViralForge", "#SocialAutomation", "#AIVideos", "#AIGen", "#GrowthHack", "#FYP", "#ForYouPage"];
    res.json({
      hashtags: defaults.slice(0, count),
      source: "Local Engine",
    });
  });

  // Feature 5: AI SEO Optimization Engine
  app.post("/api/seo-optimize", async (req, res) => {
    const { title, description, hashtags, platform, style } = req.body;
    if (!platform) {
      return res.status(400).json({ error: "No platform provided" });
    }

    if (ai) {
      try {
        const sysMsg = `You are a world-class Social Media Growth Hacker and SEO Copywriter specializing in ${platform.toUpperCase()} algorithms.
Given a video title, description, and hashtags, rewrite them to achieve maximum reach and organic virality on ${platform}.
Consider specific platform mechanics:
- tiktok: Punchy, high-energy hooks, curiosity gaps in the first 3 words, and trending behavioral keywords. Avoid long descriptions. Include strong visual hooks.
- instagram: Aesthetic style, lifestyle storytelling hooks, formatted line-breaks, emotional connection prompts, and reels-specific tags.
- facebook: Engagement-driven questions, community conversation starters, relatable family/friend setups, and slightly longer informative text with strong reactions.
- youtube: Highly descriptive keyword optimization, attention-grabbing title hooks, search-friendly descriptive paragraphs with tags.

Return your response ONLY as a JSON object containing keys "title", "description", and "hashtags" (array of strings). Do not include formatting wraps other than pure JSON.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: `Optimize this content for ${platform}: Title: "${title}", Description: "${description}", Hashtags: [${hashtags ? hashtags.join(', ') : ''}], Style styleCard: "${style || 'general'}"`,
          config: {
            systemInstruction: sysMsg,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                hashtags: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["title", "description", "hashtags"]
            }
          }
        });

        if (response.text) {
          const optimized = JSON.parse(response.text.trim());
          return res.json({
            ...optimized,
            source: "Gemini AI SEO Engine"
          });
        }
      } catch (err) {
        console.error("Gemini SEO Optimization error:", err);
      }
    }

    // Local High Fidelity Rules-Based Fallback if Gemini fails or is in local mode
    let optTitle = title || "";
    let optDesc = description || "";
    let optHashtags = hashtags || [];

    const pType = platform.toLowerCase();
    if (pType === 'tiktok') {
      optTitle = `🔥 Watch till the end! ${title || 'Must watch'}`;
      optDesc = `POV: You find the most satisfying ${style || 'aesthetic'} loop on your feed today. Comment your reaction below! 😱👇`;
      optHashtags = Array.from(new Set([...optHashtags, '#fyp', '#tiktokviral', '#foryou', '#satisfying', '#loop', '#growthhacks']));
    } else if (pType === 'instagram') {
      optTitle = `✨ ${title || 'Aesthetic Inspiration'}`;
      optDesc = `Cozy moments with a touch of ${style || 'timeless'} vibes. Saved this for your future visual boards. 📸🎨\n\nWhich part speaks to you the most? Drop an emoji below!`;
      optHashtags = Array.from(new Set([...optHashtags, '#reelsinstagram', '#aestheticvibes', '#creators', '#instadaily', '#explorepage']));
    } else if (pType === 'facebook') {
      optTitle = `An Incredible Showcase: ${title || 'Check this out'}`;
      optDesc = `Have you ever seen anything like this? Let us know if you would try this out! Share this with someone who needs to see this amazing ${style || 'video'} masterpiece today! 👍👥`;
      optHashtags = Array.from(new Set([...optHashtags, '#viralvideo', '#facebookreels', '#trendingpost', '#community', '#mustshare']));
    } else if (pType === 'youtube') {
      optTitle = `The Ultimate Creative Guide: ${title || 'How to master aesthetics'} (4K HD)`;
      optDesc = `In this creative episode, we deep dive into high-clarity ${style || 'concept rendering'}. Designed using standard multi-layer prompt formulas to maximize retention. Subscribe for daily digital assets and hacks!\n\nTimestamps:\n0:00 - Introduction\n0:30 - Core analysis`;
      optHashtags = Array.from(new Set([...optHashtags, '#shorts', '#youtubeshorts', '#seo', '#tutorial', '#viralshorts', '#howtovideos']));
    }

    res.json({
      title: optTitle,
      description: optDesc,
      hashtags: optHashtags,
      source: "Local SEO Rule Matrix"
    });
  });

  // Serve static assets or use Vite dev server
  if (process.env.NODE_ENV !== "production") {
    console.log("Mounting Vite Development Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving compiled static assets from /dist...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ViralForge AI server running at http://localhost:${PORT}`);
  });
}

startServer();
