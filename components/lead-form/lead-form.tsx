"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/primitives/button";
import { Input } from "@/components/ui/primitives/input";
import { Label } from "@/components/ui/primitives/label";
import { Checkbox } from "@/components/ui/primitives/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/primitives/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/primitives/card";
import { CheckCircle2, ChevronRight, Loader2, User, Building2, Landmark, Handshake, Truck, HelpCircle } from "lucide-react";
import { BETUMES_EMULSAO_LABEL, cn } from "@/lib/utils";
import { createLead, type CreateLeadInput } from "@/app/leads/actions";
import { COMPANY_SECTORS, JOB_TITLES } from "@/components/lead-form/lead-form-options";
import { SearchableSelect } from "@/components/lead-form/searchable-select";
import { appPath, useAppBasePath } from "@/lib/navigation";

type Profile = "particular" | "empresa" | "orgao_publico" | "fornecedor" | "parceiro" | "outro";

interface FormData {
  // Step 1: Identification
  fullName: string;
  phone: string;
  email: string;
  province: string;
  municipality: string;

  // Step 2: Profile
  profile: Profile | "";

  // Company
  companyName: string;
  sector: string;
  jobTitle: string;

  // Existing client
  isExistingClient: boolean | null;
  existingClientAreas: string[];
  existingClientAreasOther: string;

  // Solutions
  solutions: string[];

  // Particular conditionals
  lubricantVehicleTypeParticular: string;
  usesViaApp: boolean | null;
  cardPurposeParticular: string;

  // Empresa conditionals
  combustiveisPurpose: string;
  combustiveisConsumption: string;
  lubricantVehicleCountEmpresa: string;
  frotaVehicleCount: string;
  frotaInterest: string;
  angobetumesInterest: string;
  angobetumesActivity: string;
  aviacaoOperationType: string;
  cardPurposeEmpresa: string;

  // Fornecedor / Parceiro
  supplierArea: string;
  partnerArea: string;

  // Commercial qualification
  purchaseTimeline: string;
  wantsContact: boolean | null;
  contactPreference: string[];

  // Consent
  gdprConsent: boolean;
}

const INITIAL: FormData = {
  fullName: "", phone: "", email: "", province: "", municipality: "",
  profile: "",
  companyName: "", sector: "", jobTitle: "",
  isExistingClient: null, existingClientAreas: [], existingClientAreasOther: "",
  solutions: [],
  lubricantVehicleTypeParticular: "", usesViaApp: null, cardPurposeParticular: "",
  combustiveisPurpose: "", combustiveisConsumption: "",
  lubricantVehicleCountEmpresa: "", frotaVehicleCount: "", frotaInterest: "",
  angobetumesInterest: "", angobetumesActivity: "", aviacaoOperationType: "", cardPurposeEmpresa: "",
  supplierArea: "", partnerArea: "",
  purchaseTimeline: "", wantsContact: null, contactPreference: [],
  gdprConsent: false,
};

const EXISTING_CLIENT_AREAS = [
  { value: "combustiveis", label: "Combustíveis" },
  { value: "lubrificantes", label: "Lubrificantes" },
  { value: "gas", label: "Gás" },
  { value: "aviacao", label: "Aviação" },
  { value: "cartoes_frota", label: "Cartões de Frota" },
  { value: "loja_conveniencia", label: "Loja de Conveniência" },
  { value: "servicos_maritimos", label: "Serviços Marítimos" },
  { value: "outros", label: "Outros" },
];

const PARTICULAR_SOLUTIONS = [
  { value: "combustiveis", label: "Combustíveis" },
  { value: "lubrificantes", label: "Lubrificantes" },
  { value: "via", label: "VIA" },
  { value: "cartao_presente", label: "Cartão Presente" },
  { value: "frota_mais", label: "Serviço Frota+" },
  { value: "patrocinios", label: "Patrocínios" },
  { value: "outros", label: "Outros" },
];

const EMPRESA_SOLUTIONS = [
  { value: "combustiveis", label: "Combustíveis" },
  { value: "lubrificantes", label: "Lubrificantes" },
  { value: "frota_mais", label: "Frota+" },
  { value: "cartao_presente", label: "Cartão Presente" },
  { value: "angobetumes", label: BETUMES_EMULSAO_LABEL },
  { value: "aviacao", label: "Aviação" },
  { value: "patrocinios", label: "Patrocínios" },
  { value: "outros", label: "Outros" },
];

