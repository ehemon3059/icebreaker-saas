"use client";

import { useState } from "react";
import { Loader2, Copy, Check, ArrowRight } from "lucide-react";
import posthog from "posthog-js";

type State = "idle" | "loading" | "success" | "error" | "rateLimited";

interface FormData {
  name: string;
  jobTitle: string;
  company: string;
  website: string;
}

export default function LiveDemo() {
  const [state, setState] = useState<State>("idle");
  const [form, setForm] = useState<FormData>({
    name: "",
    jobTitle: "",
    company: "",
    website: "",
  });
  const [icebreaker, setIcebreaker] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/generate-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.status === 429) {
        setState("rateLimited");
        return;
      }

      if (!res.ok) {
        setErrorMsg(data.error ?? "Something went wrong. Please try again.");
        setState("error");
        return;
      }

      setIcebreaker(data.icebreaker);
      setState("success");
      posthog.capture("demo_tried");
    } catch {
      setErrorMsg("Network error. Please check your connection and try again.");
      setState("error");
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(icebreaker);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section id="demo" className="bg-blue-50 px-4 py-16 md:py-24">
      <div className="mx-auto max-w-2xl">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-3xl font-bold text-gray-900 md:text-4xl">
            Try It Right Now — Free
          </h2>
          <p className="text-gray-600">
            No account needed. Enter a lead and see what our AI generates in
            seconds.
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm md:p-8">
          {/* Idle / Loading — show form */}
          {(state === "idle" || state === "loading" || state === "error") && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Jane Smith"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="jobTitle"
                    required
                    value={form.jobTitle}
                    onChange={handleChange}
                    placeholder="VP of Sales"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Company <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="company"
                    required
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Acme Corp"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Website{" "}
                    <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={form.website}
                    onChange={handleChange}
                    placeholder="https://acme.com"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {state === "error" && (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={state === "loading"}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
              >
                {state === "loading" ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Crafting your icebreaker…
                  </>
                ) : (
                  "Generate My Icebreaker — Free"
                )}
              </button>
            </form>
          )}

          {/* Success state */}
          {state === "success" && (
            <div className="space-y-6">
              <div className="rounded-lg border border-blue-100 bg-blue-50 p-5">
                <p className="text-base leading-relaxed text-gray-900 md:text-lg">
                  {icebreaker}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleCopy}
                  className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  {copied ? (
                    <>
                      <Check size={16} className="text-green-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      Copy
                    </>
                  )}
                </button>

                <a
                  href="/login"
                  className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  Want more? Sign up free
                  <ArrowRight size={16} />
                </a>
              </div>

              <button
                onClick={() => {
                  setState("idle");
                  setForm({ name: "", jobTitle: "", company: "", website: "" });
                }}
                className="text-sm text-gray-500 underline underline-offset-2 hover:text-gray-700"
              >
                Try another lead
              </button>
            </div>
          )}

          {/* Rate limited state */}
          {state === "rateLimited" && (
            <div className="space-y-5 text-center">
              <div className="rounded-lg bg-amber-50 px-5 py-4 text-sm text-amber-800">
                You&apos;ve used your free demo. Sign up to keep generating.
              </div>
              <a
                href="/login"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Sign up free — no credit card needed
                <ArrowRight size={16} />
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
