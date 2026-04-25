export function PodiumPedestal({ height }: { height: string }) {
  return (
    <div
      className={`
        absolute bottom-0 w-full
        ${height}
        bg-white/5 backdrop-blur-md
        rounded-b-3xl
        border-t border-white/10
      `}
    />
  );
}
