import React from 'react';
import classNames from 'classnames';

interface IPageWrapper {
  children: React.ReactNode;
  padded?: true;
  wrapped?: boolean;
}

export function PageWrapper({ children, padded, wrapped = true }: IPageWrapper): JSX.Element {
  if (!wrapped) {
    return <div className="bg-thmBackground w-full h-full">{children}</div>;
  }

  return (
    <div
      className={classNames(
        'w-[300px] h-[300px] overflow-y-hidden mx-auto my-4 rounded-[13px] shadow-2xl bg-thmBackground'
      )}
    >
      {padded ? <div className="flex flex-col space-y-2 m-4">{children}</div> : children}
    </div>
  );
}
