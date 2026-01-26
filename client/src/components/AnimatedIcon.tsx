import React from 'react';
import Lottie from 'lottie-react';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface AnimatedIconProps {
  animationData?: object;
  animationUrl?: string;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
  speed?: number;
  fallback?: React.ReactNode;
}

export default function AnimatedIcon({
  animationData,
  animationUrl,
  className = '',
  loop = true,
  autoplay = true,
  speed = 1,
  fallback
}: AnimatedIconProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [animation, setAnimation] = React.useState<object | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    if (animationData) {
      setAnimation(animationData);
      setLoading(false);
      return;
    }

    if (animationUrl) {
      fetch(animationUrl)
        .then(res => res.json())
        .then(data => {
          setAnimation(data);
          setLoading(false);
        })
        .catch(() => {
          setError(true);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [animationData, animationUrl]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center ${className}`} ref={ref}>
        {fallback || <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>}
      </div>
    );
  }

  if (error || !animation) {
    return (
      <div className={`flex items-center justify-center ${className}`} ref={ref}>
        {fallback}
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      <Lottie
        animationData={animation}
        loop={loop}
        autoplay={autoplay && isInView}
        style={{ width: '100%', height: '100%' }}
        speed={speed}
      />
    </div>
  );
}
