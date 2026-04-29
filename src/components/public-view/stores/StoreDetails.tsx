"use client"

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Phone, ShoppingCart, Store, ParkingSquare, Accessibility, ChevronLeft } from "lucide-react";
import { STORES, getStoreBySlug } from "@/data/stores-data";

function TagButton({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
      {children}
    </span>
  );
}

function FacilityIcon({ id }: { id: string }) {
  if (id === "parking")
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-sm font-bold text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        P
      </div>
    );
  if (id === "disabled-parking")
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-sm dark:border-gray-700 dark:bg-gray-800">
        <Accessibility className="h-4 w-4 text-gray-600 dark:text-gray-400" />
      </div>
    );
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-sm dark:border-gray-700 dark:bg-gray-800">
      <Accessibility className="h-4 w-4 text-gray-600 dark:text-gray-400" />
    </div>
  );
}

export default function StoreDetails({
  slug,
}: { slug: string }) {
  const store = getStoreBySlug(slug);
  if (!store) notFound();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 mx-auto max-w-352 px-4 py-10 sm:px-6 lg:px-8">

      <section className="relative h-[280px] rounded-md w-full overflow-hidden sm:h-[360px] md:h-[420px] lg:h-[480px]">
        <Image
          src={store.heroBanner}
          alt={store.name}
          fill
          sizes="100vw"
          className="object-cover object-center rounded-md"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Text overlay */}
        <div className="absolute bottom-0 left-0 px-5 py-8 sm:px-8 md:px-12">
          <p className="text-sm font-medium text-white/80">{store.address}</p>
          <h1 className="mt-1 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            {store.name}
          </h1>
        </div>
      </section>

      <div className="border-b border-gray-100 dark:border-gray-800">
        <div className="">
          <nav className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <Link href="/" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/stores" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Stores</Link>
            <span>/</span>
            <span className="font-medium text-gray-900 dark:text-gray-50">{store.name}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-352 py-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
            <iframe
              src={store.mapEmbedUrl}
              title={`Map of ${store.name}`}
              width="100%"
              height="320"
              className="block w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            {/* Map attribution footer */}
            <div className="border-t border-gray-100 px-3 py-2 dark:border-gray-800">
              <p className="text-[10px] text-gray-400 dark:text-gray-500">
                © <a href="https://www.openstreetmap.org/copyright" className="underline hover:text-gray-600 dark:hover:text-gray-300" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900 space-y-5">
            {/* Section title */}
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-50">
              Address
            </h2>

            {/* Address row */}
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20">
                <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="pt-1.5 text-sm text-gray-700 dark:text-gray-300">
                {store.address}
              </p>
            </div>

            {/* Phone row */}
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20">
                <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="pt-1.5 text-sm text-gray-700 dark:text-gray-300">
                {store.phone}
              </p>
            </div>

            {/* Tag buttons */}
            <div className="flex flex-wrap gap-2 pt-1">
              {store.tags.map((tag) => (
                <TagButton key={tag}>
                  {tag === "Store" && <ShoppingCart className="h-3.5 w-3.5" />}
                  {tag === "Delivery Point" && <Store className="h-3.5 w-3.5" />}
                  {tag}
                </TagButton>
              ))}
            </div>

            {/* Description */}
            <div className="border-t border-gray-100 pt-4 dark:border-gray-800 space-y-3">
              {store.description.split("\n\n").map((para, i) =>
                para.trim() === "Get Help" ? (
                  <a
                    key={i}
                    href="#"
                    className="block text-sm font-medium text-blue-600 italic hover:underline dark:text-blue-400"
                  >
                    Get Help
                  </a>
                ) : (
                  <p key={i} className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    {para}
                  </p>
                )
              )}
            </div>
          </div>

          {/* ── Column 3: Hours + Facilities ── */}
          <div className="space-y-3">
            {/* Hours card */}
            <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
              <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-gray-50">
                Hours
              </h2>
              <div className="space-y-2">
                {store.hours.map(({ day, hours, weekend }) => (
                  <div
                    key={day}
                    className="flex items-center justify-between gap-2"
                  >
                    <span
                      className={
                        weekend
                          ? "text-sm font-medium text-orange-500"
                          : "text-sm text-gray-700 dark:text-gray-300"
                      }
                    >
                      {day}
                    </span>
                    <span
                      className={
                        weekend
                          ? "text-sm text-orange-500 tabular-nums"
                          : "text-sm text-gray-600 tabular-nums dark:text-gray-400"
                      }
                    >
                      {hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Store facilities card */}
            <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
              <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-gray-50">
                Store facilities
              </h2>
              <div className="flex flex-wrap gap-3">
                {store.facilities.map((facility) => (
                  <div key={facility.id} title={facility.label}>
                    <FacilityIcon id={facility.id} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Back to stores link ── */}
        <div className="mt-10 flex">
          <Link
            href="/stores"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to all stores
          </Link>
        </div>
      </div>
    </div>
  );
}