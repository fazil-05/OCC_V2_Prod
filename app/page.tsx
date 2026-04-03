import dynamic from "next/dynamic";
import { BackgroundFramePreloader } from "@/components/BackgroundFramePreloader";

const HomePage = dynamic(() => import("@/app/pages/HomePage"), { ssr: false });

export default function Page() {
  return (
    <>
      <BackgroundFramePreloader />
      <HomePage />
    </>
  );
}
