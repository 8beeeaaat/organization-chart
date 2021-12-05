import classnames from 'classnames';
import { memo, useRef } from 'react';

// ツールチップ内に表示するためのprops
interface Props extends React.HTMLAttributes<HTMLElement> {
  texts: string[];
}

// ツールチップ
export const Tooltip: React.FC<Props> = memo((props) => {
  // ツールチップの文言自体のためのref
  const ref = useRef<HTMLDivElement>(null);

  // マウスが乗ったらツールチップを表示
  const handleMouseEnter = () => {
    if (!ref.current) return;
    ref.current.style.opacity = '1';
    ref.current.style.visibility = 'visible';
  };
  // マウスが離れたらツールチップを非表示
  const handleMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.opacity = '0';
    ref.current.style.visibility = 'hidden';
  };

  return (
    <div
      className={classnames(
        'flex',
        'relative',
        'justify-between',
        'items-center',
        'w-full',
        props.className
      )}
    >
      <p
        className={classnames(
          '-translate-x-1/2',
          'absolute',
          'before:-top-1',
          'before:-translate-x-1/2',
          'before:absolute',
          'before:bg-black',
          'before:block',
          'before:h-2',
          'before:left-1/2',
          'before:rotate-45',
          'before:transform',
          'before:w-2',
          'before:z-0',
          'bg-gray-800',
          'duration-150',
          'flex-col',
          'flex',
          'gap-1',
          'font-bold',
          'invisible',
          'items-center',
          'left-1/2',
          'mt-2',
          'mx-auto',
          'px-3',
          'py-2',
          'rounded',
          'text-white',
          'text-xs',
          'top-full',
          'transform',
          'transition-all',
          'whitespace-nowrap',
          'z-10'
        )}
        ref={ref}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {props.texts.map((text: string, i: number) => (
          <span key={text}>{text}</span>
        ))}
      </p>
      <div
        className={classnames('w-full')}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {props.children}
      </div>
    </div>
  );
});

Tooltip.displayName = 'Tooltip';
