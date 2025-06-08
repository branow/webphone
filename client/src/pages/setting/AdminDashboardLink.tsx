import { FC, useContext } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { css } from "@linaria/core";
import { AccountContext } from "context/AccountContext";
import TransparentRectButton from "components/common/button/TransparentRectButton";
import { d } from "lib/i18n";
import { Paths } from "routes";
import { font } from "styles";

const cssButton = css`
  width: 100%;
  padding: 5px;
  font-size: ${font.size.m}px;
`;

const AdminDashboardLink: FC = () => {
  const { isAdmin } = useContext(AccountContext);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const moveToAdmin = () => navigate(Paths.Admin());

  return (
    <>
      {isAdmin && (
        <TransparentRectButton
          className={cssButton}
          onClick={moveToAdmin}
        >
          {t(d.settings.moveToAdmin)}
        </TransparentRectButton>
      )}
    </>
  );
};

export default AdminDashboardLink;
