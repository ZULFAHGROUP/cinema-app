import type { JSX, LazyExoticComponent } from 'react';

export type Route = {
  key: string;
  path: string;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  component: LazyExoticComponent<<T>(props: T) => JSX.Element>;
};

export type Routes = Route[];
