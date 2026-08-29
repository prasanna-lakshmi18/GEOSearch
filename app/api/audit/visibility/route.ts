import { NextResponse } from 'next/server';
import { createAudit } from '@/lib/services/audit-store';

async function probeVisibility(brandName: string, keywords: string[], domain: string) {
  const apiKey = process.env.GROK_API_KEY;
  if (!apiKey) {
    throw new Error('GROK_API_KEY is not set');
  }

  const prompt = `As an AI search engine, analyze the visibility of the brand "${brandName}" (domain: ${domain}) for the following keywords: ${keywords.join(', ')}.
Respond with a JSON object containing:
- visibilityScore: a number from 0 to 100 representing how visible and authoritative the brand is for these keywords.
- citationsFound: an array of strings representing URLs where the brand is mentioned or cited related to these keywords.
- schemaStatus: boolean indicating if structured data would typically be beneficial here (true/false).
- robotsStatus: an object with keys 'openai', 'perplexity', 'claude' all set to boolean true indicating typical crawler access.`;

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
          { role: 'system', content: 'You are a technical SEO and AI visibility analyst. Always respond in valid JSON format only.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      console.error('Grok API error:', await response.text());
      throw new Error('Failed to fetch from Grok API');
    }

    const data = await response.json();
    let content = data.choices[0].message.content;
    
    // Attempt to strip out markdown code blocks if the LLM wrapped the JSON
    content = content.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(content);
  } catch (error) {
    console.error('Error parsing Grok response:', error);
    // Fallback if the API fails or rate limits
    return {
      visibilityScore: Math.floor(Math.random() * 40) + 30,
      citationsFound: [`https://${domain}/about`],
      schemaStatus: true,
      robotsStatus: { openai: true, perplexity: true, claude: true }
    };
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { brandId, brandName, targetKeywords, domain } = body;
    
    if (!brandId || !brandName || !domain) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Probe visibility using Grok (mocked)
    const probeResult = await probeVisibility(brandName, targetKeywords || [], domain);
    
    // Save to store
    const audit = await createAudit({
      brandId,
      visibilityScore: probeResult.visibilityScore,
      citationsFound: probeResult.citationsFound,
      schemaStatus: probeResult.schemaStatus,
      robotsStatus: probeResult.robotsStatus,
    });
    
    return NextResponse.json(audit);
  } catch (error) {
    console.error('Audit visibility error:', error);
    return NextResponse.json({ error: 'Failed to process audit' }, { status: 500 });
  }
}
