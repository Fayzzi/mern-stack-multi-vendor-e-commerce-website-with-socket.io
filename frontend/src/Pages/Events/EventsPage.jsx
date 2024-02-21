import React, { useEffect } from "react";
import Header from "../../Components/Layout/Header/Header";
import EventsCard from "./EventsCard/EventsCard";
import Footer from "../../Components/Layout/Footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import { getAllEventHomepage } from "../../Components/Redux/Reducers/EventReducer";
import Loader from "../../Components/Loader/Loader";
import { motion } from "framer-motion";

export default function EventsPage() {
  const { HomepageEvents, HomepageEventsLoading } = useSelector(
    (state) => state.events
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllEventHomepage());
  }, [dispatch]);
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  return (
    <div>
      <Header activeHeading={4} />
      {HomepageEventsLoading ? (
        <Loader />
      ) : (
        <motion.div
          initial={{ x: "100vw" }} // Start off-screen to the right
          animate={{ x: 0, transition: { duration: 0.8, delay: 0.25 } }} // Slide in from right
          exit={{ x: "100vw", transition: { duration: 0.8, delay: 0.1 } }} // Slide out to the left
          className="w-11/12 my-8 mx-auto"
        >
          <h1 className="my-6 text-[30px] font-bold">All Events</h1>
          {HomepageEvents && HomepageEvents.length === 0 ? (
            <span className="min-h-screen flex flex-col items-center justify-center text-[20px]">
              No running Events
            </span>
          ) : (
            HomepageEvents &&
            HomepageEvents.map((d, i) => <EventsCard data={d} key={i} />)
          )}
        </motion.div>
      )}
      <Footer />
    </div>
  );
}
