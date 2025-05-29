import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { styled } from "@linaria/react";
import TextInput from "../../common/input/TextInput";
import TextArea from "../../common/input/TextArea";
import Chapter from "../../common/pane/Chapter";
import ControlPane from "../../common/pane/ControlPane";
import ErrorBanner from "../../common/messages/ErrorBanner";
import PhotoForm from "../../contact/form/PhotoForm";
import NumbersForm from "../../contact/form/NumbersForm";
import { useEditContact } from "../../../hooks/useEditContact";
import { ContactDetails } from "../../../services/contacts";
import { d } from "../../../lib/i18n";
import { font, size } from "../../../styles";

const Container = styled.div`
  height: 100%;
  max-height: 100%;
`;

const Info = styled.div`
  height: ${size.phone.h - size.navbar.h - size.tabs.h}px;
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

interface Props {
  contact: ContactDetails;
  save: (contact: ContactDetails, photo?: File) => void;
  savingError?: Error;
}

const ContactForm: FC<Props> = ({ contact, save, savingError }) => {
  const [photoFile, setPhotoFile] = useState<File>();

  const { form, updateForm, error } = useEditContact({ initContact: contact });

  const setPhoto = (photo?: File) => {
    if (photo) {
      const url = URL.createObjectURL(photo);
      updateForm({ photo: url })
      setPhotoFile(photo);
    } else {
      updateForm({ photo: undefined })
    }
  }

  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Container>
      <Info>
        <ErrorBanner error={savingError} />
        <Chapter>
          <PhotoForm contact={form} setPhoto={setPhoto} />
        </Chapter>

        <Chapter title={t(d.contact.fields.name)}>
          <TextInput
            value={form.name}
            onValueChange={(name) => updateForm({ name })}
            error={error?.name}
          />
        </Chapter>

        <Chapter title={t(d.contact.fields.contact)}>
          <NumbersForm
            numbers={form.numbers}
            setNumbers={(numbers) => updateForm({ numbers })}
            error={error?.numberList}
            numberErrors={error?.numbers}
          />
        </Chapter>

        <Chapter title={t(d.contact.fields.bio)}>
          <TextArea
            raws={7}
            value={form.bio || ""}
            onValueChange={(bio) => updateForm({ bio })}
            error={error?.bio}
          />
        </Chapter>
      </Info>

      <ControlPane
        height={size.tabs.h}
        size={font.size.m}
        controls={[
          {
            key: "save",
            children: t(d.ui.buttons.save),
            disabled: !!error,
            onClick: () => save(form, photoFile),
          },
          {
            key: "cancel",
            children: t(d.ui.buttons.cancel),
            onClick: () => navigate(-1),
          },
        ]}
      />
    </Container>
  );
};

export default ContactForm;
