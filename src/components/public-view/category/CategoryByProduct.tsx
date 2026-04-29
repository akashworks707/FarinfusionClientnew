/* eslint-disable @typescript-eslint/ban-ts-comment */
'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useGetAllCategoryByProductQuery } from '@/redux/features/category/category.api';
import ProductSkeleton from '@/components/public-view/common/ProductSkeleton';
import { IProduct } from "@/types";
import CategoryByProductCard from '../common/CategoryByProductCard';


const CategoryByProduct = () => {
    const params = useParams();
    const slug = params?.slug as string | undefined;

    const { data, isLoading, isError } = useGetAllCategoryByProductQuery(
        slug ?? ''
    );

    // @ts-expect-error
    const products: IProduct[] = data?.data?.data || [];

    if (isError) {
        return <div className="text-red-500">Something went wrong!</div>;
    }

    if (isLoading) {
        return <ProductSkeleton />;
    }

    if (products.length === 0) {
        return (
            <p className="text-center text-gray-500 col-span-full">
                No products found
            </p>
        );
    }

    return (
        <>
            {products.map((product) => (
                <CategoryByProductCard
                    key={product?._id}
                    product={product}
                />
            ))}
        </>
    );
};

export default CategoryByProduct;