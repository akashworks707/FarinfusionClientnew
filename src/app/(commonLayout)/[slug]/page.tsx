import StoreDetails from "@/components/public-view/stores/StoreDetails";
import { STORES, getStoreBySlug } from "@/data/stores-data";

export function generateStaticParams() {
  return STORES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const store = getStoreBySlug(params.slug);

  if (!store) {
    return {
      title: "Store Not Found | Farin Fusion",
      description: "This store does not exist.",
    };
  }

  return {
    title: `${store.name} Store | Farin Fusion`,
    description: store.description?.slice(0, 150),
    keywords: [store.name, "store", "Farin Fusion", "shop"],
    openGraph: {
      title: `${store.name} Store`,
      description: store.description?.slice(0, 150),
      images: [
        {
          url: store.thumbnail || "/default-store.jpg",
        },
      ],
      type: "website",
    },
  };
}

export default async function StoreDetailPage({params}: {
  params: { slug: string };
}) {

    const {slug} = await params
  return <StoreDetails slug={slug} />
}
