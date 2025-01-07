import { useEffect, useRef } from "react";

interface UseDebounceDto {
  callback: () => void;
  delay?: number;
}

const useDebounceCallback = ({ callback, delay = 1000 }: UseDebounceDto) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const debouncedCallback = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (timeoutRef && timeoutRef.current) {
      timeoutRef.current = setTimeout(() => {
        callback();
      }, delay);
    }
  };

  return debouncedCallback;
};

export default useDebounceCallback;
