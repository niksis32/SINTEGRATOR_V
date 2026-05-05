export default function MaterialIcon({ name, className = '', filled = false, style: styleProp }) {
  const fillStyle = filled
    ? { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24", ...styleProp }
    : styleProp;
  return (
    <span className={`material-symbols-outlined ${className}`.trim()} style={fillStyle} aria-hidden="true">
      {name}
    </span>
  );
}
