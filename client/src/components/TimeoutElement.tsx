import { useState, useEffect } from 'react';
import type { Dispatch as TDispatch, SetStateAction as TSetState } from 'react';

type TValueState = number | string;

interface TimeoutElementProps<T extends TValueState> {
  tagName?: 'span' | 'p' | 'div';
  classNames?: string;
  duration?: number;
  valueState: T;
  valueStateValueToMatch?: T;
  valueStateMatchWhenNotEmpty?: boolean;
  setValueState: TDispatch<TSetState<T>>;
  text: string;
  valueStateDefaultValue: T;
}

const TimeoutElement = <T extends TValueState>({
  tagName = 'span',
  classNames = '',
  duration = 3000,
  valueState,
  valueStateValueToMatch = undefined,
  valueStateMatchWhenNotEmpty = false,
  setValueState,
  valueStateDefaultValue,
  text,
}: TimeoutElementProps<T>) => {
  const [timeoutState, setTimeoutState] = useState<null | NodeJS.Timeout>(null);

  const setNewTimeout = () => {
    if (timeoutState) {
      clearTimeout(timeoutState);
    }
    const timeout = setTimeout(() => {
      setValueState(valueStateDefaultValue);
    }, duration);
    setTimeoutState(timeout);
  };

  useEffect(() => {
    if (valueStateMatchWhenNotEmpty) {
      if (valueState) {
        setNewTimeout();
      }
    } else {
      if (valueState === valueStateValueToMatch) {
        setNewTimeout();
      }
    }
  }, [valueState]);

  let returnElement = null;
  if (tagName === 'span') {
    returnElement = <span className={classNames}>{text}</span>;
  } else if (tagName === 'p') {
    returnElement = <p className={classNames}>{text}</p>;
  } else if (tagName === 'div') {
    returnElement = <div className={classNames}>{text}</div>;
  } else {
    returnElement = null;
  }

  return valueState && returnElement;
};

export default TimeoutElement;
