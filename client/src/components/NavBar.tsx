import { FC } from "react";
import { useNavigate, Link } from "react-router";
import { FaGear } from "react-icons/fa6";
import "./NavBar.css";

const NavBar: FC = () => {
  const navigate = useNavigate();

  const handleSetting = () => {
    if (window.location.pathname.endsWith("/settings")) {
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
      <button
        className="nav-bar-setting-btn transparent-btn"
        onClick={handleSetting}
      >
        <FaGear />
      </button>
    </div>
  );
};

export default NavBar;
