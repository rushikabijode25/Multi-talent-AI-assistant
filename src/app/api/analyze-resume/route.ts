import { NextRequest, NextResponse } from 'next/server';

// Gemini AI scoring prompt
const buildPrompt = (resumeText: string, jobDescription: string) => `
You are a senior ATS (Applicant Tracking System) expert and professional career coach.

Analyze this resume against the job description and respond ONLY with valid JSON:

=== RESUME ===
${resumeText.slice(0, 3000)}

=== JOB DESCRIPTION ===
${jobDescription}

Respond with this exact JSON shape:
{
  "atsScore": <number 0-100>,
  "decision": "<Highly Recommended | Recommended | Neutral | Needs Improvement>",
  "feedback": "<2-3 professional sentences evaluating the resume>",
  "seniorityLevel": "<Junior | Mid-Level | Senior | Lead>",
  "matchingSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "improvements": ["tip1", "tip2", "tip3"],
  "experienceYears": <estimated number>
}
`;

const TECH_SKILLS = [
  'java','spring boot','spring','python','django','javascript','typescript',
  'react','next.js','node.js','vue','angular','mongodb','postgresql','mysql',
  'redis','docker','kubernetes','aws','gcp','azure','git','graphql','rest api',
  'machine learning','nlp','generative ai','ci/cd','microservices','kafka',
  'tailwind','terraform','jenkins','linux'
];

function extractSkills(text: string): string[] {
  const lower = text.toLowerCase();
  return TECH_SKILLS.filter(skill => lower.includes(skill));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resumeText, jobDescription } = body;

    if (!resumeText || !jobDescription) {
      return NextResponse.json({ error: 'resumeText and jobDescription are required' }, { status: 400 });
    }

    const resumeSkills = extractSkills(resumeText);
    const jdSkills = extractSkills(jobDescription);
    const matchingSkills = resumeSkills.filter(s => jdSkills.includes(s));
    const missingSkills = jdSkills.filter(s => !resumeSkills.includes(s));

    // Call Gemini if API key exists, otherwise return smart mock
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: buildPrompt(resumeText, jobDescription) }] }],
            generationConfig: { temperature: 0.3, responseMimeType: 'application/json' }
          })
        }
      );
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        const parsed = JSON.parse(text);
        return NextResponse.json({ ...parsed, matchingSkills, missingSkills });
      }
    }

    // Smart fallback mock response
    const score = Math.min(95, Math.round(
      40 + (matchingSkills.length / Math.max(jdSkills.length, 1)) * 55 + Math.random() * 5
    ));

    return NextResponse.json({
      atsScore: score,
      decision: score >= 80 ? 'Highly Recommended' : score >= 65 ? 'Recommended' : 'Needs Improvement',
      feedback: `This resume demonstrates ${matchingSkills.length} of ${jdSkills.length} required technical skills. ${
        matchingSkills.length >= 4
          ? 'Strong alignment with the role requirements — candidate shows solid foundational expertise.'
          : 'The candidate shows promise but should highlight more relevant technologies prominent in the job description.'
      } Consider quantifying achievements with metrics for stronger ATS performance.`,
      seniorityLevel: matchingSkills.length >= 8 ? 'Senior' : matchingSkills.length >= 5 ? 'Mid-Level' : 'Junior',
      matchingSkills,
      missingSkills,
      improvements: [
        'Quantify impact — add metrics (e.g., "Reduced build time by 40%").',
        `Highlight missing skills: ${missingSkills.slice(0, 3).join(', ')} in relevant project context.`,
        'Use action verbs: Built, Designed, Architected, Optimized, Deployed.',
        'Add a concise Professional Summary at the top tailored to this job description.',
      ],
      experienceYears: resumeText.match(/(\d+)\+?\s*year/i)?.[1] || 3,
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Analysis failed' }, { status: 500 });
  }
}
