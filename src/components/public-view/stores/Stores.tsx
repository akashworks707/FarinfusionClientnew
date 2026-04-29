"use client"

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Store, Settings, ArrowRight, MapPin, ChevronUp, ChevronDown } from "lucide-react";
import {useState} from "react"
import { STORES } from "@/data/stores-data";
import { Button } from '@/components/ui/button';

const FEATURES = [
  {
    icon: ShoppingCart,
    label: "Convenient store",
  },
  {
    icon: Store,
    label: "Delivery point",
  },
  {
    icon: Settings,
    label: "Service center",
  },
];

function StoreCard({ store }: { store: (typeof STORES)[number] }) {
  return (
    <Link
      href={`/${store.slug}`}
      className="group relative block overflow-hidden rounded-xl"
    >
      {/* Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
        <Image
          src={store.thumbnail}
          alt={store.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg font-bold text-white leading-tight">
            {store.name}
          </h3>
          {/* Amber "View Store" button */}
          <div className="mt-3">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-500 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors duration-200 group-hover:bg-amber-400">
              View Store
              <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Stores() {
    const [expanded, setExpanded] = useState(false);

    const MAX_LENGTH = 120;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 py-10 md:py-12">

      {/* ── HERO BANNER ── */}
      <section className="mx-auto max-w-352 px-4 sm:px-6 lg:px-8 bg-[#2d5be3] dark:bg-[#1e3fa0] py-10 rounded-md">
        <div className="">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center">

            {/* Left — text + features */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-white sm:text-4xl">
                  Visit Our Stores
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-blue-100/90">
                  You can receive an order from us, find many products with
                  unique discounts, and also, if necessary, contact the service
                  center.
                </p>
              </div>

              {/* Feature icon boxes */}
              <div className="flex flex-wrap gap-3">
                {FEATURES.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2.5 rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm transition-colors hover:bg-white/15"
                  >
                    <Icon className="h-5 w-5 shrink-0 text-white" />
                    <span className="text-sm font-semibold text-white">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center md:justify-end">
              <div className="relative h-52 w-full max-w-sm md:h-64 md:max-w-md">
                <Image
                  src="https://farinfusion.dotskillsbd.com/wp-content/uploads/2023/01/stores-header-img-opt.jpg"
                  alt="Store illustration"
                  fill
                  sizes="(max-width: 768px) 384px, 448px"
                  className="object-contain drop-shadow-xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <div className="mx-auto max-w-352 pt-14 space-y-14">

        {/* ── About section ── */}
        <section className="space-y-5">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            Online Store of Household Appliances and Electronics
          </h2>
          <div className="space-y-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            <p>
              The online store of equipment and electronics is one of the leading
              online stores. The band was released in 25 volumes. During this
              time, our team sent 228 cypemapkets and managed to create a
              powerful, fast-working online store. The range of online supply
              points is huge and covers all company categories available for
              convenience stores.
            </p>
            <p>
              In 2019, we presented a new border policy strategy that covers all
              aspects of the company's activities – corporate style, delivery, and
              consultant work.
            </p>
          </div>
        </section>

        {/* ── Store cards grid ── */}
        <section>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STORES.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        </section>

        {/* ── Article content ── */}
        <section className="space-y-6 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          <div className="space-y-3">
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-50">
              A wonderful serenity has taken possession of my entire soul
            </h3>
            <p>
              I should be incapable of drawing a single stroke at the present
              moment; and yet I feel that I never was a greater artist than now.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-50">
              When, while the lovely valley teems with vapour around me
            </h3>
            <p>
              little world among the stalks, and grow familiar with the countless
              indescribable forms of the insects and flies, then I feel the
              presence of the Almighty, who formed us in his own image, and the
              breath of that universal love which bears and sustains us, as it
              floats around us in an eternity of bliss; and then, my friend, when
              darkness overspreads my eyes, and heaven and earth seem to dwell in
              my soul.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-50">
              Online shopping that really is convenient
            </h3>
            <p>
              The car parts and everything you may need for repairs and regular
              maintenance of your vehicle are listed in a convenient and
              comprehensive catalogue. The innovative search - by name, item ID
              or OEM number will help you to find automotive parts easily.
            </p>
            <p>
              You can choose whichever payment method is most convenient for you
              from among the various options. Have any questions? Our support
              service specialists are always on hand to help. Picking and buying
              car parts with us is an enjoyable experience!
            </p>
          </div>
        </section>

        {/* ── Collapsible bottom section ── */}
        <section className="rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900 space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">
            Online store of household appliances and electronics
          </h2>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            Then the question arises: where's the content? Not there yet? That's
            not so bad, there's dummy copy to the rescue. But worse, what if the
            fish doesn't fit in the can, the foot's too big for the boot? Or to
            small? To short sentences, to many headings, images too large for the
            proposed design, or too small, or they fit in but it looks iffy for
            reasons.
          </p>
          {expanded && (
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            A client that's unhappy for a reason is a problem, a client that's
            unhappy though he or her can't quite put a finger on it is worse.
            Chances are there wasn't collaboration, communication, and
            checkpoints, there wasn't a process agreed upon or specified with the
            granularity required.
          </p>
          )}


    <Button
    variant={"default"}
      onClick={() => setExpanded(!expanded)}
      className="flex items-center gap-1 bg-gray-200 hover:text-amber-300 hover:cursor-pointer text-sm font-medium text-primary hover:underline"
    >
      {expanded ? "Read Less" : "Read More"}

      {expanded ? (
        <ChevronUp className="w-4 h-4" />
      ) : (
        <ChevronDown className="w-4 h-4" />
      )}
    </Button>
        </section>
      </div>
    </div>
  );
}