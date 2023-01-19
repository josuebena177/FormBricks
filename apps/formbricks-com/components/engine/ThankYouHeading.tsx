import { SurveyElement } from "./engineTypes";

export default function ThankYouHeading({ element }: { element: SurveyElement }) {
  return (
    <div className="text-center">
      <h2 className="mt-3 text-xl font-bold text-slate-700 dark:text-slate-100 sm:text-2xl md:text-3xl">
        We’re onboarding new users <span className="text-brand">regularly!</span>
      </h2>
      <p className="mt-4 text-slate-500 dark:text-slate-300">
        Thank you for signing up. We will be in touch shortly.
      </p>
    </div>
  );
}
