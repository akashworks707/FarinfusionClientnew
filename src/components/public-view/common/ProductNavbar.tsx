/* eslint-disable @typescript-eslint/ban-ts-comment */
'use client'
// import React, { useState} from 'react';
import ProductFilterToolbar from "@/components/public-view/common/ProductFilterToolbar";
import ProductFilterNavbar from "@/components/public-view/common/ProductFilterNavbar";
import {useParams} from "next/navigation";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store";
import ShopBreadCrumb from "@/components/public-view/common/ShopBreadCrumb";

// @ts-ignore
const ProductNavbar = ({ children }) => {
    const params = useParams();
    const slug = params?.slug as string;
    const viewMode = useSelector((state:RootState) => state.viewMode.viewMode)

    return (
        <div className={"container mx-auto px-5 py-5 sm:py-10"}>
            <ShopBreadCrumb
                BreadcrumbTitle="Shop"
                BreadCrumbLink="/shop"
                BreadCrumbPage={slug}
            />

            <div className={"lg:flex flex-wrap gap-8 mt-5"}>
                <div className={"w-60 hidden lg:block"}>
                    <ProductFilterToolbar />
                </div>

                <div className={"flex-1"}>
                    <ProductFilterNavbar />

                    <div
                        className={`grid gap-6 ${
                            viewMode === 'list'
                                ? 'grid-cols-1'
                                : viewMode === 'grid-3'
                                    ? 'grid-cols-2 sm:grid-cols-3'
                                    : 'grid-cols-2 sm:grid-cols-4'
                        }`}
                    >
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ProductNavbar;