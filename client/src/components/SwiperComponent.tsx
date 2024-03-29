import { Swiper, SwiperSlide } from 'swiper/react';
import type { SwiperRef } from 'swiper/react';

import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';

import { useRef, useEffect } from 'react';

interface SwiperComponentProps {
  listToMap: string[];
  keyDownElement?: 'body' | 'swiper';
  classNames?: string;
}

const SwiperComponent = ({
  listToMap,
  keyDownElement = 'body',
  classNames = '',
}: SwiperComponentProps) => {
  SwiperCore.use([Navigation]);

  const swiperRef = useRef<SwiperRef>(null);

  const handleKeyDown = (e: globalThis.KeyboardEvent) => {
    if (keyDownElement !== 'swiper') return;

    if (swiperRef.current) {
      const swiperInstance = swiperRef.current.swiper;

      if (e.key === 'ArrowLeft') {
        swiperInstance.slidePrev();
      } else if (e.key === 'ArrowRight') {
        swiperInstance.slideNext();
      }
    }
  };

  const handleMouseHover = () => {
    if (keyDownElement === 'swiper') {
      document.addEventListener('keydown', handleKeyDown);
    }
  };

  const handleMouseLeave = () => {
    if (keyDownElement === 'swiper') {
      document.removeEventListener('keydown', handleKeyDown);
    }
  };

  useEffect(() => {
    if (keyDownElement === 'body') {
      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, []);

  return (
    <Swiper navigation ref={swiperRef}>
      {listToMap &&
        listToMap.map((imageUrl, index) => (
          <SwiperSlide key={index}>
            <div
              className={classNames}
              style={{
                background: `url(${imageUrl}) center no-repeat`,
                backgroundSize: 'cover',
              }}
              onMouseLeave={handleMouseLeave}
              onMouseEnter={handleMouseHover}
            ></div>
          </SwiperSlide>
        ))}
    </Swiper>
  );
};

export default SwiperComponent;
