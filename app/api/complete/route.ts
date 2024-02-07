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

  try {
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

    console.log('line 61 Inside userQueries:', userQueries);

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
      max_tokens: 50,
      model: OpenAIModel.GPT_4_TURBO_PREVIEW,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant.',
        },
        {
          role: 'user',
          content: 'Who won the world series in 2020?',
        },
        {
          role: 'assistant',
          content: 'The Los Angeles Dodgers won the World Series in 2020.',
        },
        {
          role: 'user',
          content: inputText,
        },
      ],
    };

    const response = await getCompletedText(openAiBody);
    console.log('line 58 Inside jobs:', response);

    const content = await response.choices[0].message.content.trim();
    console.log('line 57 Inside jobs:', content);

    // Save this in supabase db
    const { data, error } = await supabase
      .from('queries')
      .insert({ fc_id: fid, input_query: inputText, openai_response: content })
      .select();
    console.log('line 42 Inside text error:', {
      fc_id: fid,
      input_query: inputText,
      openai_response: content,
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
  } catch (error) {
    console.error('line 94 error', error);
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
}
