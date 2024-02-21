import React, { useEffect } from "react";
import CountDown from "../../CountDown/CountDown";
import EventsCard from "../../../Pages/Events/EventsCard/EventsCard";
import { useDispatch, useSelector } from "react-redux";
import { getAllEventHomepage } from "../../Redux/Reducers/EventReducer";
import Loader from "../../Loader/Loader";

export default function Events() {
  const { HomepageEventsLoading, HomepageEvents } = useSelector(
    (state) => state.events
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllEventHomepage());
  }, [dispatch]);
  if (HomepageEventsLoading) {
    return <Loader />;
  }
  console.log(HomepageEvents);
  return (
    <div className="w-11/12 mx-auto">
      <div className="text-[27px] text-center md:text-start font-[600] font-Roboto pb-[20px]">
        <h1>Popular Events</h1>
      </div>
      <div className="w-full h-[fit] overflow-hidden">
        {HomepageEvents && HomepageEvents.length > 0 ? (
          HomepageEvents.slice(0, 1).map((d, i) => {
            return <EventsCard data={d} key={i} />;
          })
        ) : (
          <span className="flex flex-col items-center justify-center h-[200px] text-[20px]">
            No Running Events!!
          </span>
        )}
      </div>
    </div>
  );
}
