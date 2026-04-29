'use client';

import React, { useState } from 'react';
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {ArrowDownUp, Check, Grid3x3, LayoutGrid, List, Menu} from "lucide-react";
import { cn } from "@/lib/utils";
import ProductSideModal from "@/components/public-view/common/ProductSideModal";

import { useDispatch, useSelector } from 'react-redux';
import {setViewMode} from "@/redux/slices/viewModeSlice";

const sortOptions = [
    { label: "Default", value: "default" },
    { label: "Latest", value: "latest" },
    { label: "Low → High", value: "price-low" },
    { label: "High → Low", value: "price-high" },
];

const ProductFilterNavbar = () => {
    const params = useParams();
    const slug = params?.slug as string;
    const [open, setOpen] = useState(false);


    const dispatch = useDispatch();

    const viewMode = useSelector(
        (state: any) => state.viewMode.viewMode
    );

    const [onModal, setOnModal] = React.useState(false);

    const [filters, setFilters] = useState({
        sort: "default",
    });
    const selectedLabel = sortOptions.find((item) => item.value === filters.sort)?.label;


    return (
        <div>
            <div className="bg-white rounded-lg shadow-sm p-2 sm:p-4 mb-6 flex flex-wrap items-center justify-between">

                <div className="flex items-center justify-between ">
                    <Button
                        className="flex items-center lg:hidden cursor-pointer"
                        variant="outline"
                        onClick={() => setOnModal(true)}
                    >
                        <Menu size="lg" /> <span className={"block lg:hidden"}>Show Side</span>
                    </Button>

                    <h1 className="hidden lg:block text-2xl font-bold">{slug}</h1>
                </div>

                <div className="flex items-center gap-4">

                    {/* VIEW MODE */}
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            onClick={() => dispatch(setViewMode('list'))}
                            className={cn(viewMode === 'list' && 'text-orange-500')}
                        >
                            <List />
                        </Button>

                        <Button
                            variant="ghost"
                            onClick={() => dispatch(setViewMode('grid-3'))}
                            className={cn(viewMode === 'grid-3' && 'text-orange-500')}
                        >
                            <Grid3x3 />
                        </Button>

                        <Button
                            variant="ghost"
                            onClick={() => dispatch(setViewMode('grid-4'))}
                            className={cn(viewMode === 'grid-4' && 'text-orange-500')}
                        >
                            <LayoutGrid />
                        </Button>
                    </div>

                    {/* SORT */}
                    <div className="relative">

                        {/* 🔘 BUTTON */}
                        <button
                            onClick={() => setOpen(!open)}
                            className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm bg-white"
                        >
                            {/* mobile icon only */}
                            <ArrowDownUp className="block md:hidden w-4 h-4" />

                            {/* md+ text only */}
                            <span className="hidden md:block">
                                {selectedLabel}
                            </span>
                        </button>

                        {/* 📦 DROPDOWN */}
                        {open && (
                            <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-md z-50">
                                {sortOptions.map((option) => (
                                    <div
                                        key={option.value}
                                        onClick={() => {
                                            setFilters((prev) => ({
                                                ...prev,
                                                sort: option.value,
                                            }));
                                            setOpen(false);
                                        }}
                                        className="flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                                    >
                                        {option.label}

                                        {filters.sort === option.value && (
                                            <Check className="w-4 h-4 text-green-500" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {onModal && (
                <ProductSideModal
                    openModal={onModal}
                    onChange={setOnModal}
                />
            )}
        </div>
    );
};

export default ProductFilterNavbar;