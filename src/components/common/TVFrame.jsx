import FilmGrain from './FilmGrain';

export default function TVFrame() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden pointer-events-none">
      {/* Base Grain */}
      <FilmGrain />

      {/* CRT Scanlines */}
      <div className="absolute inset-0 tv-overlay opacity-20 mix-blend-overlay" />

      {/* Screen Curve Vignette - Subtler */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_60%,rgba(0,0,0,0.6)_100%)]" />
    </div>
  );
}
