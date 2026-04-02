import dynamic from "next/dynamic";

const PhotographyPage = dynamic(
  () => import("@/app/components/photography/PhotographyPage").then((mod) => mod.PhotographyPage),
  { ssr: false },
);

export default function Page() {
  return <PhotographyPage />;
}
