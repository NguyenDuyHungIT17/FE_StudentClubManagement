export default function Button({ children, onClick, className = "", variant = "default" }) {
  const base = "px-4 py-2 rounded font-medium transition";
  const variants = {
    default: "bg-orange-600 text-white hover:bg-orange-700",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
