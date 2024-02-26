import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllShopEvents } from "../../../../../Components/Redux/Reducers/EventReducer";
import EventsCard from "../../../../Events/EventsCard/EventsCard";
import Loader from "../../../../../Components/Loader/Loader";

export default function ShopEvents() {
  const { id } = useParams();
  const { shopEvents, shopEventsLoading } = useSelector(
    (state) => state.events
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllShopEvents({ id: id }));
  }, [dispatch, id]);
  if (shopEventsLoading) {
    return <Loader />;
  }
  console.log(shopEvents);
  return (
    <>
      <div className="mb-12 border ">
        {shopEvents &&
          shopEvents.map((d, i) => <EventsCard key={i} data={d} />)}
      </div>
      {shopEvents && shopEvents.length === 0 && (
        <div className="w-full flex flex-col items-center justify-center">
          No running events
        </div>
      )}
    </>
  );
}
