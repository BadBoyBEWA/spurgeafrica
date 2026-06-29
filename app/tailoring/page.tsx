"use client";

import { useMemo, useState } from "react";
import { Check, ImagePlus, Ruler, Upload } from "lucide-react";

const outfitTypes = ["Agbada", "Senator", "Kaftan", "Casual Native", "Others"];
const fabrics = ["Ankara", "Cashmere", "Lace", "Guinea Brocade", "Senator Material", "Not Sure"];
const measurementFields = [
  "height", "neck", "shoulder", "chest", "waist", "hip", "sleeve length", "arm circumference",
  "wrist", "top length", "trouser waist", "thigh", "knee", "trouser length", "ankle"
];

export default function TailoringPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({
    outfit: "",
    fabric: "",
    fit: "",
    occasion: "",
    payment: ""
  });

  const canContinue = useMemo(() => {
    if (step === 1) return Boolean(form.outfit);
    if (step === 3) return Boolean(form.fabric);
    if (step === 4) return Boolean(form.name && form.email && form.phone && form.height && form.chest && form.waist && form.fit);
    if (step === 5) return Boolean(form.address && form.state && form.country);
    if (step === 6) return Boolean(form.payment);
    return true;
  }, [form, step]);

  const update = (key: string, value: string) => setForm(current => ({ ...current, [key]: value }));

  if (submitted) {
    return (
      <main className="grid min-h-screen place-items-center px-4 pt-24">
        <div className="glass max-w-xl p-10 text-center">
          <Check className="mx-auto text-gold" size={42} />
          <h1 className="mt-5 font-serif text-5xl">Order Submitted Successfully</h1>
          <p className="mt-4 text-muted">A Spurge Africa style consultant will review your details and contact you with the next step.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="font-display text-xs uppercase tracking-[.28em] text-gold">Custom tailoring</p>
        <h1 className="mt-3 font-serif text-5xl">Build your bespoke order</h1>
        <div className="mt-8 grid grid-cols-6 gap-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setStep(index + 1)}
              className={`h-2 transition ${step >= index + 1 ? "bg-gold" : "bg-white/15 light:bg-black/15"}`}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>

        <section className="mt-8 glass p-5 sm:p-8">
          {step === 1 && (
            <Step title="Choose outfit type">
              <div className="grid gap-4 sm:grid-cols-3">
                {outfitTypes.map(type => (
                  <Choice key={type} active={form.outfit === type} onClick={() => update("outfit", type)}>{type}</Choice>
                ))}
              </div>
            </Step>
          )}

          {step === 2 && (
            <Step title="Upload inspiration images">
              <label className="grid min-h-72 cursor-pointer place-items-center border border-dashed hairline p-8 text-center">
                <input type="file" accept="image/png,image/jpeg" multiple className="sr-only" />
                <span>
                  <Upload className="mx-auto text-gold" size={38} />
                  <span className="mt-4 block font-serif text-2xl">Drag and drop JPG or PNG files</span>
                  <span className="mt-2 block text-sm text-muted">Use references for neckline, embroidery, fit, or fabric mood.</span>
                </span>
              </label>
            </Step>
          )}

          {step === 3 && (
            <Step title="Fabric preference">
              <div className="grid gap-4 sm:grid-cols-3">
                {fabrics.map(fabric => (
                  <Choice key={fabric} active={form.fabric === fabric} onClick={() => update("fabric", fabric)}>{fabric}</Choice>
                ))}
              </div>
            </Step>
          )}

          {step === 4 && (
            <Step title="Measurements and fit">
              <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
                <div className="grid gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {["name", "email", "phone", "gender", "country"].map(field => (
                      <Input key={field} label={field} value={form[field] || ""} onChange={value => update(field, value)} />
                    ))}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {measurementFields.map(field => (
                      <Input key={field} label={`${field} (in)`} value={form[field] || ""} onChange={value => update(field, value)} />
                    ))}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Select label="fit preference" value={form.fit} options={["", "slim", "regular", "relaxed"]} onChange={value => update("fit", value)} />
                    <Select label="occasion" value={form.occasion} options={["", "wedding", "corporate", "casual", "traditional"]} onChange={value => update("occasion", value)} />
                  </div>
                  <label className="grid gap-2 text-sm capitalize text-muted">
                    additional notes
                    <textarea rows={4} value={form.notes || ""} onChange={event => update("notes", event.target.value)} className="border hairline bg-transparent p-3 text-[var(--fg)] outline-none" />
                  </label>
                </div>
                <div className="border hairline p-6">
                  <Ruler className="text-gold" size={34} />
                  <h3 className="mt-5 font-serif text-2xl">Measurement guide</h3>
                  <div className="mt-6 grid aspect-[2/3] place-items-center border border-dashed hairline">
                    <ImagePlus className="text-muted" size={48} />
                  </div>
                  <p className="mt-4 text-sm leading-7 text-muted">Measure over light clothing, keep tape flat, and avoid pulling tight.</p>
                </div>
              </div>
            </Step>
          )}

          {step === 5 && (
            <Step title="Delivery information">
              <div className="grid gap-4 sm:grid-cols-2">
                {["address", "state", "country", "postal code", "preferred delivery date"].map(field => (
                  <Input key={field} label={field} value={form[field] || ""} onChange={value => update(field, value)} />
                ))}
              </div>
            </Step>
          )}

          {step === 6 && (
            <Step title="Payment and summary">
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="grid gap-4">
                  {["Deposit Payment", "Full Payment"].map(option => (
                    <Choice key={option} active={form.payment === option} onClick={() => update("payment", option)}>{option}</Choice>
                  ))}
                </div>
                <div className="border hairline p-5 text-sm text-muted">
                  <h3 className="font-serif text-2xl text-[var(--fg)]">Order summary</h3>
                  <p className="mt-4">Outfit: {form.outfit || "Not selected"}</p>
                  <p>Fabric: {form.fabric || "Not selected"}</p>
                  <p>Fit: {form.fit || "Not selected"}</p>
                  <p>Delivery: {form.state || "Pending"}, {form.country || "Pending"}</p>
                </div>
              </div>
            </Step>
          )}

          <div className="mt-8 flex justify-between gap-3">
            <button disabled={step === 1} onClick={() => setStep(step - 1)} className="border hairline px-5 py-3 disabled:opacity-35">Back</button>
            {step < 6 ? (
              <button disabled={!canContinue} onClick={() => setStep(step + 1)} className="bg-gold px-6 py-3 font-semibold text-night disabled:opacity-40">Continue</button>
            ) : (
              <button disabled={!canContinue} onClick={() => setSubmitted(true)} className="bg-gold px-6 py-3 font-semibold text-night disabled:opacity-40">Submit Order</button>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <h2 className="mb-6 font-serif text-3xl">{title}</h2>
      {children}
    </>
  );
}

function Choice({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`border p-5 text-left transition ${active ? "border-gold bg-gold/12 text-gold" : "hairline hover:border-gold"}`}>
      {children}
    </button>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2 text-sm capitalize text-muted">
      {label}
      <input value={value} onChange={event => onChange(event.target.value)} className="border hairline bg-transparent px-3 py-3 text-[var(--fg)] outline-none" />
    </label>
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2 text-sm capitalize text-muted">
      {label}
      <select value={value} onChange={event => onChange(event.target.value)} className="border hairline bg-transparent px-3 py-3 text-[var(--fg)] outline-none">
        {options.map(option => <option key={option} value={option}>{option || "Select"}</option>)}
      </select>
    </label>
  );
}
