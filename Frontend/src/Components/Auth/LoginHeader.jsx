export default function LoginHeader() {
  return (
    <div className="flex flex-col items-center mb-8">
      {/* Icon */}
      <div className="w-18 h-18 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mb-5 shadow-sm"
           style={{ width: "72px", height: "72px" }}>
        <span className="text-3xl">⚛️</span>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-extrabold text-blue-950 tracking-tight mb-2 font-inter ">
        Admin Login
      </h1>

      {/* Subtitle */}
      <p className="text-sm text-slate-500 text-center leading-relaxed">
        Sign in to manage records.
      </p>
    </div>
  );
}