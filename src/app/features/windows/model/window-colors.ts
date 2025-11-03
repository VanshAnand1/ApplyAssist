export function windowColors(color: string | undefined): string {
  if (color === 'blue') return '#80f0ff';
  if (color === 'red') return '#ff8c80';
  if (color === 'yellow') return '#fff780';
  if (color === 'orange') return '#ffc380';
  if (color === 'purple') return '#df80ff';
  if (color === 'pink') return '#ff80ec';
  if (color === 'green') return '#bbff80';
  if (color === 'gray') return '#9ea3a3';
  return defaultColor();
}

export function defaultColor(): string {
  return '#9ea3a3';
}
