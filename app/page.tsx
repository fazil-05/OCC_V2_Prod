import { BackgroundFramePreloader } from "@/components/BackgroundFramePreloader";
import { LandingRoutePrefetch } from "@/components/LandingRoutePrefetch";
import HomePage from "@/app/pages/HomePage";

export default function Page() {
  return (
    <>
      <LandingRoutePrefetch />
      <BackgroundFramePreloader />
      <HomePage />
    </>
  );
}
