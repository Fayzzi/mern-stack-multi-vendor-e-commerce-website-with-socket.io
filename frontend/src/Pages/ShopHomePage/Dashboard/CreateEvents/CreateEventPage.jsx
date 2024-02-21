import React from "react";
import DashboardHeader from "../../../../Components/Layout/Header/DashboardHeader";
import DashboardSidebar from "../SideBar/DashboardSidebar";
import EventsFormComponent from "./EventsForm/EventsFormComponent";

export default function CreateEventPage() {
  return (
    <div>
      <DashboardHeader />
      <div className="flex  justify-between w-full">
        <div className="800px:w-[280px] w-fit">
          <DashboardSidebar active={6} />
        </div>

        <div className="w-full flex justify-center">
          <EventsFormComponent />
        </div>
      </div>
    </div>
  );
}
