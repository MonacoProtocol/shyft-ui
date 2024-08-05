import { CircularProgress } from '@nextui-org/react';
import React from 'react';

export const LoadingComponent: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <CircularProgress color="secondary" aria-label="Loading..." label="Loading..." />
      </div>
    </div>
  );
};
