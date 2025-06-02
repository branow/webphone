import { FC, useContext } from "react";
import { AccountContext } from "../../context/AccountContext";
import TransparentRectButton from "../../components/common/button/TransparentRectButton";
import { font } from "../../styles";
import { css } from "@linaria/core";
import { useNavigate } from "react-router";
import { Paths } from "../../routes";
import { useTranslation } from "react-i18next";
import { d } from "../../lib/i18n";

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
