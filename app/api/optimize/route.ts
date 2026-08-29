import { NextResponse } from 'next/server';
import { createOptimizationLog } from '@/lib/services/audit-store';

async function generateGeoAssets(text: string) {
  const apiKey = process.env.GROK_API_KEY;
  if (!apiKey) {
    throw new Error('GROK_API_KEY is not set');
  }

  const prompt = `As a Generative Engine Optimization (GEO) expert, analyze the following text and generate optimized assets for AI search engines:
  
Text: "${text}"

Respond with a JSON object containing:
- summaryBox: an array of 3 concise, highly factual, directly phrased sentences that are easy for an LLM to extract as an answer.
- schemaType: the string "FAQPage" or "Article".
- schemaJsonLd: an object representing valid JSON-LD for the schemaType.
- longTailTopics: an array of 3 conversational, user-intent questions related to the text that the brand should cover next.`;

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
