'use client'
import React from 'react';
import ProductCard from "@/components/public-view/common/ProductCard";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store";
import EmptyWishList from "@/components/public-view/wishlist/EmptyWishList";
import {Separator} from "@/components/ui/separator";

const Wishlist = () => {
    const productData  = useSelector((state:RootState) => state.wish.items)

    if (productData.length === 0) {
        return (
           <EmptyWishList />
        );
    }

    return (
        <div className={"container mx-auto px-5 py-8 "}>
            <h3 className={"text-lg font-semibold text-gray-700 "}>Your products wishlist</h3>
            <Separator  className={"my-5"}/>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {productData.map((item) => (
                    <ProductCard key={item._id} product={item} />
                ))}
            </div>
        </div>
    );
};

export default Wishlist;