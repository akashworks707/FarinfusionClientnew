import CategoryList from "@/components/public-view/category/CategoryList";
import ProductList from "@/components/public-view/product/ProductList";
import HeroSection from "@/components/home/HeroSection";
import CustomerFavorites from "../customerFavoriteProducts/CustomerFavorites";
import ProductBlog from "./ProductBlog";
import { ReviewsCarousel } from "./ReviewCarousel";
import BestSellingProducts from "./BestSellingProducts";
import ProductVerificationSection from "@/components/dashboard/product-verification/ProductVerificationSection";

const HomePage = () => {
  return (
    <div className={""}>
      <HeroSection />
      <div className={"space-y-5"}>
        <CategoryList />
        <CustomerFavorites />
        <ProductList />
        <div id="best-selling">
          <BestSellingProducts />
        </div>
        <ProductVerificationSection />
        <ReviewsCarousel />
        <div id="special-beauty-deal">{/* <OfferProduct /> */}</div>
        <ProductBlog />
      </div>
    </div>
  );
};

export default HomePage;