const PROVINCES = [
  "Bengo", "Benguela", "Bié", "Cabinda", "Cuando Cubango",
  "Cuanza Norte", "Cuanza Sul", "Cunene", "Huambo", "Huíla",
  "Luanda", "Lunda Norte", "Lunda Sul", "Malanje", "Moxico",
  "Namibe", "Uíge", "Zaire",
];

const LEAD_FORM_FIELD_CLASS = "text-base md:text-sm";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function SectionTitle({ children, icon: Icon }: { children: React.ReactNode; icon?: React.ElementType }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      {Icon && <Icon className="h-5 w-5 text-brand shrink-0" />}
      <h3 className="font-semibold text-slate-800 text-base">{children}</h3>
    </div>
  );
}

function FieldGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("grid gap-4", className)}>{children}</div>;
}

function CheckboxOption({
  value, label, checked, onChange,
}: { value: string; label: string; checked: boolean; onChange: (v: string, c: boolean) => void }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <Checkbox
        checked={checked}
        onCheckedChange={(c) => onChange(value, Boolean(c))}
      />
      <span className="text-sm text-slate-700 group-hover:text-slate-900">{label}</span>
    </label>
  );
}

function RadioOption({
  name, value, label, currentValue, onChange,
}: { name: string; value: string; label: string; currentValue: string; onChange: (v: string) => void }) {
  return (
    <label className={cn(
      "flex items-center gap-2.5 cursor-pointer p-3 rounded-lg border transition-colors",
      currentValue === value
        ? "border-brand bg-brand-light"
        : "border-slate-200 hover:border-brand/50"
    )}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={currentValue === value}
        onChange={() => onChange(value)}
        className="accent-brand"
      />
      <span className="text-sm font-medium">{label}</span>
    </label>
  );
}

const PROFILE_OPTIONS = [
  { value: "particular", label: "Particular", icon: User, desc: "Pessoa singular" },
  { value: "empresa", label: "Empresa", icon: Building2, desc: "Empresa privada" },
  { value: "orgao_publico", label: "Órgão Público", icon: Landmark, desc: "Entidade pública" },
  { value: "fornecedor", label: "Potencial Fornecedor", icon: Truck, desc: "Fornecedor de produtos/serviços" },
  { value: "parceiro", label: "Potencial Parceiro", icon: Handshake, desc: "Parceiro de negócio" },
  { value: "outro", label: "Outro", icon: HelpCircle, desc: "Outro perfil" },
];

