import HeroSection from "../components/home/herotemp";
import HowItWorks from "../components/home/HowItWorks";
import PersonalizedHolidayPlan from "../components/home/PersonalizedHolidayPlan";
import PopularDestinations from "../components/home/PopularDestinations";
// import SearchWidget from "../components/home/SearchWidget";
import TravelCategories from "../components/home/TravelCategories";
import TravelReviews from "../components/home/TravelReviews";
import TrustCenter from "../components/home/TrustCenter";
import VideoTestimonials from "../components/home/VideoTestimonials";
import WhyChooseUs from "../components/home/WhyChooseUs";
const Home = () => {
    return (<>
      <HeroSection />
      {/* <SearchWidget /> */}
      {/* <FeaturedPackages /> */}
      <PopularDestinations />
      <TravelCategories />
      <HowItWorks />
      <WhyChooseUs />
      {/* <LatestBlogs /> */}
      <TravelReviews />
      <TrustCenter />
      <VideoTestimonials />
      <div id="holiday-plan">
        <PersonalizedHolidayPlan />
      </div>
      {/* <ContactCTA /> */}
    </>);
};
export default Home;
