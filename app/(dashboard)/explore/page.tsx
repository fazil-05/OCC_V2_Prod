import ClubsPage from "@/../app/(dashboard)/clubs/page";

export default function ExplorePage({ searchParams }: { searchParams: { q?: string } }) {
  return <ClubsPage searchParams={searchParams} />;
}
