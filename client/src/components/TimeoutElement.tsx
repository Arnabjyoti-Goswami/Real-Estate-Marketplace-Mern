import { useState, useEffect } from 'react';

const TimeoutElement = ({ 
  tagName='span', 
  classNames='',
  valueState,
  valueStateValueToMatch=undefined,
  valueStateMatchWhenNotEmpty=false,
  setValueState,
  valueStateDefaultValue,
  text,
  duration=3000,
}) => {
  const [timeoutState, setTimeoutState] = useState(null);

  const setNewTimeout = () => {
    if (timeoutState) {
      clearTimeout(timeoutState);
    }
    const timeout = setTimeout(() => {
      setValueState(valueStateDefaultValue);
    }, duration);
    setTimeoutState(timeout);
  };

  if (valueStateMatchWhenNotEmpty) {
    useEffect(() => {
      if (valueState) {
        setNewTimeout();
      }
    }, [valueState]);
  }
  else {
    useEffect(() => {
      if (valueState === valueStateValueToMatch) {
        setNewTimeout();
      }
    }, [valueState]);
  }

  let returnElement = null;
  if (tagName === 'span') {
    returnElement = 
    <span className={classNames}>
      {text}
    </span>;
  } else if (tagName === 'p') {
    returnElement = 
    <p className={classNames}>
      {text}
    </p>;
  } else if (tagName === 'div') {
    returnElement = 
    <div className={classNames}>
      {text}
    </div>;
  } else {
    returnElement = null;
  }

  return (
    valueState && returnElement
  );
};

export default TimeoutElement;