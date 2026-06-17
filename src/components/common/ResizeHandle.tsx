import React from 'react';
import { Separator } from 'react-resizable-panels';

interface ResizeHandleProps {
  className?: string;
  vertical?: boolean;
}

export const ResizeHandle: React.FC<ResizeHandleProps> = ({ className = '', vertical = false }) => {
  return (
    <Separator className={`relative flex items-center justify-center bg-gray-100 after:absolute focus-within:z-10 hover:bg-gray-200 active:bg-gray-300 transition-colors ${vertical ? 'h-2 w-full cursor-row-resize after:inset-x-0 after:top-1/2 after:-translate-y-1/2 after:h-1' : 'w-2 h-full cursor-col-resize after:inset-y-0 after:left-1/2 after:-translate-x-1/2 after:w-1'} ${className}`}>
      <div className={`z-10 flex items-center justify-center rounded-sm bg-gray-300 ${vertical ? 'w-6 h-1' : 'h-6 w-1'}`}>
        <div className={`bg-white ${vertical ? 'w-full h-px' : 'h-full w-px'}`} />
      </div>
    </Separator>
  );
};
