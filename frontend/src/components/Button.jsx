// Couleurs façon iPhone
const variants = {
  digit: "bg-[#333333] text-white active:bg-[#737373]",
  func: "bg-[#A5A5A5] text-black active:bg-[#D9D9D9]",
  operator: "bg-[#FF9F0A] text-white active:bg-[#FCC78A]",
  operatorActive: "bg-white text-[#FF9F0A]",
  ghost: "bg-transparent text-[#A5A5A5] active:text-white",
};

const sizes = {
  key: "aspect-square w-full font-medium", // touche ronde
  wide: "w-full font-medium justify-start", // touche 0 (pilule)
  icon: "h-10 w-10", // petit bouton avec icône
};

// Taille du texte en style inline : il passe devant n'importe quel CSS global
const fontSizes = {
  key: "1.875rem",
  wide: "1.875rem",
  icon: "1.5rem",
};

export default function Button({
  children,
  onClick,
  variant = "digit",
  size = "key",
  label,
  className = "",
  style,
  ...props
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`flex select-none items-center justify-center transition-colors duration-150 ${variants[variant]} ${sizes[size]} ${className}`}
      // Le style inline écrase le CSS par défaut de Vite (button { border-radius... })
      style={{
        borderRadius: "9999px",
        border: "none",
        outline: "none",
        padding: size === "wide" ? "0 0 0 2rem" : 0,
        fontSize: fontSizes[size],
        lineHeight: 1,
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}