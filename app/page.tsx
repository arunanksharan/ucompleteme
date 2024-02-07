import Image from 'next/image';
import { Inter } from '@next/font/google';
import styles from './page.module.css';
import { Metadata } from 'next';
import { homeImageUrl, openApiTextCompleteUrl } from '@/constants/urls';

const inter = Inter({ subsets: ['latin'] });

// generateMetadata
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'UCompleteMe',
    description: 'One Click Fun!',
    openGraph: {
      title: 'UCompleteMe',
      images: [homeImageUrl],
    },
    other: {
      'fc:frame': 'vNext',
      'fc:frame:image': homeImageUrl,
      'fc:frame:post_url': openApiTextCompleteUrl,
      'fc:frame:input:text': '',
      'fc:frame:button:1': 'Complete Me',
    },
  };
}

export default function Home() {
  return (
    <main className="">
      <img src="/images/welcome.png" alt="welcome to ucomplteme"></img>
    </main>
  );
}
