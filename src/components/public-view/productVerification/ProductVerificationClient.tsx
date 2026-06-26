/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback, useMemo } from "react";
import { useGetAllProductVerificationsQuery } from "@/redux/features/productVerification/productVerification.api";
import { ProductVerificationCategories } from "./ProductVerificationCategories";
import { FeaturedVerification } from "./FeaturedVerification";
import { IProductVerification } from "@/types/productVerification";
import { HeroSkeleton, SidebarSkeleton } from "./VerificationSkeleton";
import { ProductVerificationSearch } from "./ProductVerificationSearch";
import { ProductVerificationHero } from "./ProductVerificationHero";
import { VerificationGrid } from "./VerificationGrid";
import { VerificationSidebar } from "./VerificationSidebar";
import { VerificationViewerModal } from "./VerificationViewerModal";

export const ITEMS_PER_PAGE = 10;

export default function ProductVerificationClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [mediaType, setMediaType] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [selectedVerification, setSelectedVerification] =
    useState<IProductVerification | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setPage(1);
  }, []);

  const handleCategoryChange = useCallback((cat: string) => {
    setCategory(cat);
    setPage(1);
  }, []);

  const handleMediaTypeChange = useCallback((type: string) => {
    setMediaType(type);
    setPage(1);
  }, []);

  const handleSortChange = useCallback((sortBy: string) => {
    setSort(sortBy);
    setPage(1);
  }, []);

  const handleReset = useCallback(() => {
    setSearchTerm("");
    setCategory("");
    setMediaType("");
    setSort("newest");
    setPage(1);
  }, []);

  const handleWatchClick = useCallback((verification: IProductVerification) => {
    setSelectedVerification(verification);
    setOpenModal(true);
  }, []);

  // Fetch data with query params
  const {
    data: productVerificationData,
    isLoading,
    isFetching,
  } = useGetAllProductVerificationsQuery({
    page,
    limit: ITEMS_PER_PAGE,
    ...(searchTerm && { searchTerm }),
    ...(mediaType && { mediaType: mediaType as any }),
  });

  const verifications = useMemo(
    () => productVerificationData?.data?.data || [],
    [productVerificationData],
  );

  const featuredVerifications = useMemo(
    () => verifications.filter((v: IProductVerification) => v.featured),
    [verifications],
  );

  const featured =
    featuredVerifications.length > 0 ? featuredVerifications[0] : null;

  return (
    <div className="">
      {/* Hero Section */}
      <section className="bg-linear-to-br from-amber-50 via-orange-50 to-amber-100 dark:from-slate-900 dark:via-amber-950 dark:to-slate-900 pt-8 pb-12">
        <div className="container mx-auto px-4">
          {isLoading ? <HeroSkeleton /> : <ProductVerificationHero />}
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {/* Categories */}
          <div className="mb-8">
            {isLoading ? (
              <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            ) : (
              <ProductVerificationCategories
                selected={category}
                onSelect={handleCategoryChange}
              />
            )}
          </div>

          {/* Search & Filters */}
          {isLoading ? (
            <div className="space-y-4 mb-8">
              <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
              <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            </div>
          ) : (
            <div className="mb-8">
              <ProductVerificationSearch
                onSearch={handleSearch}
                onMediaTypeChange={handleMediaTypeChange}
                onSortChange={handleSortChange}
                onReset={handleReset}
                searchValue={searchTerm}
                mediaType={mediaType}
                sort={sort}
              />
            </div>
          )}

          {/* Featured Section */}
          {featured && !isLoading && (
            <div className="mb-12">
              <FeaturedVerification
                verification={featured}
                onWatch={handleWatchClick}
              />
            </div>
          )}

          {/* Grid with Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <VerificationGrid
                verifications={verifications}
                isLoading={isLoading || isFetching}
                onWatch={handleWatchClick}
                onReset={handleReset}
              />

              {/* Pagination */}
              {!isLoading && productVerificationData?.meta && (
                <div className="flex justify-center gap-2 mt-8">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-50 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from(
                      {
                        length: Math.ceil(
                          (productVerificationData?.meta?.total || 0) / 12,
                        ),
                      },
                      (_, i) => i + 1,
                    )
                      .slice(Math.max(0, page - 3), page + 2)
                      .map((p) => (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`px-3 py-2 rounded-lg ${
                            page === p
                              ? "bg-amber-600 text-white"
                              : "border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                  </div>
                  <button
                    onClick={() =>
                      setPage((p) =>
                        Math.min(
                          Math.ceil(
                            (productVerificationData?.meta?.total || 0) / 12,
                          ),
                          p + 1,
                        ),
                      )
                    }
                    disabled={
                      page >=
                      Math.ceil(
                        (productVerificationData?.meta?.total || 0) / 12,
                      )
                    }
                    className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-50 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div>
              {isLoading ? (
                <SidebarSkeleton />
              ) : (
                <VerificationSidebar
                  allVerifications={verifications}
                  onSelectVerification={handleWatchClick}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      <VerificationViewerModal
        verification={selectedVerification}
        open={openModal}
        onOpenChange={setOpenModal}
      />
    </div>
  );
}
