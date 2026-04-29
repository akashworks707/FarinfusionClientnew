import React from 'react';
import ProductNavbar from "@/components/public-view/common/ProductNavbar";
import CategoryByProduct from "@/components/public-view/category/CategoryByProduct";

const Page = () => {
    return (
        <div>
            <ProductNavbar>
                <CategoryByProduct />
            </ProductNavbar>
        </div>
    );
};

export default Page;