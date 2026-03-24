import SButton from "@/components/ui/SButton";
import SInput from "@/components/ui/SInput";
import useAthentication from "@/hooks/useAthentication";
import { useTranslation } from "react-i18next";

export default function Login() {
  const { t } = useTranslation();
  const {
    errorMessage,
    isSubmitting,
    loginModel,
    setLoginModel,
    handleSubmit,
  } = useAthentication();

  return (
    <main className="flex h-full items-center justify-center px-4 py-10">
      <section className="w-full max-w-md rounded-4xl border border-slate-100 bg-slate-50 dark:bg-slate-800/95 dark:border-white/10 p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700 dark:text-sky-400">
          {t("common.systemName")}
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-950 dark:text-slate-100">{t("login.signIn")}</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          {t("login.description")}
        </p>

        <form className="mt-8 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">{t("login.email")}</span>
            <SInput
              type="email"
              placeholder={t("login.emailPlaceholder")}
              value={loginModel.email}
              onChange={(value) => setLoginModel({ ...loginModel, email: String(value) })}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">{t("login.password")}</span>
            <SInput
              type="password"
              placeholder={t("login.passwordPlaceholder")}
              value={loginModel.password}
              onChange={(value) => setLoginModel({ ...loginModel, password: String(value) })}
            />
          </label>

          {errorMessage ? (
            <p className="rounded-2xl border border-rose-200 bg-rose-50 dark:bg-rose-900/50 dark:border-rose-700/50 px-4 py-3 text-sm text-rose-700 dark:text-rose-300">
              {errorMessage}
            </p>
          ) : null}

          <SButton
            type="submit"
            className="w-full"
            onClick={() => handleSubmit()}
            disabled={isSubmitting}
          >
            {isSubmitting ? t("login.signingIn") : t("login.signIn")}
          </SButton>
        </form>
      </section>
    </main>
  );
}

Login.disableLayout = true;
