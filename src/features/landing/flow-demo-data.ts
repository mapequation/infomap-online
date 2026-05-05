export type FlowDemoNode = {
  id: number;
  module: number;
  x: number;
  y: number;
};

export type FlowDemoLink = {
  source: number;
  target: number;
  weight: number;
};

export const flowDemoNodes: FlowDemoNode[] = [
  { id: 0, module: 2, x: 0.185, y: 0.2464 },
  { id: 1, module: 2, x: 0.2653, y: 0.1286 },
  { id: 2, module: 2, x: 0.3087, y: 0.2442 },
  { id: 3, module: 2, x: 0.2282, y: 0.3619 },
  { id: 4, module: 2, x: 0.4428, y: 0.1812 },
  { id: 5, module: 2, x: 0.3788, y: 0.3494 },
  { id: 6, module: 1, x: 0.5829, y: 0.2072 },
  { id: 7, module: 1, x: 0.791, y: 0.2372 },
  { id: 8, module: 1, x: 0.6675, y: 0.3227 },
  { id: 9, module: 1, x: 0.4974, y: 0.3718 },
  { id: 10, module: 1, x: 0.6613, y: 0.4215 },
  { id: 11, module: 1, x: 0.862, y: 0.4037 },
  { id: 12, module: 1, x: 0.6613, y: 0.5348 },
  { id: 13, module: 3, x: 0.72, y: 0.6676 },
  { id: 14, module: 3, x: 0.7984, y: 0.7863 },
  { id: 15, module: 3, x: 0.6735, y: 0.8714 },
  { id: 16, module: 3, x: 0.5976, y: 0.7669 },
  { id: 17, module: 0, x: 0.4337, y: 0.742 },
  { id: 18, module: 0, x: 0.139, y: 0.6191 },
  { id: 19, module: 0, x: 0.1788, y: 0.7803 },
  { id: 20, module: 0, x: 0.2989, y: 0.7066 },
  { id: 21, module: 0, x: 0.2989, y: 0.595 },
  { id: 22, module: 0, x: 0.1815, y: 0.4887 },
  { id: 23, module: 0, x: 0.3729, y: 0.461 },
  { id: 24, module: 0, x: 0.4761, y: 0.5698 },
];

export const flowDemoLinks: FlowDemoLink[] = [
  { source: 0, target: 2, weight: 2 },
  { source: 1, target: 2, weight: 4 },
  { source: 2, target: 3, weight: 5 },
  { source: 1, target: 4, weight: 4 },
  { source: 2, target: 4, weight: 5 },
  { source: 2, target: 5, weight: 4 },
  { source: 4, target: 5, weight: 4 },
  { source: 3, target: 5, weight: 3 },
  { source: 4, target: 6, weight: 3 },
  { source: 6, target: 7, weight: 3 },
  { source: 7, target: 8, weight: 4 },
  { source: 6, target: 8, weight: 5 },
  { source: 8, target: 9, weight: 5 },
  { source: 6, target: 9, weight: 4 },
  { source: 8, target: 10, weight: 2 },
  { source: 7, target: 11, weight: 3 },
  { source: 10, target: 11, weight: 2 },
  { source: 8, target: 11, weight: 3 },
  { source: 10, target: 12, weight: 2 },
  { source: 9, target: 12, weight: 3 },
  { source: 11, target: 12, weight: 3 },
  { source: 12, target: 13, weight: 2 },
  { source: 13, target: 14, weight: 4 },
  { source: 14, target: 15, weight: 3 },
  { source: 13, target: 16, weight: 4 },
  { source: 14, target: 16, weight: 5 },
  { source: 15, target: 16, weight: 4 },
  { source: 16, target: 17, weight: 1 },
  { source: 17, target: 19, weight: 4 },
  { source: 19, target: 20, weight: 4 },
  { source: 17, target: 20, weight: 2 },
  { source: 17, target: 21, weight: 4 },
  { source: 19, target: 21, weight: 2 },
  { source: 20, target: 21, weight: 2 },
  { source: 18, target: 21, weight: 4 },
  { source: 21, target: 22, weight: 4 },
  { source: 22, target: 23, weight: 5 },
  { source: 9, target: 23, weight: 4 },
  { source: 21, target: 23, weight: 5 },
  { source: 23, target: 24, weight: 3 },
  { source: 21, target: 24, weight: 2 },
  { source: 17, target: 24, weight: 2 },
  { source: 24, target: 17, weight: 6 },
  { source: 19, target: 18, weight: 3 },
  { source: 12, target: 10, weight: 3 },
  { source: 5, target: 2, weight: 1 },
  { source: 4, target: 1, weight: 4 },
  { source: 7, target: 6, weight: 5 },
];

export const flowDemoScheme = ["#EBC384", "#DFDDA2", "#B4CCDF", "#E68C6C"];
export const flowDemoSchemeAlt = ["#ECA770", "#ADB580", "#82A3C9", "#C2554A"];
