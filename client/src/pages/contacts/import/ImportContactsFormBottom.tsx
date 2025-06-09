import { FC } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import ControlPane from "components/common/pane/ControlPane";
import { d } from "lib/i18n";
import { font, size } from "styles";

interface Props {
  create: () => void;
  disabled: boolean;
}

const ImportContactsFormBottom: FC<Props> = ({ create, disabled }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <ControlPane
      height={size.tabs.h}
      size={font.size.m}
      controls={[
        {
          key: "import",
          children: t(d.ui.buttons.import),
          disabled: disabled,
          onClick: create,
        },
        {
          key: "cancel",
          children: t(d.ui.buttons.cancel),
          onClick: () => navigate(-1),
        },
      ]}
    />
  );
};

export default ImportContactsFormBottom;
