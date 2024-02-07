import { errorImageUrl, homeAsPostUrl } from '@/constants/urls';
import { supabase } from '@/utils/supabaseClient';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';
import satori from 'satori';
import sharp from 'sharp';
import { join } from 'path';
import * as fs from 'fs';

const fontPath = join(process.cwd(), 'Roboto-Black.ttf');
let fontData = fs.readFileSync(fontPath);

console.log(fontData);

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest): Promise<NextResponse> {
  // Read from database

  const imageId = req.nextUrl.searchParams.get('imageId') as string;
  const { data, error } = await supabase
    .from('queries')
    .select('*')
    .eq('id', imageId);

  if (error) {
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

  const openAiRes = data[0].openai_response;
  const svg = await satori(
    <div
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        display: 'flex',
        width: '100%',
        height: '100%',
        backgroundColor: 'f4f4f4',
        padding: 50,
        lineHeight: 1.2,
        fontSize: 24,
      }}
    >
      {openAiRes}
    </div>,
    {
      width: 600,
      height: 400,
      fonts: [
        {
          data: fontData,
          name: 'Roboto',
          style: 'normal',
          weight: 400,
        },
      ],
    }
  );

  // Convert SVG to PNG using Sharp
  const pngBuffer = await sharp(Buffer.from(svg)).toFormat('png').toBuffer();

  return new NextResponse(pngBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'max-age=10',
    },
  });
}
