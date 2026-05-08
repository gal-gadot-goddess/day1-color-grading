import fs from 'fs';
import path from 'path';

// Load env vars from process.env (passed by GitHub Actions or local)
const API_KEY = process.env.POLLINATIONS_API_KEY || process.env.GEMINI_API_KEY;
const MODEL = process.env.AI_MODEL || 'gemini-fast';
const POLLINATIONS_API_URL = 'https://gen.pollinations.ai/v1/chat/completions';

async function generateMetadata() {
    const args = process.argv.slice(2);
    const selectedAlgo = args[0] || 'a random sophisticated algorithm';
    console.log(`🤖 Generating unique content for: ${selectedAlgo}...`);

    const prompt = `
        Act as a Creative Director for a viral coding channel. 
        We need a unique algorithmic visualization metadata for: ${selectedAlgo}.
        
        TASKS:
        1. Create high-CTR metadata specifically for this algorithm: ${selectedAlgo}.
        2. Generate full social media metadata for this specific choice.

        OUTPUT STRUCTURE (STRICT JSON):
        {
            "title": "High-CTR Title",
            "youtube_description": "Detailed description with emojis",
            "youtube_tags": ["tag1", "tag2"],
            "instagram_caption": "Short viral caption",
            "hashtags": "#coding #ai #tech",
            "threads_text": "Punchy punchline",
            "vk_title": "VK Title",
            "vk_description": "VK Desc",
            "facebook_caption": "Engaging FB caption"
        }

        Only return the JSON object. No markdown.
    `;

    try {
        const response = await fetch(POLLINATIONS_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [
                    { role: 'system', content: 'You are an AI that outputs ONLY pure JSON.' },
                    { role: 'user', content: prompt }
                ],
                seed: Math.floor(Math.random() * 999999)
            })
        });

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        
        if (!content) {
            console.error('❌ No content returned from AI API:', JSON.stringify(data));
            process.exit(1);
        }

        const match = content.match(/\{[\s\S]*\}/);
        if (!match) {
            console.error('❌ Could not find JSON in AI response:', content);
            process.exit(1);
        }
        
        const jsonStr = match[0];
        const pkg = JSON.parse(jsonStr);

        // Map to the structure unified_uploader.py expects
        const finalMetadata = {
            "title": pkg.title,
            "ig_caption": pkg.instagram_caption,
            "fb_caption": pkg.facebook_caption,
            "threads_caption": pkg.threads_text,
            "hashtags": pkg.hashtags,
            "yt_description": pkg.youtube_description,
            "yt_tags": pkg.youtube_tags,
            "vk_title": pkg.vk_title,
            "vk_desc": pkg.vk_description
        };

        fs.writeFileSync('metadata.json', JSON.stringify(finalMetadata, null, 2));
        console.log(`✅ Metadata Generated: ${finalMetadata.title}`);

    } catch (error) {
        console.error('❌ AI Extraction Error:', error);
        process.exit(1);
    }
}

generateMetadata();
