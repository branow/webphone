import { FC } from "react";

interface Props {
  className?: string;
  error: string;
}

const ErrorMessage: FC<Props> = ({ className, error }) => {
  const curClassName =  "error-message" + (className ? " " + className : "");
  return (
    <>
      {error && (<div className={curClassName}>{error}</div>)}
    </>
  );
};

export default ErrorMessage;
