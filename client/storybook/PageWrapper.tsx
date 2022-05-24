import React from 'react';
import classNames from 'classnames';

interface IPageWrapper {
  children: React.ReactNode;
  padded?: true;
}

export function PageWrapper({ children, padded }: IPageWrapper): JSX.Element {
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
