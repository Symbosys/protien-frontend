import BrandPartners from '@/components/home/BrandPartners';
import CategoryGrid from '@/components/home/CategoryGrid';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import FlashSale from '@/components/home/FlashSale';
import HeroSlider from '@/components/home/HeroSlider';
import Testimonials from '@/components/home/Testimonials';
import PromoBanners from '@/components/home/PromoBanners';
import BlogSection from '@/components/home/BlogSection';
import MainLayout from '@/components/layout/MainLayout';

const Index = () => {
  return (
    <MainLayout>
      <HeroSlider />
      <CategoryGrid />
      <FeaturedProducts />
      <PromoBanners />
      <FlashSale />
      <BrandPartners />
      <Testimonials />
      <BlogSection />
    </MainLayout>
  );
};

export default Index;
