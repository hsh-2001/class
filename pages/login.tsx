import SInput from "@/components/ui/SInput";
import useAthentication from "@/hooks/useAthentication";

export default function Login() {
  const {
    errorMessage,
    isSubmitting,
    loginModel,
    setLoginModel,
    handleSubmit,
  } = useAthentication();

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-md rounded-4xl border border-slate-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
          Class System
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-950">Sign in</h1>
        <p className="mt-2 text-sm text-slate-600">
          Access the management portal with your account credentials.
        </p>

        <form className="mt-8 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
            <SInput
              type="email"
              placeholder="admin@classsystem.com"
              value={loginModel.email}
              onChange={(value) => setLoginModel({ ...loginModel, email: String(value) })}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
            <SInput
              type="password"
              placeholder="Enter your password"
              value={loginModel.password}
              onChange={(value) => setLoginModel({ ...loginModel, password: String(value) })}
            />
          </label>

          {errorMessage ? (
            <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {errorMessage}
            </p>
          ) : null}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Continue"}
          </button>
        </form>
      </section>
    </main>
  );
}

Login.disableLayout = true;
