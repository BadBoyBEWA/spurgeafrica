"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle,
  ChevronRight,
  ImagePlus,
  Link2,
  MessageCircle,
  Ruler,
  Star,
  Upload,
  User,
  X,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */

const outfitTypes = [
  { label: "Agbada", emoji: "👘" },
  { label: "Senator", emoji: "🧥" },
  { label: "Kaftan", emoji: "🩱" },
  { label: "Native Set", emoji: "👔" },
  { label: "Not sure – Help me decide", emoji: "🤔" },
];

const GUIDED_MEASUREMENTS = [
  {
    key: "chest",
    label: "Chest",
    hint: "Wrap the tape around the fullest part of your chest, keeping it parallel to the floor.",
  },
  {
    key: "shoulder",
    label: "Shoulder",
    hint: "Measure from the edge of one shoulder across to the edge of the other shoulder.",
  },
  {
    key: "sleeve",
    label: "Sleeve Length",
    hint: "From the top of your shoulder down to your wrist with your arm slightly bent.",
  },
  {
    key: "topLength",
    label: "Top Length",
    hint: "From the top of your shoulder straight down to where you'd like the garment to end.",
  },
  {
    key: "waist",
    label: "Waist",
    hint: "Wrap the tape around your natural waist — the narrowest part of your torso.",
  },
  {
    key: "hip",
    label: "Hip",
    hint: "Measure around the fullest part of your hips, about 8–10 inches below your waist.",
  },
  {
    key: "trouserLength",
    label: "Trouser Length",
    hint: "From your waist down to where you'd like the trouser hem to fall.",
  },
];

const WHATSAPP_NUMBER = "2348087758855";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */

type MeasurementMethod = "guided" | "upload" | "whatsapp" | "";

interface FormData {
  outfit: string;
  inspirationLink: string;
  inspirationNote: string;
  measurementMethod: MeasurementMethod;
  measurements: Record<string, string>;
  saveMeasurements: boolean;
  name: string;
  phone: string;
  email: string;
  address: string;
}

/* ─────────────────────────────────────────────
   Step labels
───────────────────────────────────────────── */

const STEPS = [
  { label: "Outfit", time: "30s" },
  { label: "Inspiration", time: "45s" },
  { label: "Measurements", time: "2 min" },
  { label: "Contact", time: "30s" },
  { label: "Review", time: "30s" },
];

/* ─────────────────────────────────────────────
   Main page
───────────────────────────────────────────── */

