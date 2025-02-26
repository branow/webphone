import { FC } from "react";
import { Link } from "react-router";
import "./ErrorPage.css";

const NotFoundPage: FC = () => {
  return (
    <div className="error-page">
      <div className="error-page-header">404 So Sorry!</div>
      <div className="error-page-message">
        The page you are looking for cannot be found
      </div>
      <Link className="transparent-rect-btn error-page-btn" to="/dialpad">
        Take me home
      </Link>
    </div>
  );
}

export default NotFoundPage;
