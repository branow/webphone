import { FC } from "react";

interface Props {
  error: string;
}

const ErrorMessage: FC<Props> = ({ error }) => {
  return (
    <>
      {error && (<div>{error}</div>)}
    </>
  );
};

export default ErrorMessage;
