import Hero from "../components/domestic/Hero";
import Trending from "../components/domestic/Trending";
import AllDestination from "../components/domestic/AllDestination";
import Themes from "../components/domestic/Themes";
import Faq from "../components/ui/Faq";
import WhyChooseUs from "../components/home/WhyChooseUs";

const DomesticDestinations = () => {
  return (
    <main className="bg-white font-inter">
      <Hero />
      <Trending />
      <Themes />
      <AllDestination />
      <WhyChooseUs />
      <Faq />
    </main>
  );
};

export default DomesticDestinations;
