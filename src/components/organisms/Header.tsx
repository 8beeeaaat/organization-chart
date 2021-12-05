import classnames from 'classnames';
import React, { useEffect, useState } from 'react';
interface Props extends React.HTMLAttributes<HTMLElement> {
  user?: gapi.auth2.GoogleUser;
  onClickLogout: () => void;
}
export const Header: React.FC<Props> = (props) => {
  const { user, onClickLogout } = props;
  const [userState, setUserState] = useState<
    | {
        imageUrl: string;
        name: string;
      }
    | undefined
  >();
  useEffect(() => {
    if (!user) return;
    setUserState({
      imageUrl: user.getBasicProfile().getImageUrl(),
      name: user.getBasicProfile().getName(),
    });
  }, [user]);
  return (
    <header
      className={classnames('flex', 'justify-end', 'gap-2', props.className)}
    >
      {userState ? (
        <>
          <img
            className='h-10 w-10 rounded-full shadow-md'
            src={userState.imageUrl}
            alt={userState.name}
          />
          <button className='btn btn-danger' onClick={onClickLogout}>
            logout
          </button>
        </>
      ) : null}
    </header>
  );
};
