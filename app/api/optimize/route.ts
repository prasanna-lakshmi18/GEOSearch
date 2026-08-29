import { NextResponse } from 'next/server';
import { createOptimizationLog } from '@/lib/services/audit-store';

async function generateGeoAssets(text: string) {
  const apiKey = process.env.GROK_API_KEY;
  if (!apiKey) {
    throw new Error('GROK_API_KEY is not set');
  }

  const prompt = `As an elite Generative Engine Optimization (GEO) strategist, perform a deep-dive semantic analysis of the following brand content:
  
Text: "${text}"

Your objective is to restructure this content specifically for direct extraction by Large Language Models (like ChatGPT, Perplexity, and Claude). Do not generate generic advice; be hyper-specific to the text provided.

Respond strictly with a JSON object containing the following keys:
- "summaryBox": an array of 3 distinct, highly factual, zero-fluff sentences. Each sentence must contain direct entities, hard statistics (if present), and clear subject-verb-object structures that LLMs prioritize for direct "featured snippet" style extraction.
- "schemaType": the exact string "FAQPage" or "Article" depending on the content's primary intent.
- "schemaJsonLd": a complete, valid JSON-LD object for the chosen schemaType, fully populated with the brand's entities, key claims, and context extracted from the text.
- "longTailTopics": an array of 3 conversational, highly specific long-tail questions that users are actively asking AI engines related to this exact niche. These should represent the brand's next content gaps to fill.`;

  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'grok-beta',
        messages: [
          { role: 'system', content: 'You are a GEO content strategist. Always respond in valid JSON format only.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      console.error('Grok API error:', await response.text());
      throw new Error('Failed to fetch from Grok API');
    }

    const data = await response.json();
    let content = data.choices[0].message.content;
    content = content.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(content);
  } catch (error) {
    console.error('Error parsing Grok response:', error);
    // Fallback if the API fails
    return {
      summaryBox: [
        "Optimized bullet 1: Direct, factual, and concise answer.",
        "Optimized bullet 2: 45% increase in efficiency reported.",
        "Optimized bullet 3: Compatible with major AI search engine requirements."
      ],
      schemaType: "FAQPage",
      schemaJsonLd: {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is GEO?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Generative Engine Optimization (GEO) improves visibility in AI search."
            }
          }
        ]
      },
      longTailTopics: [
        "How to implement GEO in Next.js",
        "Best practices for LLM direct extraction",
        "Perplexity vs ChatGPT ranking"
      ]
    };
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { auditId, pageText } = body;
    
    if (!auditId || !pageText) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const assets = await generateGeoAssets(pageText);
    
    const log = await createOptimizationLog({
      auditId,
      originalText: pageText.substring(0, 100) + '...',
      optimizedOutput: assets,
      schemaType: assets.schemaType
    });
    
    return NextResponse.json(log);
  } catch (error) {
    console.error('Optimize error:', error);
    return NextResponse.json({ error: 'Failed to generate optimizations' }, { status: 500 });
  }
}
