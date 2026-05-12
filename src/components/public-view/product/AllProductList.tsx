/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  LayoutGrid,
  LayoutList,
  ChevronDown,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useGetAllProductsQuery } from "@/redux/features/product/product.api";
import { useGetAllCategoriesQuery } from "@/redux/features/category/category.api";
import { useGetAllBrandsQuery } from "@/redux/features/brand/brand.api";
import CategoryByProductCard from "@/components/public-view/common/CategoryByProductCard";
import ProductSkeleton from "@/components/public-view/common/ProductSkeleton";
import { IProduct } from "@/types";
import { setViewMode } from "@/redux/slices/viewModeSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

const PRICE_MIN = 0;
const PRICE_MAX = 10000;

const SORT_OPTIONS = [
  { value: "default", label: "Default sorting" },
  { value: "-createdAt", label: "Newest first" },
  { value: "price", label: "Price: Low → High" },
  { value: "-price", label: "Price: High → Low" },
  { value: "-totalSold", label: "Popularity" },
  { value: "-ratings", label: "Rating" },
];

function ShopPagination({
  page,
  totalPages,
  onPage,
}: {
  page: number;
  totalPages: number;
  onPage: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  const range = 2;
  for (
    let i = Math.max(1, page - range);
    i <= Math.min(totalPages, page + range);
    i++
  )
    pages.push(i);

  return (
    <div className="flex items-center justify-center gap-1 mt-10">
      {/* Prev */}
      <button
        onClick={() => onPage(page - 1)}
        disabled={page === 1}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 text-sm text-gray-600 disabled:opacity-40 hover:border-amber-400 hover:text-amber-600 dark:border-gray-700 dark:text-gray-400 transition-colors"
      >
        ‹
      </button>

      {pages[0] > 1 && (
        <>
          <button
            onClick={() => onPage(1)}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 text-sm text-gray-600 hover:border-amber-400 hover:text-amber-600 dark:border-gray-700 dark:text-gray-400 transition-colors"
          >
            1
          </button>
          {pages[0] > 2 && <span className="text-gray-400 px-1">…</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPage(p)}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium transition-colors",
            p === page
              ? "border-amber-500 bg-amber-500 text-white"
              : "border-gray-200 text-gray-600 hover:border-amber-400 hover:text-amber-600 dark:border-gray-700 dark:text-gray-400",
          )}
        >
          {p}
        </button>
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && (
            <span className="text-gray-400 px-1">…</span>
          )}
          <button
            onClick={() => onPage(totalPages)}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 text-sm text-gray-600 hover:border-amber-400 hover:text-amber-600 dark:border-gray-700 dark:text-gray-400 transition-colors"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next */}
      <button
        onClick={() => onPage(page + 1)}
        disabled={page === totalPages}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 text-sm text-gray-600 disabled:opacity-40 hover:border-amber-400 hover:text-amber-600 dark:border-gray-700 dark:text-gray-400 transition-colors"
      >
        ›
      </button>
    </div>
  );
}

