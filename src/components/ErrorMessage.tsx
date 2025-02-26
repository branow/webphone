import { FC } from "react";

interface Props {
  className?: string;
  error: Error | string | undefined;
}

const ErrorMessage: FC<Props> = ({ className, error }) => {
  if (!error) return <></>;

  let message: string = "";
  if (error instanceof Error) {
    message = error.message;
  } else {
    message = error;
  }
  
  const curClassName =  "error-message" + (className ? " " + className : "");
  return (<div className={curClassName}>{message}</div>);
};

export default ErrorMessage;