export default function TailoringPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Guided measurement sub-step (0–6)
  const [measureStep, setMeasureStep] = useState(0);

  const [form, setForm] = useState<FormData>({
    outfit: "",
    inspirationLink: "",
    inspirationNote: "",
    measurementMethod: "",
    measurements: {},
    saveMeasurements: false,
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [measurementUpload, setMeasurementUpload] = useState<File | null>(null);

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const setMeasurement = (key: string, value: string) =>
    setForm((prev) => ({
      ...prev,
      measurements: { ...prev.measurements, [key]: value },
    }));

  // Per-step validation
  const canContinue = (() => {
    if (step === 1) return Boolean(form.outfit);
    if (step === 2) return true; // fully optional
    if (step === 3) return Boolean(form.measurementMethod);
    if (step === 4) return Boolean(form.name && form.phone && form.address);
    return true;
  })();

  const next = () => {
    setError("");
    setStep((s) => Math.min(s + 1, 5));
  };
  const back = () => {
    setError("");
    setStep((s) => Math.max(s - 1, 1));
  };

  /* ── Submit ── */
  const handleSubmit = async () => {
    setError("");
    setIsSubmitting(true);
    try {
      const body = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        styleReference: form.outfit,
        inspirationLink: form.inspirationLink,
        inspirationNote: form.inspirationNote,
        measurementMethod: form.measurementMethod,
        measurements: form.measurements,
        saveMeasurements: form.saveMeasurements,
        notes: form.inspirationNote,
      };
      const res = await fetch("/api/tailoring", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Unable to submit request.");
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Success screen ── */
  if (submitted) {
    return (
      <main className="grid min-h-screen place-items-center px-4 pt-24">
        <div className="glass max-w-xl p-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/15">
            <Check className="text-gold" size={32} />
          </div>
          <h1 className="mt-6 font-serif text-4xl text-[var(--fg)]">Request Submitted</h1>
          <p className="mt-4 leading-7 text-muted">
            Our team will review your request and reach out with a personalised quote.
            <br />
            <strong className="text-[var(--fg)]">No payment is required yet.</strong>
          </p>
          <div className="mt-8 border hairline p-5 text-left text-sm text-muted space-y-2">
            <p className="flex items-center gap-2"><CheckCircle size={15} className="text-gold shrink-0" /> Style: <span className="text-[var(--fg)]">{form.outfit || "—"}</span></p>
            <p className="flex items-center gap-2"><CheckCircle size={15} className="text-gold shrink-0" /> Measurements: <span className="text-[var(--fg)] capitalize">{form.measurementMethod === "guided" ? "Guided form" : form.measurementMethod === "upload" ? "Uploaded" : "WhatsApp consultation"}</span></p>
            <p className="flex items-center gap-2"><CheckCircle size={15} className="text-gold shrink-0" /> Contact: <span className="text-[var(--fg)]">{form.phone}</span></p>
          </div>
          <a
            href="/"
            className="mt-8 inline-block bg-gold px-7 py-4 font-display text-xs uppercase tracking-[.22em] text-night"
          >
            Back to Home
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <p className="font-display text-xs uppercase tracking-[.28em] text-gold">Custom Tailoring</p>
        <h1 className="mt-3 font-serif text-5xl text-[var(--fg)]">
          Let&apos;s create your perfect outfit.
        </h1>
        <p className="mt-3 text-muted">The entire process takes under 5 minutes.</p>

        {/* Progress stepper */}
        <div className="mt-8 flex items-center gap-0">
          {STEPS.map((s, i) => {
            const num = i + 1;
            const done = step > num;
            const active = step === num;
            return (
              <div key={s.label} className="flex flex-1 items-center">
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => num < step && setStep(num)}
                    disabled={num >= step}
                    aria-label={`Step ${num}: ${s.label}`}
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition
                      ${done ? "bg-gold text-night cursor-pointer" : active ? "border-2 border-gold text-gold" : "border border-[var(--line)] text-muted"}`}
                  >
                    {done ? <Check size={14} /> : num}
                  </button>
                  <span className={`hidden text-[10px] uppercase tracking-wider sm:block ${active ? "text-gold" : "text-muted"}`}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`mx-1 h-px flex-1 transition ${step > num ? "bg-gold" : "bg-[var(--line)]"}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Step panel */}
        <div className="mt-8 glass p-6 sm:p-10">

          {/* ── STEP 1: Outfit ── */}
          {step === 1 && (
            <div>
              <StepHeader
                number="01"
                title="What are you looking for today?"
                time="30 seconds"
              />
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {outfitTypes.map(({ label, emoji }) => (
                  <button
                    key={label}
                    id={`outfit-${label.replace(/\s+/g, "-").toLowerCase()}`}
                    onClick={() => update("outfit", label)}
                    className={`flex items-center gap-4 border p-5 text-left transition
                      ${form.outfit === label
                        ? "border-gold bg-gold/10 text-gold"
                        : "hairline hover:border-gold/60"}`}
                  >
                    <span className="text-2xl">{emoji}</span>
                    <span className="font-medium">{label}</span>
                    {form.outfit === label && <Check size={16} className="ml-auto text-gold" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 2: Inspiration ── */}
          {step === 2 && (
            <div>
              <StepHeader
                number="02"
                title="Show us what you like."
                time="45 seconds"
                subtitle="This step is completely optional — skip it if you'd like."
              />

              {/* File upload */}
              <div className="mt-6">
                <label
                  htmlFor="inspiration-upload"
                  className="group flex cursor-pointer flex-col items-center gap-3 border border-dashed hairline p-8 text-center transition hover:border-gold/60"
                >
                  <Upload className="text-gold transition group-hover:scale-110" size={30} />
                  <span className="font-serif text-xl text-[var(--fg)]">Upload inspiration photos</span>
                  <span className="text-sm text-muted">JPG, PNG, WEBP — any outfit images you love</span>
                  <input
                    id="inspiration-upload"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    multiple
                    className="sr-only"
                    onChange={(e) => {
                      if (e.target.files) {
                        setUploadedFiles(Array.from(e.target.files));
                      }
                    }}
                  />
                </label>
                {uploadedFiles.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {uploadedFiles.map((f, i) => (
                      <span key={i} className="flex items-center gap-2 border hairline px-3 py-1 text-sm text-muted">
                        <ImagePlus size={13} className="text-gold" />
                        {f.name}
                        <button onClick={() => setUploadedFiles((prev) => prev.filter((_, idx) => idx !== i))}>
                          <X size={13} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Link input */}
              <div className="mt-5">
                <label htmlFor="inspiration-link" className="mb-2 flex items-center gap-2 text-sm text-muted">
                  <Link2 size={14} className="text-gold" />
                  Instagram or Pinterest link
                </label>
                <input
                  id="inspiration-link"
                  type="url"
                  placeholder="https://www.instagram.com/p/..."
                  value={form.inspirationLink}
                  onChange={(e) => update("inspirationLink", e.target.value)}
                  className="w-full border hairline bg-transparent px-4 py-3 text-[var(--fg)] outline-none placeholder:text-muted/50"
                />
              </div>

              {/* Note */}
              <div className="mt-5">
                <label htmlFor="inspiration-note" className="mb-2 block text-sm text-muted">
                  Tell us anything important
                </label>
                <textarea
                  id="inspiration-note"
                  rows={4}
                  placeholder={`"I'd like something similar, but in navy blue."`}
                  value={form.inspirationNote}
                  onChange={(e) => update("inspirationNote", e.target.value)}
                  className="w-full border hairline bg-transparent px-4 py-3 text-[var(--fg)] outline-none placeholder:text-muted/50 resize-none"
                />
              </div>
            </div>
          )}

          {/* ── STEP 3: Measurements ── */}
          {step === 3 && (
            <div>
              {/* Method chooser */}
              {form.measurementMethod === "" && (
                <>
                  <StepHeader
                    number="03"
                    title="How would you like to provide your measurements?"
                    time="~2 minutes"
                  />
                  <div className="mt-6 grid gap-4">

                    <button
                      id="measurement-guided"
                      onClick={() => { update("measurementMethod", "guided"); setMeasureStep(0); }}
                      className="flex items-start gap-5 border hairline p-6 text-left transition hover:border-gold"
                    >
                      <Ruler className="mt-1 shrink-0 text-gold" size={26} />
                      <div>
                        <p className="flex items-center gap-2 font-semibold text-[var(--fg)]">
                          Use our guided measurement form
                          <span className="rounded-full bg-gold/15 px-2 py-0.5 text-xs text-gold flex items-center gap-1">
                            <Star size={10} fill="currentColor" /> Recommended
                          </span>
                        </p>
                        <p className="mt-1 text-sm text-muted">7 essential measurements, one at a time. Takes about 2 minutes.</p>
                      </div>
                      <ChevronRight className="ml-auto mt-1 shrink-0 text-muted" size={18} />
                    </button>

                    <button
                      id="measurement-upload"
                      onClick={() => update("measurementMethod", "upload")}
                      className="flex items-start gap-5 border hairline p-6 text-left transition hover:border-gold"
                    >
                      <Upload className="mt-1 shrink-0 text-gold" size={26} />
                      <div>
                        <p className="font-semibold text-[var(--fg)]">Upload your existing measurements</p>
                        <p className="mt-1 text-sm text-muted">A photo or PDF from your tailor. We&apos;ll read it for you.</p>
                      </div>
                      <ChevronRight className="ml-auto mt-1 shrink-0 text-muted" size={18} />
                    </button>

                    <a
                      id="measurement-whatsapp"
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Spurge%20Africa%2C%20I%20need%20help%20with%20my%20measurements%20for%20a%20custom%20order.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => update("measurementMethod", "whatsapp")}
                      className="flex items-start gap-5 border hairline p-6 text-left transition hover:border-gold"
                    >
                      <MessageCircle className="mt-1 shrink-0 text-gold" size={26} />
                      <div>
                        <p className="font-semibold text-[var(--fg)]">I need help</p>
                        <p className="mt-1 text-sm text-muted">We&apos;ll contact you on WhatsApp to guide you through it.</p>
                      </div>
                      <ChevronRight className="ml-auto mt-1 shrink-0 text-muted" size={18} />
                    </a>

                  </div>
                </>
              )}

              {/* Guided form — active */}
              {form.measurementMethod === "guided" && measureStep < GUIDED_MEASUREMENTS.length && (
                <GuidedMeasurementForm
                  measurements={form.measurements}
                  saveMeasurements={form.saveMeasurements}
                  currentStep={measureStep}
                  onStepChange={setMeasureStep}
                  onMeasurementChange={setMeasurement}
                  onSaveChange={(v) => update("saveMeasurements", v)}
                  onBack={() => { update("measurementMethod", ""); setMeasureStep(0); }}
                />
              )}

              {/* Guided form — complete */}
              {form.measurementMethod === "guided" && measureStep >= GUIDED_MEASUREMENTS.length && (
                <div className="flex flex-col items-center py-8 text-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/15">
                    <Check className="text-gold" size={30} />
                  </div>
                  <h3 className="font-serif text-3xl text-[var(--fg)]">Measurements complete</h3>
                  <p className="max-w-sm text-muted leading-7">
                    All 7 measurements saved.{form.saveMeasurements ? " We'll remember these for your next order." : ""}
                  </p>
                  <button
                    onClick={() => update("measurementMethod", "")}
                    className="text-sm text-muted underline underline-offset-4 hover:text-[var(--fg)] transition"
                  >
                    Edit measurements
                  </button>
                </div>
              )}

              {/* Upload form */}
              {form.measurementMethod === "upload" && (
                <div>
                  <button
                    onClick={() => update("measurementMethod", "")}
                    className="mb-6 flex items-center gap-2 text-sm text-muted hover:text-[var(--fg)] transition"
                  >
                    <ArrowLeft size={14} /> Change method
                  </button>
                  <StepHeader number="03" title="Upload your measurements" time="1 minute" />
                  <label
                    htmlFor="measurement-file"
                    className="mt-6 group flex cursor-pointer flex-col items-center gap-3 border border-dashed hairline p-10 text-center transition hover:border-gold/60"
                  >
                    <Upload className="text-gold transition group-hover:scale-110" size={30} />
                    <span className="font-serif text-xl text-[var(--fg)]">Upload photo or PDF</span>
                    <span className="text-sm text-muted">A measurement sheet from your tailor, a screenshot, anything works.</span>
                    <input
                      id="measurement-file"
                      type="file"
                      accept="image/*,.pdf"
                      className="sr-only"
                      onChange={(e) => e.target.files && setMeasurementUpload(e.target.files[0])}
                    />
                  </label>
                  {measurementUpload && (
                    <p className="mt-3 flex items-center gap-2 text-sm text-muted">
                      <Check size={14} className="text-gold" /> {measurementUpload.name}
                    </p>
                  )}
                </div>
              )}

              {/* WhatsApp selected confirmation */}
              {form.measurementMethod === "whatsapp" && (
                <div>
                  <button
                    onClick={() => update("measurementMethod", "")}
                    className="mb-6 flex items-center gap-2 text-sm text-muted hover:text-[var(--fg)] transition"
                  >
                    <ArrowLeft size={14} /> Change method
                  </button>
                  <div className="flex flex-col items-center py-8 text-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/15">
                      <MessageCircle className="text-green-400" size={30} />
                    </div>
                    <h3 className="font-serif text-2xl text-[var(--fg)]">WhatsApp chat opened</h3>
                    <p className="max-w-sm text-muted leading-7">
                      We&apos;ve opened a WhatsApp conversation for you. Continue filling in your contact details below — our team will guide you through measurements when they reach out.
                    </p>
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Spurge%20Africa%2C%20I%20need%20help%20with%20my%20measurements%20for%20a%20custom%20order.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 flex items-center gap-2 text-sm text-green-400 underline underline-offset-4"
                    >
                      <MessageCircle size={14} /> Open WhatsApp again
                    </a>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ── STEP 4: Contact ── */}
          {step === 4 && (
            <div>
              <StepHeader number="04" title="Almost done — where do we reach you?" time="30 seconds" />
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <FormInput
                  id="contact-name"
                  label="Full Name"
                  required
                  value={form.name}
                  onChange={(v) => update("name", v)}
                  placeholder="Your name"
                />
                <FormInput
                  id="contact-phone"
                  label="Phone Number"
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(v) => update("phone", v)}
                  placeholder="+234 800 000 0000"
                />
                <FormInput
                  id="contact-email"
                  label="Email (optional)"
                  type="email"
                  value={form.email}
                  onChange={(v) => update("email", v)}
                  placeholder="you@example.com"
                />
                <div className="sm:col-span-2">
                  <FormInput
                    id="contact-address"
                    label="Delivery Address"
                    required
                    value={form.address}
                    onChange={(v) => update("address", v)}
                    placeholder="Street, City, State"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 5: Review ── */}
          {step === 5 && (
            <div>
              <StepHeader
                number="05"
                title="Review your request"
                time="30 seconds"
                subtitle="Take a quick look before you submit."
              />
              <div className="mt-6 grid gap-3">
                <SummaryRow
                  icon={<CheckCircle size={16} className="text-gold" />}
                  label="Style"
                  value={form.outfit || "—"}
                />
                <SummaryRow
                  icon={<CheckCircle size={16} className="text-gold" />}
                  label="Inspiration"
                  value={
                    uploadedFiles.length > 0
                      ? `${uploadedFiles.length} photo(s) uploaded`
                      : form.inspirationLink
                      ? form.inspirationLink
                      : form.inspirationNote
                      ? "Note provided"
                      : "None provided"
                  }
                />
                <SummaryRow
                  icon={<CheckCircle size={16} className="text-gold" />}
                  label="Measurements"
                  value={
                    form.measurementMethod === "guided"
                      ? `Guided form (${Object.keys(form.measurements).length}/7 entered)`
                      : form.measurementMethod === "upload"
                      ? measurementUpload?.name ?? "File uploaded"
                      : form.measurementMethod === "whatsapp"
                      ? "WhatsApp consultation"
                      : "—"
                  }
                />
                <SummaryRow
                  icon={<CheckCircle size={16} className="text-gold" />}
                  label="Contact"
                  value={`${form.name} · ${form.phone}`}
                />
                <SummaryRow
                  icon={<CheckCircle size={16} className="text-gold" />}
                  label="Delivery Address"
                  value={form.address || "—"}
                />
              </div>

              <div className="mt-8 border hairline bg-gold/5 p-5">
                <p className="text-sm leading-7 text-muted">
                  <span className="font-semibold text-[var(--fg)]">No payment yet.</span> After reviewing your request, our team will send you a personalised quote. You only pay once everything is agreed.
                </p>
              </div>

              {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
            </div>
          )}

          {/* ── Navigation ── */}
          {/* Hide nav buttons inside active guided measurement sub-flow (it has its own nav) */}
          {!(step === 3 && form.measurementMethod === "guided" && measureStep < GUIDED_MEASUREMENTS.length) && (
            <div className="mt-10 flex items-center justify-between gap-3">
              <button
                disabled={step === 1}
                onClick={back}
                id="step-back"
                className="flex items-center gap-2 border hairline px-5 py-3 text-sm transition hover:border-gold/60 disabled:opacity-30"
              >
                <ArrowLeft size={15} /> Back
              </button>

              {step < 5 ? (
                <div className="flex items-center gap-3">
                  {step === 2 && (
                    <button
                      id="inspiration-skip"
                      onClick={next}
                      className="text-sm text-muted underline underline-offset-4 hover:text-[var(--fg)] transition"
                    >
                      Skip this step
                    </button>
                  )}
                  <button
                    id="step-next"
                    disabled={!canContinue}
                    onClick={next}
                    className="flex items-center gap-2 bg-gold px-7 py-3 font-display text-xs uppercase tracking-[.2em] text-night transition hover:bg-terracotta hover:text-cream disabled:opacity-40"
                  >
                    Next <ArrowRight size={15} />
                  </button>
                </div>
              ) : (
                <button
                  id="submit-request"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                  className="flex items-center gap-2 bg-gold px-8 py-4 font-display text-xs uppercase tracking-[.2em] text-night transition hover:bg-terracotta hover:text-cream disabled:opacity-40"
                >
                  {isSubmitting ? "Submitting…" : "Submit My Request"}
                  {!isSubmitting && <ArrowRight size={15} />}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Step time hint */}
        <p className="mt-4 text-center text-xs text-muted">
          Step {step} of 5 · {STEPS[step - 1].label} · ~{STEPS[step - 1].time}
        </p>

      </div>
    </main>
  );
}

/* ─────────────────────────────────────────────
   Guided Measurement Form (sub-component)
───────────────────────────────────────────── */

function GuidedMeasurementForm({
  measurements,
  saveMeasurements,
  currentStep,
  onStepChange,
  onMeasurementChange,
  onSaveChange,
  onBack,
}: {
  measurements: Record<string, string>;
  saveMeasurements: boolean;
  currentStep: number;
  onStepChange: (s: number) => void;
  onMeasurementChange: (key: string, value: string) => void;
  onSaveChange: (v: boolean) => void;
  onBack: () => void;
}) {
  const current = GUIDED_MEASUREMENTS[currentStep];
  const totalSteps = GUIDED_MEASUREMENTS.length;
  const isLast = currentStep === totalSteps - 1;

  const goNext = () => {
    if (!isLast) onStepChange(currentStep + 1);
  };
  const goPrev = () => {
    if (currentStep === 0) onBack();
    else onStepChange(currentStep - 1);
  };

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={goPrev}
            className="flex items-center gap-1 text-xs text-muted hover:text-[var(--fg)] transition"
          >
            <ArrowLeft size={13} /> {currentStep === 0 ? "Change method" : "Back"}
          </button>
          <span className="text-xs text-muted">{currentStep + 1} of {totalSteps}</span>
        </div>

        {/* Track */}
        <div className="flex gap-1.5">
          {GUIDED_MEASUREMENTS.map((m, i) => (
            <div
              key={m.key}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                i < currentStep
                  ? "bg-gold"
                  : i === currentStep
                  ? "bg-gold/60"
                  : "bg-[var(--line)]"
              }`}
            />
          ))}
        </div>

        {/* Completion ticks below */}
        <div className="flex gap-1.5 mt-1">
          {GUIDED_MEASUREMENTS.map((m, i) => (
            <div key={m.key} className="flex-1 flex justify-center">
              {i < currentStep ? (
                <span className="text-[9px] text-gold">✓</span>
              ) : (
                <span className="text-[9px] text-muted">{m.label.split(" ")[0]}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Measurement question */}
      <div className="text-center">
        <p className="font-display text-xs uppercase tracking-[.24em] text-gold mb-2">
          Measurement {currentStep + 1}
        </p>
        <h3 className="font-serif text-4xl text-[var(--fg)]">{current.label}</h3>

        {/* Illustration placeholder */}
        <div className="mx-auto mt-8 flex h-40 w-40 items-center justify-center rounded-full bg-gold/8 border hairline">
          <Ruler className="text-gold/60" size={48} />
        </div>

        <p className="mt-6 mx-auto max-w-sm text-sm leading-7 text-muted">{current.hint}</p>

        {/* Input */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <input
            id={`measurement-${current.key}`}
            type="number"
            min="0"
            step="0.5"
            placeholder="0"
            value={measurements[current.key] || ""}
            onChange={(e) => onMeasurementChange(current.key, e.target.value)}
            className="w-32 border-b-2 border-gold bg-transparent py-2 text-center text-3xl font-serif text-[var(--fg)] outline-none placeholder:text-muted/30"
          />
          <span className="text-xl text-muted">cm</span>
        </div>
      </div>

      {/* Save measurements (shown on last step) */}
      {isLast && (
        <label className="mt-8 flex cursor-pointer items-center gap-3 border hairline p-4 hover:border-gold/60 transition">
          <div
            className={`flex h-5 w-5 shrink-0 items-center justify-center border transition ${
              saveMeasurements ? "border-gold bg-gold" : "hairline"
            }`}
          >
            {saveMeasurements && <Check size={12} className="text-night" />}
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--fg)]">Save my measurements</p>
            <p className="text-xs text-muted">Next time you order, we&apos;ll pre-fill these for you — one click.</p>
          </div>
          <input
            type="checkbox"
            className="sr-only"
            checked={saveMeasurements}
            onChange={(e) => onSaveChange(e.target.checked)}
          />
        </label>
      )}

      {/* Nav */}
      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={goPrev}
          className="flex items-center gap-2 border hairline px-5 py-3 text-sm transition hover:border-gold/60"
        >
          <ArrowLeft size={15} /> Back
        </button>

        {isLast ? (
          // Last measurement — "Done" takes us back to main step navigation
          <button
            id="guided-done"
            onClick={() => {
              // signal parent that guided form is complete — parent's Next button will show
              onStepChange(totalSteps); // out-of-bounds triggers "done" state
            }}
            className="flex items-center gap-2 bg-gold px-7 py-3 font-display text-xs uppercase tracking-[.2em] text-night"
          >
            Done <Check size={15} />
          </button>
        ) : (
          <button
            id={`guided-next-${current.key}`}
            onClick={goNext}
            className="flex items-center gap-2 bg-gold px-7 py-3 font-display text-xs uppercase tracking-[.2em] text-night"
          >
            Next <ArrowRight size={15} />
          </button>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */

function StepHeader({
  number,
  title,
  time,
  subtitle,
}: {
  number: string;
  title: string;
  time: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-1">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-serif text-3xl text-[var(--fg)]">{title}</h2>
        <span className="shrink-0 font-display text-xs uppercase tracking-[.2em] text-gold">~{time}</span>
      </div>
      {subtitle && <p className="mt-2 text-sm text-muted">{subtitle}</p>}
    </div>
  );
}

function FormInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label htmlFor={id} className="grid gap-2 text-sm text-muted">
      {label}
      {required && <span className="sr-only"> (required)</span>}
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="border hairline bg-transparent px-4 py-3 text-[var(--fg)] outline-none placeholder:text-muted/40"
      />
    </label>
  );
}

function SummaryRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 border hairline p-4">
      <span className="mt-0.5 shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs uppercase tracking-wider text-muted">{label}</p>
        <p className="mt-0.5 truncate text-sm font-medium text-[var(--fg)]">{value}</p>
      </div>
    </div>
  );
}


