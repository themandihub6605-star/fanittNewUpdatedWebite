import { Hero } from '@/sections/Hero';
import { Roles } from '@/sections/Roles';
import { Store } from '@/sections/Store';
import { Campaigns } from '@/sections/Campaigns';
import { Community } from '@/sections/Community';
import { Trust } from '@/sections/Trust';
import { ScreensStrip } from '@/sections/ScreensStrip';
import { HomeFaq } from '@/sections/HomeFaq';
import { Cta } from '@/sections/Cta';
import { usePageTitle } from '@/components/usePageTitle';

export default function Home() {
  usePageTitle();
  return (
    <>
      <Hero />
      <Roles />
      <Store />
      <Campaigns />
      <Community />
      <Trust />
      <ScreensStrip />
      <HomeFaq />
      <Cta />
    </>
  );
}
