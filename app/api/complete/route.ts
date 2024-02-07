import {
  OpenAIModel,
  IOpenAITextCompletionReqParams,
} from '@/interface/ITextCompletion';
import { getCompletedText } from '@/services/openAi';
import { supabase } from '../../../utils/supabaseClient';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';
import {
  errorImageUrl,
  homeAsPostUrl,
  openApiResImageUrl,
  queryLimitExceededImageUrl,
} from '@/constants/urls';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest): Promise<NextResponse> {
  // Your logic for handling POST requests
  // Call OpenAI API

  console.log('line 22 req in /complete', req);
  const body = await req.json();
  console.log('line 24 body', body);

  const { untrustedData, trustedData } = body;
  const { inputText, fid } = untrustedData;

  // Check length of inputText - maximum = 15 words
  if (inputText.split(' ').length > 15) {
    return new NextResponse(
      `<!DOCTYPE html>
    <html>
      <head>
        <title>UCompleteMe</title>
        <meta property="og:title" content="UCompleteMe" />
        <meta property="og:image" content="${errorImageUrl}" />
        <meta name="fc:frame" content="vNext" />
        <meta name="fc:frame:image" content="${errorImageUrl}" />
        <meta name="fc:frame:post_url" content="${homeAsPostUrl}" />
        <meta name="fc:frame:button:1" content="Home" />
      </head>
      <body>UCompleteMe</body>
    </html>`,
      {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  }

  // Check if user has made 10 requests already
  const { data: userQueries, error: userQueriesError } = await supabase
    .from('applications')
    .select('*', { count: 'exact', head: true })
    .eq('fc_id', fid);

  if (userQueries && userQueries.length >= 10) {
    return new NextResponse(
      `<!DOCTYPE html>
    <html>
      <head>
        <title>UCompleteMe</title>
        <meta property="og:title" content="UCompleteMe" />
        <meta property="og:image" content="${queryLimitExceededImageUrl}" />
        <meta name="fc:frame" content="vNext" />
        <meta name="fc:frame:image" content="${queryLimitExceededImageUrl}" />
        <meta name="fc:frame:post_url" content="${homeAsPostUrl}" />
        <meta name="fc:frame:button:1" content="Home" />
      </head>
      <body>UCompleteMe</body>
    </html>`,
      {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  }

  // fetch from openAI
  const openAiBody: IOpenAITextCompletionReqParams = {
    temperature: 0.7,
    max_tokens: 15,
    prompt: inputText,
    model: OpenAIModel.GPT_4,
  };

  const response = await getCompletedText(openAiBody);
  const content = await response.choices[0].message.content.trim();
  console.log('line 57 Inside jobs:', content);
  console.log('line 58 Inside jobs:', response);

  // Save this in supabase db
  const { data, error } = await supabase
    .from('applications')
    .insert([{ fc_id: fid, input_query: inputText, output_query: content }])
    .select();
  console.log('line 42 Inside text error:', {
    fc_id: fid,
    input_query: inputText,
    output_query: content,
  });

  console.log('line 7448 Inside jobs data:', data);

  if (response) {
    // use satori to create an image
    const imageId = data![0].id;

    return new NextResponse(
      `< !DOCTYPE html >
    <html>
        <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="${openApiResImageUrl}?imageId=${imageId}" />
            <meta property="og:image" content="${openApiResImageUrl}?imageId=${imageId}" />
        </head>
    </html>
`,
      {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  }
  return new NextResponse(
    `<!DOCTYPE html>
  <html>
    <head>
      <title>UCompleteMe</title>
      <meta property="og:title" content="UCompleteMe" />
      <meta property="og:image" content="${errorImageUrl}" />
      <meta name="fc:frame" content="vNext" />
      <meta name="fc:frame:image" content="${errorImageUrl}" />
      <meta name="fc:frame:post_url" content="${homeAsPostUrl}" />
      <meta name="fc:frame:button:1" content="Home" />
    </head>
    <body>UCompleteMe</body>
  </html>`,
    {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    }
  );
}
