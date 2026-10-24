import HeroSection from "../components/home/herotemp";
import HowItWorks from "../components/home/HowItWorks";
import PersonalizedHolidayPlan from "../components/home/PersonalizedHolidayPlan";
import PopularDestinations from "../components/home/PopularDestinations";
import LatestBlogs from "../components/home/LatestBlogs";
import TravelCategories from "../components/home/TravelCategories";
import TravelReviews from "../components/home/TravelReviews";
import TrustCenter from "../components/home/TrustCenter";
import VideoTestimonials from "../components/home/VideoTestimonials";
import WhyChooseUs from "../components/home/WhyChooseUs";
import HomeThemes from "../components/home/HomeThemes";
import ExploreByPeople from "../components/home/ExploreByPeople";

const Home = () => {
  return (
    <>
      <HeroSection />
      <ExploreByPeople />
      <HomeThemes />
      <PopularDestinations />
      {/* <SearchWidget /> */}
      {/* <FeaturedPackages /> */}
      <TravelCategories />
      {/* <PopularDestinations /> */}
      {/* <HowItWorks /> */}
      <WhyChooseUs />
      <LatestBlogs />
      <TravelReviews />
      {/* <TrustCenter /> */}
      <VideoTestimonials />
      <div id="holiday-plan">
        <PersonalizedHolidayPlan />
      </div>

      {/* <ContactCTA /> */}
    </>
  );
};
export default Home;
