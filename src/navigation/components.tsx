import React from 'react';
import { ScreenFallback } from '../components/ScreenFallback';

export const DelayedScreenFallback = () => {
  const [show, setShow] = React.useState(true);
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setShow(false);
    }, 600);
    return () => {
      clearTimeout(timeout);
    };
  }, []);
  return show ? <ScreenFallback /> : null;
};
