import { notFound } from "next/navigation";
import { fetchMenuCardByHref, fetchMenuItemsByCardId, fetchSiteSettings } from "../../lib/supabase-public";
import CategoryPageClient from "./CategoryPageClient";

type CategoryPageProps = {
  params: Promise<{
    slug?: string[];
  }>;
  searchParams: Promise<{
    lang?: string | string[];
  }>;
};

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const resolvedParams = await params;
  await searchParams;
  const href = `/${(resolvedParams.slug ?? []).join("/")}`;

  if (href === "/") {
    notFound();
  }

  const category = await fetchMenuCardByHref(href);
  if (!category) {
    notFound();
  }

  const items = await fetchMenuItemsByCardId(category.id);
  const siteSettings = await fetchSiteSettings();
  return <CategoryPageClient category={category} items={items} siteSettings={siteSettings} />;
}
