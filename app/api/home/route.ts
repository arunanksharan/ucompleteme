import {
  errorImageUrl,
  homeAsPostUrl,
  homeImageUrl,
  openApiTextCompleteUrl,
} from '@/constants/urls';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    return new NextResponse(
      `<!DOCTYPE html>
          <html>
            <head>
              <title>UCompleteMe</title>
              <meta property="og:title" content="UCompleteMe" />
              <meta property="og:image" content="${homeImageUrl}" />
              <meta name="fc:frame" content="vNext" />
              <meta name="fc:frame:image" content="${homeImageUrl}" />
              <meta name="fc:frame:post_url" content="${openApiTextCompleteUrl}" />
              <meta name="fc:frame:input:text" content="Enter Text Here" />
              <meta name="fc:frame:button:1" content="Complete" />
            </head>
            <body><img src="/images/welcome.png" alt="welcome to ucomplteme"></img></body>
          </html>`,
      {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  } catch (error) {
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
