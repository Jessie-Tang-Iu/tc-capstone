import LabelValue from "./InfoCard";

export default function AnswerPreview({ title, app }) {
  return (
    <section className="space-y-3">
      <div className="border border-gray-200 rounded-lg bg-white">
        <div className="px-4 py-3 border-b border-gray-200 text-base font-bold rounded-t-lg text-black bg-[#F3E1D5]">{title}</div>
        <div className="p-4 grid gap-3">
          {(app && app.questions?.length > 0) ? (
            app.questions.map((qa, idx) => (
              <LabelValue key={idx} label={qa} value={app.answers[idx]} />
            ))
          ) : (
            <div className="border border-gray-200 rounded-md p-3 bg-white text-base font-bold text-black">No questions provided.</div>
          )}
        </div>
      </div>
    </section>
  );
}