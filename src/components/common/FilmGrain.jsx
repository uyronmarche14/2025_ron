export default function FilmGrain() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden opacity-20 mix-blend-overlay">
      <div className="absolute inset-0 w-full h-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/Noise.png')] opacity-10 animate-grain" />
      <svg className="invisible w-0 h-0">
        <filter id="noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
      </svg>
      <div className="absolute inset-0 w-full h-full" style={{ filter: 'url(#noise)', opacity: 0.05 }} />
    </div>
  );
}
