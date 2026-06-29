import { CollectionsPageClient } from "@/components/CollectionsPageClient";

function normalizeSearchParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] || "All";
  return value || "All";
}

export default async function CollectionsPage({
  searchParams
}: {
  searchParams: Promise<{ category?: string | string[]; occasion?: string | string[] }>;
}) {
  const resolvedSearchParams = await searchParams;
  const categoryFromQuery = normalizeSearchParam(resolvedSearchParams.category);
  const occasionFromQuery = normalizeSearchParam(resolvedSearchParams.occasion);

  return <CollectionsPageClient categoryFromQuery={categoryFromQuery} occasionFromQuery={occasionFromQuery} />;
}
