export function PodiumPedestal({ height }: { height: string }) {
  return (
    <div
      className={`
        absolute bottom-0 w-full
        ${height}
        bg-[var(--podium-surface)]
        backdrop-blur-md
        rounded-b-3xl
        border-t border-[var(--podium-border)]
      `}
    />
  );
}