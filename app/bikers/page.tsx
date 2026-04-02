import dynamic from "next/dynamic";

const BikersRidePage = dynamic(
  () => import("@/app/components/bikers/BikersRidePage").then((mod) => mod.BikersRidePage),
  { ssr: false },
);

export default function Page() {
  return <BikersRidePage />;
}
