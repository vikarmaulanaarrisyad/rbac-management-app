import Link from "next/link";

const Home = async () => {
  const user = false;

  return (
    <div className="relative overflow-hidden">
      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full"></div>

      <div className="max-w-6xl mx-auto px-6 py-16 relative z-10">
        {/* HERO */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white leading-tight mb-6">
            Manage Access <br />
            <span className="text-blue-500">Like a Pro</span>
          </h1>

          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Powerful Role-Based Access Control system to manage users,
            permissions, and secure your application with ease.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            {user ? (
              <Link
                href="/dashboard"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition"
              >
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition"
                >
                  Get Started
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-3 border border-slate-600 text-slate-300 hover:text-white hover:border-slate-400 rounded-xl transition"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>

        {/* FEATURES */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {[
            {
              title: "Secure Access",
              desc: "Protect routes with advanced middleware and permission checks.",
              icon: "🔐",
            },
            {
              title: "Flexible Roles",
              desc: "Easily manage user roles like Admin, Manager, and User.",
              icon: "👥",
            },
            {
              title: "Scalable System",
              desc: "Built for performance and ready to grow with your app.",
              icon: "⚡",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-slate-800/60 backdrop-blur border border-slate-700 rounded-2xl p-6 hover:scale-[1.03] transition shadow-lg"
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="text-white font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* ROLE SECTION */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-8 mb-20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            User Roles
          </h2>

          <div className="grid md:grid-cols-4 gap-4 text-center">
            {[
              {
                role: "Super Admin",
                desc: "Full system control",
              },
              {
                role: "Admin",
                desc: "Manage users & teams",
              },
              {
                role: "Manager",
                desc: "Team-specific control",
              },
              {
                role: "User",
                desc: "Basic access",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-slate-900 border border-slate-700 hover:border-blue-500 transition"
              >
                <h4 className="text-white font-semibold">{item.role}</h4>
                <p className="text-sm text-slate-400 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA SECTION */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-10 shadow-xl">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-blue-100 mb-6">
            Start managing your team access today with a powerful RBAC system.
          </p>

          {user ? (
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-slate-200 transition"
            >
              Open Dashboard
            </Link>
          ) : (
            <Link
              href="/register"
              className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-slate-200 transition"
            >
              Create Account
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
