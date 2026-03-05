export default function LoginFooter() {
  return (
    <div className="mt-6 text-center">
      <p className="text-sm text-slate-500">Need technical assistance?</p>
      <a
        href="mailto:support@physicsacademy.com"
        className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-200"
      >
        Contact System Administrator
      </a>

      {/* Page Footer */}
      <div className="mt-8 text-xs text-slate-400 leading-relaxed">
        © 2026 BUILD RIGHT STUDIOS
        <br />
        Authorized Access Only
      </div>
    </div>
  );
}