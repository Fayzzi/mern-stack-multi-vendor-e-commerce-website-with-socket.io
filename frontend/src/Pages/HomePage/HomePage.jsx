import React from "react";
import Header from "../../Components/Layout/Header/Header";
import Hero from "../../Components/Layout/Hero/Hero";
import Categories from "../../Components/Layout/Categories/Categories";
import BestDeals from "../../Components/Layout/BestDeals/BestDeals";
import FeaturedProducts from "../../Components/Layout/FeaturedProducts/FeaturedProducts";
import Events from "../../Components/Layout/Events/Events";
import Sponsered from "../../Components/Layout/Sponsered/Sponsered";
import Footer from "../../Components/Layout/Footer/Footer";

export default function HomePage() {
  return (
    <div className="">
      <Header activeHeading={1} />
      <Hero />
      <Categories />
      <BestDeals />
      <Events />
      <FeaturedProducts />
      <Sponsered />
      <Footer />
    </div>
  );
}
