import { FC } from "react";
import { useNavigate, Link } from "react-router";
import { FaGear } from "react-icons/fa6";
import Button from "./Button";
import "./NavBar.css";

const NavBar: FC = () => {
  const navigate = useNavigate();

  const handleSetting = () => {
    if (window.location.pathname === "/settings") {
      navigate(-1);
    } else {
      navigate("/settings");
    }
  };

  return (
    <div className="nav-bar">
      <Link className="nav-bar-title" to="/dialpad">
        WEBPHONE
      </Link>
      <Button
        className="nav-bar-setting-btn transparent-btn"
        Icon={FaGear}
        onClick={handleSetting}
      />
    </div>
  );
};

export default NavBar;
