import { useEffect } from 'react';
import PropTypes from 'prop-types';

const Dummy = ({ onUnmount }) => {
  useEffect(
    () => () => {
      onUnmount();
    },
    [onUnmount]
  );

  return null;
};

export default Dummy;

Dummy.propTypes = {
  onUnmount: PropTypes.func.isRequired,
};
