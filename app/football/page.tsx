import dynamic from "next/dynamic";

const FootballPage = dynamic(
  () => import("@/app/components/football/FootballPage").then((mod) => mod.FootballPage),
  { ssr: false },
);

export default function Page() {
  return <FootballPage />;
}
