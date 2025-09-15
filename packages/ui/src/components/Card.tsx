import React from "react";
import clsx from "clsx";

type Props = React.PropsWithChildren<{ className?: string }>;

export const Card: React.FC<Props> = ({ className, children }) => {
  return (
    <div
      className={clsx(
        "rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900",
        className
      )}
    >
      {children}
    </div>
  );
};
