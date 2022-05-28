import React from 'react';
import classNames from 'classnames';

interface IPageWrapper {
  children: React.ReactNode;
  padded?: true;
  wrapped?: boolean;
  centered?: true;
}

export function PageWrapper({
  children,
  padded,
  wrapped = true,
  centered,
}: IPageWrapper): JSX.Element {
  if (!wrapped) {
    return <div className="h-full w-full bg-thmBackground">{children}</div>;
  }

  return (
    <div
      className={classNames(
        'mx-auto my-4 h-[300px] w-[300px] rounded-[13px] bg-thmBackground shadow-2xl'
      )}
    >
      {padded ? (
        <div className={`m-4 flex flex-col space-y-2 ${centered ? 'h-full justify-center' : ''}`}>
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
}
