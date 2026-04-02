import dynamic from "next/dynamic";

const FashionPage = dynamic(
  () => import("@/app/components/fashion/FashionPage").then((mod) => mod.FashionPage),
  { ssr: false },
);

export default function Page() {
  return <FashionPage />;
}
