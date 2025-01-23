import { FC } from "react";

interface Props {
  className?: string;
  error: string;
}

const ErrorMessage: FC<Props> = ({ className, error }) => {
  return (
    <>
      {error && (<div className={className}>{error}</div>)}
    </>
  );
};

export default ErrorMessage;