function SidebarContent({
  priceRange,
  onPriceChange,
  onPriceApply,
  brands,
  selectedBrand,
  onBrandChange,
  categories,
  selectedCategory,
  onCategoryChange,
}: {
  priceRange: [number, number];
  onPriceChange: (v: [number, number]) => void;
  onPriceApply: () => void;

  brands: any[];
  selectedBrand: string;
  onBrandChange: (id: string) => void;


  categories: any[];
  selectedCategory: string;
  onCategoryChange: (id: string) => void; 
}) {
  return (
        <div className="space-y-6">
      {/* ================= PRICE FILTER ================= */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Filter By Price</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Slider
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={50}
            value={priceRange}
            onValueChange={(v) => onPriceChange(v as [number, number])}
          />

          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Price:{" "}
              <span className="font-semibold text-gray-900 dark:text-gray-50">
                ৳ {priceRange[0]}
              </span>{" "}
              —{" "}
              <span className="font-semibold text-gray-900 dark:text-gray-50">
                ৳ {priceRange[1]}
              </span>
            </p>

            <Button
              size="sm"
              onClick={onPriceApply}
              className="h-7 rounded-full bg-amber-500 px-3 text-xs text-white hover:bg-amber-600"
            >
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

     <Card className="overflow-hidden">
      <CardContent className="p-0">
        <Accordion
          type="single"
          collapsible
          defaultValue={"brands"}
          className="w-full"
        >
          {/* ================= BRAND FILTER ================= */}
          <AccordionItem value="brands" className="border-b">
            <AccordionTrigger
              className="
                px-4 py-3 text-sm font-bold
                hover:bg-gray-100 dark:hover:bg-gray-800
                cursor-pointer
                transition-colors
                no-underline hover:no-underline
              "
            >
              Filter By Brands
            </AccordionTrigger>

            <AccordionContent className="px-4 pb-4 h-full pt-2 space-y-1.5">
             <ScrollArea className="space-y-1.5 max-h-72 overflow-y-auto">
               {/* All Brands */}
              <button
                onClick={() => onBrandChange("")}
                className={cn(
                  "flex w-full items-center rounded-lg px-2 py-1.5 text-sm transition-all cursor-pointer",
                  !selectedBrand
                    ? "bg-amber-50 font-semibold text-amber-600 dark:bg-amber-900/20"
                    : "text-gray-600 hover:bg-gray-100 hover:text-amber-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-amber-400"
                )}
              >
                All Brands
              </button>

              {/* Brand List */}
              {brands?.map((brand: any) => (
                <button
                  key={brand.slug}
                  onClick={() => onBrandChange(brand.slug)}
                  className={cn(
                    "flex w-full items-center rounded-lg px-2 py-1.5 text-sm transition-all cursor-pointer",
                    selectedBrand === brand.slug
                      ? "bg-amber-50 font-semibold text-amber-600 dark:bg-amber-900/20"
                      : "text-gray-600 hover:bg-gray-100 hover:text-amber-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-amber-400"
                  )}
                >
                  {brand.title}
                </button>
              ))}
             </ScrollArea>
            </AccordionContent>
          </AccordionItem>

          {/* ================= CATEGORY FILTER ================= */}
          <AccordionItem value="categories" className="border-none">
            <AccordionTrigger
              className="
                px-4 py-3 text-sm font-bold
                hover:bg-gray-100 dark:hover:bg-gray-800
                cursor-pointer
                transition-colors
                no-underline hover:no-underline
              "
            >
              Filter By Categories
            </AccordionTrigger>

            <AccordionContent className="px-4 pb-4 h-full pt-2 space-y-1.5">
             <ScrollArea className="space-y-1.5 max-h-72 overflow-y-auto">
               {/* All Categories */}
              <button
                onClick={() => onCategoryChange("")}
                className={cn(
                  "flex w-full items-center rounded-lg px-2 py-1.5 text-sm transition-all cursor-pointer",
                  !selectedCategory
                    ? "bg-amber-50 font-semibold text-amber-600 dark:bg-amber-900/20"
                    : "text-gray-600 hover:bg-gray-100 hover:text-amber-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-amber-400"
                )}
              >
                All Categories
              </button>

              {/* Category List */}
              {categories?.map((category: any) => (
                category.productCount > 0 && (
                  <button
                    key={category._id}
                    onClick={() => onCategoryChange(category.slug)}
                    className={cn(
                      "flex w-full items-center rounded-lg px-2 py-1.5 text-sm transition-all cursor-pointer",
                      selectedCategory === category.slug
                        ? "bg-amber-50 font-semibold text-amber-600 dark:bg-amber-900/20"
                        : "text-gray-600 hover:bg-gray-100 hover:text-amber-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-amber-400"
                    )}
                  >
                    {category.title}
                  </button>
                )
              ))}
             </ScrollArea>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
    </div>
  );
}

export default function AllProductList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = new URLSearchParams(searchParams.toString());

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const [sort, setSort] = useState("default");
  const dispatch = useAppDispatch();
  const viewMode = useAppSelector((state) => state.viewMode.viewMode);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    PRICE_MIN,
    PRICE_MAX,
  ]);
  const [appliedPrice, setAppliedPrice] = useState<[number, number]>([
    PRICE_MIN,
    PRICE_MAX,
  ]);
  const searchQuery = searchParams.get("search") ?? "";
  const brandQuery = searchParams.get("brand") ?? "";
  const categoryQuery = searchParams.get("category") ?? "";

  const [selectedBrand, setSelectedBrand] = useState(brandQuery);
  const [selectedCategory, setSelectedCategory] = useState(categoryQuery);

  

  const queryArgs: any = {
    page,
    limit: perPage,
    ...(sort !== "default" && { sort }),
    ...(searchQuery && { searchTerm: searchQuery }),
    ...(selectedBrand && { brand: selectedBrand }),
    ...(selectedCategory && { category: selectedCategory }),
    ...(appliedPrice[0] > PRICE_MIN && { "price[gte]": appliedPrice[0] }),
    ...(appliedPrice[1] < PRICE_MAX && { "price[lte]": appliedPrice[1] }),
  };

  const { data: productsData, isLoading, isError,} = useGetAllProductsQuery(queryArgs);
  const { data: categoriesData } = useGetAllCategoriesQuery({ limit: 100 });
  const { data: brandsData } = useGetAllBrandsQuery({ limit: 100 });

  const products: IProduct[] = productsData?.data ?? [];
  const totalCount = productsData?.meta?.total ?? 0;
  const totalPages =
    productsData?.meta?.totalPage ?? Math.ceil(totalCount / perPage);
  const categories = categoriesData?.data ?? [];
  const brands = brandsData?.data ?? [];


  const handlePriceApply = useCallback(() => {
    setAppliedPrice(priceRange);
    setPage(1);

    // remove old brand/category filters
    params.delete("brand");
    params.delete("category");



    if (priceRange[0] > PRICE_MIN) {
      params.set("price[gte]", String(priceRange[0]));
    } else {
      params.delete("price[gte]");
    }

    if (priceRange[1] < PRICE_MAX) {
      params.set("price[lte]", String(priceRange[1]));
    } else {
      params.delete("price[lte]");
    }

    router.push(`/shop?${params.toString()}`);
  }, [priceRange, router, params]);

  const handleBrandChange = (slug: string) => {
    setSelectedBrand(slug);
    setSelectedCategory("");
    setPage(1);

    if (slug) params.set("brand", slug);
    else params.delete("brand");

    params.delete("category");

    router.push(`/shop?${params.toString()}`);
  };


  const handleCategoryClick = (slug: string) => {
    const newCategory = selectedCategory === slug ? "" : slug;

    setSelectedCategory(newCategory);
    setSelectedBrand("");
    setPage(1);

    if (newCategory) params.set("category", newCategory);
    else params.delete("category");

    params.delete("brand");

    router.push(`/shop?${params.toString()}`);
  };

  const showing1 = (page - 1) * perPage + 1;
  const showing2 = Math.min(page * perPage, totalCount);


  useEffect(() => {
    setSelectedCategory(categoryQuery);
  }, [categoryQuery]);

  useEffect(() => {
    setSelectedBrand(brandQuery);
  }, [brandQuery]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-350 px-4 py-6 sm:px-6 lg:px-8">
        {/* ── Breadcrumb + count ── */}
        <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <nav className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
            <Link
              href="/"
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              Home
            </Link>
            <span>/</span>
            <span className="font-medium text-gray-900 dark:text-gray-50">
              Shop
            </span>
            {searchQuery && (
              <>
                <span>/</span>
                <span className="font-medium text-amber-600 dark:text-amber-400">
                  &quot;{searchQuery}&quot;
                </span>
              </>
            )}
          </nav>
          {totalCount > 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing {showing1}–{showing2} of {totalCount} results
            </p>
          )}
        </div>

        {/* ── Category scroll row ── */}
        {categories.length > 0 && (
          <div className="mb-6 mt-5 overflow-x-auto">
            <div
              className="flex gap-4 p-2"
              style={{ minWidth: "max-content" }}
            >
              {categories.map((cat:any) => (
                cat.productCount > 0 && (
                  <>
                    <button
                      key={cat?.slug}
                      onClick={() => handleCategoryClick(cat.slug)}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-xl cursor-pointer p-3 text-center transition-all duration-200 min-w-22.5",
                        selectedCategory === cat.slug
                          ? "bg-amber-50 ring-2 ring-amber-400 dark:bg-amber-900/20"
                          : "bg-gray-50 hover:bg-amber-50/60 dark:bg-gray-900 dark:hover:bg-amber-900/10",
                      )}
                    >
                      {/* Category image */}
                      <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-white shadow-sm dark:bg-gray-800">
                        {cat.image?.[0] ? (
                          <Image src={cat.image ?? ""} alt={cat.title ?? ""} fill priority quality={90} sizes="64px" className="object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-gray-300 text-xs">?</div>
                        )}
                      </div>
                      <p className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 leading-none">
                        {cat.title}
                      </p>
                      {cat.productCount !== undefined && (
                        <p className="text-[10px] text-gray-400 leading-0">
                          {cat.productCount} products
                        </p>
                      )}
                    </button>
                  </>
                )
              ))}
            </div>
          </div>
        )}

        {/* ── Main layout: Sidebar + Products ── */}
        <div className="flex gap-6">
          {/* ── Desktop Sidebar ── */}
          <aside className="hidden lg:block w-52 xl:w-60 shrink-0 space-y-4">
            <SidebarContent
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              onPriceApply={handlePriceApply}
              brands={brands}
              selectedBrand={selectedBrand}
              onBrandChange={handleBrandChange}
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryClick}
            />
          </aside>

          {/* ── Products area ── */}
          <div className="flex-1 min-w-0">
            {/* ── Shop header bar ── */}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-gray-900 dark:text-gray-50">
                  Shop
                </h1>

                {/* Mobile filter trigger */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="lg:hidden gap-1.5 rounded-lg text-xs h-8"
                    >
                      <SlidersHorizontal className="h-3.5 w-3.5" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-72 p-4">
                    <h2 className="mb-4 text-base font-bold">Filters</h2>
                    <SidebarContent
                      priceRange={priceRange}
                      onPriceChange={setPriceRange}
                      onPriceApply={handlePriceApply}
                      brands={brands}
                      selectedBrand={selectedBrand}
                      onBrandChange={handleBrandChange}

                      categories={categories}
                      selectedCategory={selectedCategory}
                      onCategoryChange={handleCategoryClick}
                    />
                  </SheetContent>
                </Sheet>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Show per page */}
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <span>Show:</span>
                  {[9, 12, 18, 24].map((n) => (
                    <button
                      key={n}
                      onClick={() => {
                        setPerPage(n);
                        setPage(1);
                      }}
                      className={cn(
                        "h-7 w-7 rounded text-xs font-medium transition-colors",
                        perPage === n
                          ? "bg-amber-500 text-white"
                          : "text-gray-600 hover:text-amber-600 dark:text-gray-400 dark:hover:text-amber-400",
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>

                {/* View toggles */}
                <div className="flex items-center gap-1 rounded-lg border border-gray-200 p-0.5 dark:border-gray-700">
                  <button
                    onClick={() => dispatch(setViewMode("list"))}
                    className={cn(
                      "rounded p-1.5 transition-colors",
                        viewMode === "list"
                        ? "bg-amber-500 text-white"
                        : "text-gray-400 hover:text-amber-500",
                    )}
                  >
                    <LayoutList className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => dispatch(setViewMode("grid-3"))}
                    className={cn(
                      "rounded p-1.5 transition-colors",
                        viewMode === "grid-3"
                        ? "bg-amber-500 text-white"
                        : "text-gray-400 hover:text-amber-500",
                    )}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  {/* 3-col grid icon */}
                  <button
                    onClick={() => dispatch(setViewMode("grid-4"))}
                    className="rounded p-1.5 text-gray-300 hover:text-amber-500 transition-colors"
                  >
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <rect x="0" y="0" width="4" height="4" rx="0.5" />
                      <rect x="6" y="0" width="4" height="4" rx="0.5" />
                      <rect x="12" y="0" width="4" height="4" rx="0.5" />
                      <rect x="0" y="6" width="4" height="4" rx="0.5" />
                      <rect x="6" y="6" width="4" height="4" rx="0.5" />
                      <rect x="12" y="6" width="4" height="4" rx="0.5" />
                      <rect x="0" y="12" width="4" height="4" rx="0.5" />
                      <rect x="6" y="12" width="4" height="4" rx="0.5" />
                      <rect x="12" y="12" width="4" height="4" rx="0.5" />
                    </svg>
                  </button>
                </div>

                {/* Sort */}
                <Select
                  value={sort}
                  onValueChange={(v) => {
                    setSort(v);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="h-9 w-44 rounded-lg border-gray-200 bg-gray-50/60 text-xs dark:border-gray-700 dark:bg-gray-800/60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {SORT_OPTIONS.map((o) => (
                      <SelectItem
                        key={o.value}
                        value={o.value}
                        className="cursor-pointer text-sm"
                      >
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* ── Product grid ── */}
            {isLoading ? (
              <ProductSkeleton />
            ) : isError ? (
              <p className="text-center text-red-500 py-12">
                Something went wrong. Please try again.
              </p>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  No products found
                </p>
                <p className="text-sm text-gray-400">
                  Try adjusting your filters or search term
                </p>
                {(selectedBrand ||
                  selectedCategory ||
                  appliedPrice[0] > PRICE_MIN ||
                  appliedPrice[1] < PRICE_MAX) && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedBrand("");
                      setSelectedCategory("");
                      setPriceRange([PRICE_MIN, PRICE_MAX]);
                      setAppliedPrice([PRICE_MIN, PRICE_MAX]);
                      setPage(1);
                    }}
                    className="mt-2 rounded-full"
                  >
                    Clear all filters
                  </Button>
                )}
              </div>
            ) : (
              <div
                className={cn(
                  "grid gap-4",
                  viewMode === "grid-3"
                    ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                    : viewMode === "grid-4"
                      ? "grid-cols-2 sm:grid-cols-3 xl:grid-cols-4"
                      : "grid-cols-1",
                )}
              >
                {products.map((product) => (
                  <CategoryByProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* ── Pagination ── */}
            <ShopPagination
              page={page}
              totalPages={totalPages}
              onPage={(p) => {
                setPage(p);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
