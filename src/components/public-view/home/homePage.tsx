import React from 'react';
import CategoryList from "@/components/public-view/category/CategoryList";
import ProductList from "@/components/public-view/product/ProductList";
import HeroSection from '@/components/home/HeroSection';
import CustomerFavorites from '../customerFavoriteProducts/CustomerFavorites';
import OfferProduct from "@/components/public-view/home/OfferProduct";
import ProductBlog from './ProductBlog';

const HomePage = () => {
    return (
        <div className={"bg-gray-100 "}>
            <HeroSection />
            <div className={"space-y-5"}>
                <CategoryList />
                <CustomerFavorites />
                <ProductList />
                <OfferProduct />
                <ProductBlog />
            </div>
        </div>
    );
};

export default HomePage;