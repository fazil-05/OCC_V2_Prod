import dynamic from "next/dynamic";

const HomePage = dynamic(() => import("@/app/pages/HomePage"), { ssr: false });

export default function Page() {
  return <HomePage />;
}
