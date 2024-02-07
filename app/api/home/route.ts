import { homeImageUrl, openApiTextCompleteUrl } from '@/constants/urls';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
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
          <meta name="fc:frame:button:1" content="Complete" />
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
