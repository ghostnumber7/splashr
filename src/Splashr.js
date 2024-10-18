import React, {
  Fragment,
  useState,
  useRef,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';

import useInitialDelay from './useInitialDelay';

function useListener(event, callback, target) {
  useEffect(() => {
    target?.addEventListener(event, callback);
    return () => {
      target?.removeEventListener(event, callback);
    };
  }, [event, callback, target]);
}
const Splashr = ({
  splash,
  children,
  minDelay = 2000,
  extend = undefined,
  transitionTime = 700,
  transitionTimingFunction = 'ease',
  onCompleted = () => {},
  position = 'fixed',
}) => {
  const showSplashScreen = useInitialDelay(minDelay, extend);
  const [isCompleted, setCompleted] = useState(false);
  const splashScreenEl = useRef();

  if (!showSplashScreen && !transitionTime && !isCompleted) {
    setCompleted(true);
    onCompleted();
  }

  useListener(
    'transitionend',
    () => {
      setCompleted(true);
      onCompleted();
      splashScreenEl.current = null;
    },
    transitionTime ? splashScreenEl.current : null
  );

  const transitionStyle = transitionTime
    ? { transition: `opacity ${transitionTime}ms ${transitionTimingFunction}` }
    : {};

  return isCompleted
    ? children
    : (
      <Fragment>
        {children}
        {!isCompleted && (
        <div
          ref={splashScreenEl}
          style={{
            position,
            margin: 0,
            padding: 0,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: showSplashScreen ? 1 : 0,
            ...transitionStyle,
          }}
        >
          {splash}
        </div>
        )}
      </Fragment>
    );
};

Splashr.propTypes = {
  splash: PropTypes.element.isRequired,
  children: PropTypes.node,
  minDelay: PropTypes.number,
  extend: PropTypes.bool,
  transitionTime: PropTypes.number,
  transitionTimingFunction: PropTypes.string,
  onCompleted: PropTypes.func,
  position: PropTypes.string,
};

export default Splashr;
