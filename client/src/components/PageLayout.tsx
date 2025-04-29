import { FC } from "react";
import { Outlet } from "react-router";
import NavBar from "./NavBar";
import PhoneContainer from "./PhoneContainer";
import "./PageLayout.css";

const PageLayout: FC = () => {
  return (
    <PhoneContainer>
      <div className="page-layout">
        <div className="page-layout-navbar">
          <NavBar />
        </div>
        <main className="page-layout-body">
          <Outlet />
        </main>
      </div>
    </PhoneContainer>
  );
}

export default PageLayout;