export function LeadForm({ submittedBy }: { submittedBy?: string }) {
  const isPublic = !submittedBy;
  const router = useRouter();
  const basePath = useAppBasePath();
  const [data, setData] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(1);

  const isEmpresa = data.profile === "empresa" || data.profile === "orgao_publico";
  const isParticular = data.profile === "particular";
  const isFornecedor = data.profile === "fornecedor";
  const isParceiro = data.profile === "parceiro";

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function toggleArray(key: keyof FormData, value: string, checked: boolean) {
    setData((prev) => {
      const arr = (prev[key] as string[]) ?? [];
      return {
        ...prev,
        [key]: checked ? [...arr, value] : arr.filter((v) => v !== value),
      };
    });
  }

  function getSolutions() {
    if (isParticular) return PARTICULAR_SOLUTIONS;
    if (isEmpresa) return EMPRESA_SOLUTIONS;
    return [];
  }

  function validateStep1(): boolean {
    const e: typeof errors = {};
    if (!data.fullName.trim()) e.fullName = "Nome obrigatório";
    if (!data.phone.trim()) e.phone = "Telefone obrigatório";
    if (!data.email.trim()) e.email = "E-mail obrigatório";
    else if (!isValidEmail(data.email)) e.email = "E-mail inválido";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateEmailField() {
    if (!data.email.trim()) {
      setErrors((prev) => ({ ...prev, email: "E-mail obrigatório" }));
      return;
    }
    if (!isValidEmail(data.email)) {
      setErrors((prev) => ({ ...prev, email: "E-mail inválido" }));
      return;
    }
    setErrors((prev) => {
      const next = { ...prev };
      delete next.email;
      return next;
    });
  }

  const needsSolutions = isParticular || isEmpresa;

  function validateStep2(): boolean {
    const e: typeof errors = {};
    if (!data.profile) e.profile = "Seleccione um perfil";
    if (isEmpresa) {
      if (!data.companyName.trim()) e.companyName = "Nome da empresa obrigatório";
      if (!data.sector.trim()) e.sector = "Sector obrigatório";
      if (!data.jobTitle.trim()) e.jobTitle = "Cargo obrigatório";
    }
    if (needsSolutions) {
      if (data.isExistingClient === null) {
        e.isExistingClient = "Indique se já é cliente da Pumangol";
      }
      if (data.solutions.length === 0) {
        e.solutions = "Seleccione pelo menos uma solução de interesse";
      }
    }
    if (isFornecedor && !data.supplierArea) {
      e.supplierArea = "Seleccione a área de fornecimento";
    }
    if (isParceiro && !data.partnerArea) {
      e.partnerArea = "Seleccione a área de interesse";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep3(): boolean {
    const e: typeof errors = {};
    if (!data.purchaseTimeline) e.purchaseTimeline = "Seleccione o horizonte de compra";
    if (data.wantsContact === null) e.wantsContact = "Campo obrigatório";
    if (!data.gdprConsent) e.gdprConsent = "É necessário o consentimento";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function nextStep() {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function prevStep() {
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit() {
    if (!validateStep1()) {
      setStep(1);
      return;
    }
    if (!validateStep2()) {
      setStep(2);
      return;
    }
    if (!validateStep3()) return;

    setSubmitting(true);
    try {
      const result = await createLead({
        fullName: data.fullName.trim(),
        phone: data.phone.trim(),
        email: data.email.trim(),
        province: data.province || undefined,
        municipality: data.municipality.trim() || undefined,
        profile: data.profile as Profile,
        companyName: data.companyName.trim() || undefined,
        sector: data.sector.trim() || undefined,
        jobTitle: data.jobTitle.trim() || undefined,
        isExistingClient: data.isExistingClient ?? undefined,
        existingClientAreas: data.existingClientAreas.length > 0 ? data.existingClientAreas : undefined,
        solutions: data.solutions,
        lubricantVehicleTypeParticular: data.lubricantVehicleTypeParticular || undefined,
        usesViaApp: data.usesViaApp ?? undefined,
        cardPurposeParticular: data.cardPurposeParticular || undefined,
        combustiveisPurpose: data.combustiveisPurpose || undefined,
        combustiveisConsumption: data.combustiveisConsumption || undefined,
        lubricantVehicleCountEmpresa: data.lubricantVehicleCountEmpresa || undefined,
        frotaVehicleCount: data.frotaVehicleCount || undefined,
        frotaInterest: data.frotaInterest || undefined,
        angobetumesInterest: data.angobetumesInterest || undefined,
        angobetumesActivity: data.angobetumesActivity || undefined,
        aviacaoOperationType: data.aviacaoOperationType || undefined,
        cardPurposeEmpresa: data.cardPurposeEmpresa || undefined,
        supplierArea: data.supplierArea || undefined,
        partnerArea: data.partnerArea || undefined,
        purchaseTimeline: data.purchaseTimeline as CreateLeadInput["purchaseTimeline"],
        wantsContact: data.wantsContact ?? false,
        contactPreference: data.contactPreference.length > 0 ? data.contactPreference : undefined,
        gdprConsent: data.gdprConsent,
        notes: (data.existingClientAreasOther ?? "").trim()
          ? `Ramo comercial (outros): ${(data.existingClientAreasOther ?? "").trim()}`
          : undefined,
      });

      if (!result.success) {
        alert(result.error);
        return;
      }

      setSubmitted(true);
    } catch (err) {
      console.error("[LeadForm] submit error:", err);
      alert("Erro inesperado ao submeter. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <Card>
        <CardContent className="pt-10 pb-10 flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {isPublic ? "Interesse registado com sucesso!" : "Lead registada com sucesso!"}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {isPublic
                ? "Obrigado pelo seu interesse. A nossa equipa comercial entrará em contacto consigo em breve."
                : "A lead foi classificada e adicionada à base de dados."}
            </p>
            {!isPublic && submittedBy && (
              <p className="text-xs text-slate-400 mt-1">Registado por: {submittedBy}</p>
            )}
          </div>
          <div className="flex gap-3 mt-2">
            {isPublic ? (
              <>
                <Button variant="outline" onClick={() => router.push("/")}>
                  Voltar ao início
                </Button>
                <Button onClick={() => { setData(INITIAL); setStep(1); setSubmitted(false); }}>
                  Registar outro
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => router.push(appPath(basePath, "/leads"))}>
                  Ver Leads
                </Button>
                <Button onClick={() => { setData(INITIAL); setStep(1); setSubmitted(false); }}>
                  Nova Lead
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center gap-2">
        {[
          { n: 1, label: "Identificação" },
          { n: 2, label: "Perfil & Interesse" },
          { n: 3, label: "Qualificação" },
        ].map(({ n, label }) => (
          <div key={n} className="flex items-center gap-2 flex-1">
            <div className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors",
              step > n ? "bg-primary text-primary-foreground" :
              step === n ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}>
              {step > n ? <CheckCircle2 className="h-4 w-4" /> : n}
            </div>
            <span className={cn(
              "text-xs font-medium hidden sm:block",
              step === n ? "text-primary" : "text-muted-foreground"
            )}>{label}</span>
            {n < 3 && <div className={cn(
              "flex-1 h-0.5 rounded",
              step > n ? "bg-primary" : "bg-muted"
            )} />}
          </div>
        ))}
      </div>

      {/* Step 1: Identification */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">1</span>
              Dados de Identificação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <FieldGroup className="sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="fullName" required>Nome completo</Label>
                <Input id="fullName" value={data.fullName} onChange={e => set("fullName", e.target.value)} placeholder="Nome e sobrenome" error={errors.fullName} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone" required>Telefone</Label>
                <Input id="phone" type="tel" value={data.phone} onChange={e => set("phone", e.target.value)} placeholder="+244 9XX XXX XXX" error={errors.phone} />
              </div>
            </FieldGroup>

            <div className="space-y-1.5">
              <Label htmlFor="email" required>E-mail</Label>
              <Input
                id="email"
                type="email"
                required
                value={data.email}
                onChange={(e) => {
                  const value = e.target.value;
                  set("email", value);
                  if (errors.email && (isValidEmail(value) || !value.trim())) {
                    setErrors((prev) => {
                      const next = { ...prev };
                      delete next.email;
                      return next;
                    });
                  }
                }}
                onBlur={validateEmailField}
                placeholder="email@exemplo.com"
                error={errors.email}
              />
            </div>

            <FieldGroup className="sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="province">Província</Label>
                <Select value={data.province} onValueChange={v => set("province", v)}>
                  <SelectTrigger className={LEAD_FORM_FIELD_CLASS}>
                    <SelectValue placeholder="Seleccione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVINCES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="municipality">Município</Label>
                <Input id="municipality" value={data.municipality} onChange={e => set("municipality", e.target.value)} placeholder="Município" />
              </div>
            </FieldGroup>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Profile + flow */}
      {step === 2 && (
        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">2</span>
                Perfil do Visitante
              </CardTitle>
            </CardHeader>
            <CardContent>
              {errors.profile && <p className="text-xs text-red-500 mb-3">{errors.profile}</p>}
              <div className="grid sm:grid-cols-2 gap-2">
                {PROFILE_OPTIONS.map(({ value, label, icon: Icon, desc }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => { set("profile", value as Profile); setData(prev => ({ ...prev, solutions: [], isExistingClient: null })); }}
                    className={cn(
                      "flex items-start gap-3 p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer",
                      data.profile === value
                        ? "border-brand bg-brand-light"
                        : "border-slate-200 hover:border-brand/50 hover:bg-slate-50"
                    )}
                  >
                    <Icon className={cn("h-5 w-5 mt-0.5 shrink-0", data.profile === value ? "text-brand" : "text-slate-400")} />
                    <div>
                      <p className={cn("text-sm font-semibold", data.profile === value ? "text-brand" : "text-slate-700")}>{label}</p>
                      <p className="text-xs text-slate-400">{desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Empresa fields */}
          {isEmpresa && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Dados da {data.profile === "orgao_publico" ? "Entidade" : "Empresa"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label required>Nome da {data.profile === "orgao_publico" ? "Entidade" : "Empresa"}</Label>
                  <Input value={data.companyName} onChange={e => set("companyName", e.target.value)} placeholder="Nome da empresa/entidade" error={errors.companyName} />
                </div>
                <FieldGroup className="sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label required>Sector de actividade</Label>
                    <SearchableSelect
                      value={data.sector}
                      onChange={(v) => set("sector", v)}
                      options={COMPANY_SECTORS}
                      placeholder="Pesquisar ou seleccionar sector..."
                      error={errors.sector}
                      className={LEAD_FORM_FIELD_CLASS}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label required>Cargo / Função</Label>
                    <SearchableSelect
                      value={data.jobTitle}
                      onChange={(v) => set("jobTitle", v)}
                      options={JOB_TITLES}
                      placeholder="Pesquisar ou seleccionar cargo..."
                      error={errors.jobTitle}
                      className={LEAD_FORM_FIELD_CLASS}
                    />
                  </div>
                </FieldGroup>
              </CardContent>
            </Card>
          )}

          {/* Existing client (Particular + Empresa) */}
          {(isParticular || isEmpresa) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Relação com a Pumangol</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="mb-2 block">Já é cliente da Pumangol?</Label>
                  {errors.isExistingClient && <p className="text-xs text-red-500 mb-2">{errors.isExistingClient}</p>}
                  <div className="grid grid-cols-2 gap-2">
                    <RadioOption name="existing" value="true" label="Sim" currentValue={String(data.isExistingClient)} onChange={() => set("isExistingClient", true)} />
                    <RadioOption name="existing" value="false" label="Não" currentValue={String(data.isExistingClient)} onChange={() => set("isExistingClient", false)} />
                  </div>
                </div>

                {data.isExistingClient === true && (
                  <div>
                    <Label className="mb-2 block">Em que ramo de negócio mantém relação comercial?</Label>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {EXISTING_CLIENT_AREAS.map(({ value, label }) => (
                        <CheckboxOption
                          key={value} value={value} label={label}
                          checked={data.existingClientAreas.includes(value)}
                          onChange={(v, c) => toggleArray("existingClientAreas", v, c)}
                        />
                      ))}
                    </div>
                    {data.existingClientAreas.includes("outros") && (
                      <div className="mt-3 space-y-1.5">
                        <Label>Outros — especifique</Label>
                        <Input
                          value={data.existingClientAreasOther ?? ""}
                          onChange={e => set("existingClientAreasOther", e.target.value)}
                          placeholder="Indique o ramo de negócio"
                        />
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Solutions — Particular & Empresa (Fluxo A / Fluxo B) */}
          {needsSolutions && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Em que soluções da Pumangol tem interesse?</CardTitle>
                <p className="text-xs text-slate-500 mt-1">Permitir selecção múltipla</p>
              </CardHeader>
              <CardContent>
                {errors.solutions && <p className="text-xs text-red-500 mb-3">{errors.solutions}</p>}
                <div className="grid sm:grid-cols-2 gap-2 mb-5">
                  {getSolutions().map(({ value, label }) => {
                    const selected = data.solutions.includes(value);
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => toggleArray("solutions", value, !selected)}
                        className={cn(
                          "flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all text-left",
                          selected
                            ? "border-brand bg-brand-light text-brand"
                            : "border-slate-200 hover:border-brand/40 text-slate-700"
                        )}
                      >
                        <span className={cn(
                          "w-4 h-4 rounded border-2 flex items-center justify-center shrink-0",
                          selected ? "bg-brand border-brand" : "border-slate-300"
                        )}>
                          {selected && <span className="w-2 h-2 bg-white rounded-sm" />}
                        </span>
                        {label}
                      </button>
                    );
                  })}
                </div>

                {data.solutions.length > 0 && (
                  <div className="space-y-5 pt-4 border-t border-slate-100">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Detalhes das soluções seleccionadas
                    </p>

                    {isParticular && data.solutions.includes("lubrificantes") && (
                      <div>
                        <SectionTitle>Lubrificantes — O lubrificante destina-se a:</SectionTitle>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {[["ligeira", "Viatura ligeira"], ["pesada", "Viatura pesada"], ["motociclo", "Motociclo"], ["equipamento", "Equipamento"], ["outro", "Outro"]].map(([v, l]) => (
                            <RadioOption key={v} name="lubParticular" value={v!} label={l!} currentValue={data.lubricantVehicleTypeParticular} onChange={v => set("lubricantVehicleTypeParticular", v)} />
                          ))}
                        </div>
                      </div>
                    )}

                    {isParticular && data.solutions.includes("via") && (
                      <div>
                        <SectionTitle>VIA — Já utiliza a App VIA?</SectionTitle>
                        <div className="grid grid-cols-2 gap-2">
                          <RadioOption name="viaApp" value="true" label="Sim" currentValue={String(data.usesViaApp)} onChange={() => set("usesViaApp", true)} />
                          <RadioOption name="viaApp" value="false" label="Não" currentValue={String(data.usesViaApp)} onChange={() => set("usesViaApp", false)} />
                        </div>
                      </div>
                    )}

                    {isParticular && data.solutions.includes("cartao_presente") && (
                      <div>
                        <SectionTitle>Cartão Presente — Pretende adquirir para:</SectionTitle>
                        <div className="grid grid-cols-2 gap-2">
                          {[["uso_pessoal", "Uso pessoal"], ["oferta", "Oferta"]].map(([v, l]) => (
                            <RadioOption key={v} name="cardParticular" value={v!} label={l!} currentValue={data.cardPurposeParticular} onChange={v => set("cardPurposeParticular", v)} />
                          ))}
                        </div>
                      </div>
                    )}

                    {isEmpresa && data.solutions.includes("combustiveis") && (
                      <div className="space-y-3">
                        <SectionTitle>Combustíveis</SectionTitle>
                        <div>
                          <Label className="mb-2 block text-sm">Consumo para:</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {[["empresa", "Empresa"], ["revenda", "Revenda"]].map(([v, l]) => (
                              <RadioOption key={v} name="combPurpose" value={v!} label={l!} currentValue={data.combustiveisPurpose} onChange={v => set("combustiveisPurpose", v)} />
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label className="mb-2 block text-sm">Consumo mensal aproximado:</Label>
                          <Select value={data.combustiveisConsumption} onValueChange={v => set("combustiveisConsumption", v)}>
                            <SelectTrigger><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ate_5000">Até 5.000 litros</SelectItem>
                              <SelectItem value="5000_20000">5.000 – 20.000 litros</SelectItem>
                              <SelectItem value="20000_100000">20.000 – 100.000 litros</SelectItem>
                              <SelectItem value="mais_100000">Superior a 100.000 litros</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    {isEmpresa && data.solutions.includes("lubrificantes") && (
                      <div>
                        <SectionTitle>Lubrificantes</SectionTitle>
                        <Label className="mb-2 block text-sm">Número aproximado de viaturas/equipamentos:</Label>
                        <Select value={data.lubricantVehicleCountEmpresa} onValueChange={v => set("lubricantVehicleCountEmpresa", v)}>
                          <SelectTrigger><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1_5">1 – 5</SelectItem>
                            <SelectItem value="6_20">6 – 20</SelectItem>
                            <SelectItem value="21_50">21 – 50</SelectItem>
                            <SelectItem value="mais_50">Mais de 50</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {isEmpresa && data.solutions.includes("frota_mais") && (
                      <div className="space-y-3">
                        <SectionTitle>Frota+</SectionTitle>
                        <div>
                          <Label className="mb-2 block text-sm">Quantidade aproximada de viaturas:</Label>
                          <Select value={data.frotaVehicleCount} onValueChange={v => set("frotaVehicleCount", v)}>
                            <SelectTrigger><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1_5">1–5</SelectItem>
                              <SelectItem value="6_20">6–20</SelectItem>
                              <SelectItem value="21_50">21–50</SelectItem>
                              <SelectItem value="mais_50">Mais de 50</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="mb-2 block text-sm">Interesse:</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {[["uso_pessoal", "Uso pessoal"], ["gestao_frota", "Gestão de frota"]].map(([v, l]) => (
                              <RadioOption key={v} name="frotaInterest" value={v!} label={l!} currentValue={data.frotaInterest} onChange={v => set("frotaInterest", v)} />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {isEmpresa && data.solutions.includes("angobetumes") && (
                      <div className="space-y-3">
                        <SectionTitle>{BETUMES_EMULSAO_LABEL}</SectionTitle>
                        <div>
                          <Label className="mb-2 block text-sm">Interesse:</Label>
                          <div className="grid sm:grid-cols-2 gap-2">
                            {[["projeto_proprio", "Projeto próprio"], ["construcao", "Construção"], ["revenda", "Revenda"], ["parceria", "Parceria"]].map(([v, l]) => (
                              <RadioOption key={v} name="angobetInt" value={v!} label={l!} currentValue={data.angobetumesInterest} onChange={v => set("angobetumesInterest", v)} />
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label className="mb-2 block text-sm">Área de actividade:</Label>
                          <Select value={data.angobetumesActivity} onValueChange={v => set("angobetumesActivity", v)}>
                            <SelectTrigger><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="construcao_civil">Construção Civil</SelectItem>
                              <SelectItem value="obras_publicas">Obras Públicas</SelectItem>
                              <SelectItem value="infra_rodoviarias">Infra-estruturas Rodoviárias</SelectItem>
                              <SelectItem value="industria">Indústria</SelectItem>
                              <SelectItem value="distribuidor_materiais">Distribuidor de Materiais</SelectItem>
                              <SelectItem value="outro">Outro</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    {isEmpresa && data.solutions.includes("aviacao") && (
                      <div>
                        <SectionTitle>Aviação</SectionTitle>
                        <Label className="mb-2 block text-sm">Tipo de operação:</Label>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {[["companhia_aerea", "Companhia aérea"], ["operador_privado", "Operador privado"], ["governo", "Governo"], ["aeroporto", "Aeroporto"], ["outro", "Outro"]].map(([v, l]) => (
                            <RadioOption key={v} name="aviacaoOp" value={v!} label={l!} currentValue={data.aviacaoOperationType} onChange={v => set("aviacaoOperationType", v)} />
                          ))}
                        </div>
                      </div>
                    )}

                    {isEmpresa && data.solutions.includes("cartao_presente") && (
                      <div>
                        <SectionTitle>Cartão Presente</SectionTitle>
                        <Label className="mb-2 block text-sm">Finalidade:</Label>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {[["colaboradores", "Colaboradores"], ["clientes", "Clientes"], ["campanhas", "Campanhas promocionais"], ["outro", "Outro"]].map(([v, l]) => (
                            <RadioOption key={v} name="cardEmpresa" value={v!} label={l!} currentValue={data.cardPurposeEmpresa} onChange={v => set("cardPurposeEmpresa", v)} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Fornecedor message */}
          {isFornecedor && (
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="pt-5">
                <div className="flex gap-3">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                    <span className="text-amber-700 font-bold text-sm">i</span>
                  </div>
                  <div>
                    <p className="font-semibold text-amber-900 text-sm">Processo de Qualificação como Fornecedor</p>
                    <p className="text-amber-800 text-sm mt-1">
                      Para iniciar o processo de qualificação como fornecedor da Pumangol deverá efectuar o registo através do{" "}
                      <strong>Portal KYC</strong>.
                    </p>
                  </div>
                </div>
                <div className="mt-4 space-y-1.5">
                  <Label>Área de fornecimento</Label>
                  {errors.supplierArea && <p className="text-xs text-red-500 mb-1">{errors.supplierArea}</p>}
                  <Select value={data.supplierArea} onValueChange={v => set("supplierArea", v)}>
                    <SelectTrigger><SelectValue placeholder="Seleccione a área..." /></SelectTrigger>
                    <SelectContent>
                      {[
                        ["obras_construcao", "Obras e Construção"],
                        ["equipamentos_materiais", "Equipamentos e Materiais"],
                        ["marketing_comunicacao", "Marketing e Comunicação"],
                        ["tecnologia_informacao", "Tecnologia de Informação"],
                        ["logistica_transporte", "Logística e Transporte"],
                        ["servicos_profissionais", "Serviços Profissionais"],
                        ["manutencao_reparacao", "Manutenção e Reparação"],
                        ["outros", "Outros"],
                      ].map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Parceiro flow */}
          {isParceiro && (
            <Card>
              <CardContent className="pt-5 space-y-3">
                <Label className="block mb-1">Área de interesse</Label>
                {errors.partnerArea && <p className="text-xs text-red-500 mb-1">{errors.partnerArea}</p>}
                <div className="grid sm:grid-cols-2 gap-2">
                  {[
                    ["parcerias_comerciais", "Parcerias Comerciais"],
                    ["projectos_conjuntos", "Projectos Conjuntos"],
                    ["inovacao", "Inovação"],
                    ["mobilidade", "Mobilidade"],
                    ["energia", "Energia"],
                    ["conveniencia", "Conveniência"],
                    ["outros", "Outros"],
                  ].map(([v, l]) => (
                    <RadioOption key={v} name="partnerArea" value={v!} label={l!} currentValue={data.partnerArea} onChange={v => set("partnerArea", v)} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Step 3: Qualification */}
      {step === 3 && (
        <div className="space-y-5">

          {/* Commercial qualification */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Qualificação Comercial</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label className="mb-2 block" required>Horizonte previsto para aquisição</Label>
                {errors.purchaseTimeline && <p className="text-xs text-red-500 mb-2">{errors.purchaseTimeline}</p>}
                <div className="space-y-2">
                  {[
                    ["imediatamente", "Imediatamente"],
                    ["ate_3_meses", "Nos próximos 3 meses"],
                    ["3_6_meses", "Entre 3 e 6 meses"],
                    ["6_12_meses", "Entre 6 e 12 meses"],
                    ["apenas_info", "Apenas estou a recolher informação"],
                  ].map(([v, l]) => (
                    <RadioOption key={v} name="timeline" value={v!} label={l!} currentValue={data.purchaseTimeline} onChange={v => set("purchaseTimeline", v)} />
                  ))}
                </div>
              </div>

              <div>
                <Label className="mb-2 block" required>Pretende ser contactado por um consultor da Pumangol?</Label>
                {errors.wantsContact && <p className="text-xs text-red-500 mb-2">{errors.wantsContact}</p>}
                <div className="grid grid-cols-2 gap-2">
                  <RadioOption name="wantsContact" value="true" label="Sim" currentValue={String(data.wantsContact)} onChange={() => set("wantsContact", true)} />
                  <RadioOption name="wantsContact" value="false" label="Não" currentValue={String(data.wantsContact)} onChange={() => set("wantsContact", false)} />
                </div>
              </div>

              {data.wantsContact === true && (
                <div>
                  <Label className="mb-2 block">Preferência de contacto</Label>
                  <div className="grid sm:grid-cols-3 gap-2">
                    {[["telefone", "Telefone"], ["whatsapp", "WhatsApp"], ["email", "E-mail"]].map(([v, l]) => (
                      <CheckboxOption
                        key={v} value={v!} label={l!}
                        checked={data.contactPreference.includes(v!)}
                        onChange={(val, c) => toggleArray("contactPreference", val, c)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Consent */}
          <Card>
            <CardContent className="pt-5">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="gdpr"
                  checked={data.gdprConsent}
                  onCheckedChange={c => set("gdprConsent", Boolean(c))}
                />
                <label htmlFor="gdpr" className="text-sm text-slate-600 leading-relaxed cursor-pointer">
                  Autorizo a Pumangol a tratar os meus dados pessoais para efeitos de contacto comercial, envio de informação sobre produtos, serviços e campanhas, nos termos da legislação aplicável.
                </label>
              </div>
              {errors.gdprConsent && <p className="text-xs text-red-500 mt-2">{errors.gdprConsent}</p>}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        {step > 1 ? (
          <Button variant="outline" onClick={prevStep} disabled={submitting}>
            Anterior
          </Button>
        ) : (
          <div />
        )}

        {step < 3 ? (
          <Button onClick={nextStep}>
            Próximo
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={submitting} size="lg">
            {submitting ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> A submeter...</>
            ) : (
              isPublic ? "Registar Interesse" : "Submeter Lead"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
