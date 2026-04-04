export interface SchedulingResult {
  order: number[];
  seekSequence: number[];
  totalSeekTime: number;
  averageSeekTime: number;
  steps: { from: number; to: number; seek: number }[];
}

export function fcfs(head: number, requests: number[]): SchedulingResult {
  const order = [...requests];
  const seekSequence = [head, ...order];
  const steps = [];
  let totalSeekTime = 0;
  let current = head;
  for (const r of order) {
    const seek = Math.abs(r - current);
    steps.push({ from: current, to: r, seek });
    totalSeekTime += seek;
    current = r;
  }
  return { order, seekSequence, totalSeekTime, averageSeekTime: totalSeekTime / order.length, steps };
}

export function sstf(head: number, requests: number[]): SchedulingResult {
  const remaining = [...requests];
  const order: number[] = [];
  const seekSequence = [head];
  const steps: { from: number; to: number; seek: number }[] = [];
  let totalSeekTime = 0;
  let current = head;
  while (remaining.length > 0) {
    let minIdx = 0;
    let minDist = Math.abs(remaining[0] - current);
    for (let i = 1; i < remaining.length; i++) {
      const d = Math.abs(remaining[i] - current);
      if (d < minDist) { minDist = d; minIdx = i; }
    }
    const next = remaining.splice(minIdx, 1)[0];
    steps.push({ from: current, to: next, seek: minDist });
    totalSeekTime += minDist;
    order.push(next);
    seekSequence.push(next);
    current = next;
  }
  return { order, seekSequence, totalSeekTime, averageSeekTime: totalSeekTime / order.length, steps };
}

export function scan(head: number, requests: number[], cylinders: number, direction: 'left' | 'right'): SchedulingResult {
  const sorted = [...requests].sort((a, b) => a - b);
  const left = sorted.filter(r => r < head);
  const right = sorted.filter(r => r >= head);
  let order: number[];
  if (direction === 'right') {
    order = [...right, cylinders - 1, ...left.reverse()];
    if (!requests.includes(cylinders - 1)) order = [...right, cylinders - 1, ...left.reverse()];
  } else {
    order = [...left.reverse(), 0, ...right];
    if (!requests.includes(0)) order = [...left.reverse(), 0, ...right];
  }
  // Remove boundary if not in original requests
  return buildResult(head, order);
}

export function cscan(head: number, requests: number[], cylinders: number, direction: 'left' | 'right'): SchedulingResult {
  const sorted = [...requests].sort((a, b) => a - b);
  const left = sorted.filter(r => r < head);
  const right = sorted.filter(r => r >= head);
  let order: number[];
  if (direction === 'right') {
    order = [...right, cylinders - 1, 0, ...left];
  } else {
    order = [...left.reverse(), 0, cylinders - 1, ...right.reverse()];
  }
  return buildResult(head, order);
}

export function look(head: number, requests: number[], _cylinders: number, direction: 'left' | 'right'): SchedulingResult {
  const sorted = [...requests].sort((a, b) => a - b);
  const left = sorted.filter(r => r < head);
  const right = sorted.filter(r => r >= head);
  let order: number[];
  if (direction === 'right') {
    order = [...right, ...left.reverse()];
  } else {
    order = [...left.reverse(), ...right];
  }
  return buildResult(head, order);
}

export function clook(head: number, requests: number[], _cylinders: number, direction: 'left' | 'right'): SchedulingResult {
  const sorted = [...requests].sort((a, b) => a - b);
  const left = sorted.filter(r => r < head);
  const right = sorted.filter(r => r >= head);
  let order: number[];
  if (direction === 'right') {
    order = [...right, ...left];
  } else {
    order = [...left.reverse(), ...right.reverse()];
  }
  return buildResult(head, order);
}

function buildResult(head: number, order: number[]): SchedulingResult {
  const seekSequence = [head, ...order];
  const steps: { from: number; to: number; seek: number }[] = [];
  let totalSeekTime = 0;
  let current = head;
  for (const r of order) {
    const seek = Math.abs(r - current);
    steps.push({ from: current, to: r, seek });
    totalSeekTime += seek;
    current = r;
  }
  return { order, seekSequence, totalSeekTime, averageSeekTime: totalSeekTime / (order.length || 1), steps };
}

export const algorithms = { fcfs, sstf, scan, cscan, look, clook } as const;
export type AlgorithmName = keyof typeof algorithms;
