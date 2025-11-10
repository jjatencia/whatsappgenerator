import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { MessageSquare, Plus, X, Send, Copy } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

type Language = "es" | "ca";
type MessageTemplate = "short" | "long" | "trial";

interface Lead {
  id: string;
  name: string;
  phoneNumber: string;
  customMessage: string;
  selectedTemplate: MessageTemplate;
}

const MESSAGE_TEMPLATES = {
  es: {
    short: (name: string) => `Hola ${name} 👋
Soy Juanjo de Exora.
Vi que te interesó nuestro anuncio —quería contarte que ahora puedes tener tu propia app de reservas personalizada desde 34,90 €/mes (precio promocional por haber rellenado el formulario).

Sin competencia, sin comisiones y con tus clientes bajo tu control.

¿Quieres que te explique cómo funciona en 5 min?
👉 https://hablaconunexperto.exora.app`,
    long: (name: string) => `Hola ${name} 👋
Soy Juanjo de Exora. Vi que te interesaste por nuestro anuncio —quería contarte algo rápido.

Sé lo que pasa: te esfuerzas por fidelizar clientes… pero luego reservan desde una app donde también salen tus competidores. Un clic y los pierdes.

Con Exora eso se acabó:
✅ Tu propia app, solo con tu negocio
✅ Tus precios, tus horarios y tus clientes —bajo tu control
✅ Sin comisiones ni competencia dentro

💡 Por haber rellenado el formulario, tienes acceso a una oferta especial:
👉 Tu app personalizada desde 34,90 €/mes (precio promocional)
(válido solo esta semana para nuevos registros)

Si quieres, te explico cómo funciona en 5 min por llamada o WhatsApp.
¿Te va bien ahora o prefieres que te escriba más tarde?

También puedes agendar directamente aquí 👉 https://hablaconunexperto.exora.app`,
    trial: (name: string) => `Hola ${name} 👋

Soy [NombreAgente] de Exora. Como te comenté, te dejo por aquí el enlace para darte de alta en la prueba gratuita 👇

🔗 https://exora.app

Solo tienes que entrar y hacer clic en el botón "Prueba Gratis".
El registro tarda menos de un minuto, y una vez dentro te ayudaremos con todo el proceso de configuración para que puedas empezar a recibir reservas online de inmediato.

Cuando te hayas registrado, avísame por aquí y te acompaño con los siguientes pasos.`,
  },
  ca: {
    short: (name: string) => `Hola ${name} 👋
Sóc en Juanjo d'Exora.
He vist que t'ha interessat el nostre anunci —volia explicar-te que ara pots tenir la teva pròpia app de reserves personalitzada des de 34,90 €/mes (preu promocional per haver emplenat el formulari).

Sense competència, sense comissions i amb els teus clients sota el teu control.

Vols que t'expliqui com funciona en 5 min?
👉 https://hablaconunexperto.exora.app`,
    long: (name: string) => `Hola ${name} 👋
Sóc en Juanjo d'Exora. He vist que t'ha interessat el nostre anunci —volia explicar-te una cosa ràpidament.

Sé el que passa: t'esforces per fidelitzar clients… però després reserven des d'una app on també surten els teus competidors. Un clic i els perds.

Amb Exora això s'ha acabat:
✅ La teva pròpia app, només amb el teu negoci
✅ Els teus preus, els teus horaris i els teus clients —sota el teu control
✅ Sense comissions ni competència dins

💡 Per haver emplenat el formulari, tens accés a una oferta especial:
👉 La teva app personalitzada des de 34,90 €/mes (preu promocional)
(vàlid només aquesta setmana per a nous registres)

Si vols, t'explico com funciona en 5 min per trucada o WhatsApp.
Et va bé ara o prefereixes que t'escrigui més tard?

També pots agendar directament aquí 👉 https://hablaconunexperto.exora.app`,
    trial: (name: string) => `Hola ${name} 👋

Sóc [NombreAgente] d'Exora. Com et vaig comentar, et deixo per aquí l'enllaç per donar-te d'alta a la prova gratuïta 👇

🔗 https://exora.app

Només has d'entrar i fer clic al botó "Prova Gratis".
El registre triga menys d'un minut, i un cop dins t'ajudarem amb tot el procés de configuració perquè puguis començar a rebre reserves online de manera immediata.

Quan t'hagis registrat, avisa'm per aquí i t'acompanyo amb els següents passos.`,
  },
};

const TEMPLATE_LABELS = {
  es: {
    short: "Mensaje Corto (Promocional)",
    long: "Mensaje Largo (Completo)",
    trial: "Registro Prueba Gratuita",
  },
  ca: {
    short: "Missatge Curt (Promocional)",
    long: "Missatge Llarg (Complet)",
    trial: "Registre Prova Gratuïta",
  },
};


export function LeadMessageGenerator() {
  const [language, setLanguage] = useState<Language>("es");
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: "1",
      name: "",
      phoneNumber: "",
      customMessage: MESSAGE_TEMPLATES.es.short("[Nombre]"),
      selectedTemplate: "short",
    },
  ]);

  // Actualizar el mensaje cuando cambia el idioma
  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    // Actualizar todos los mensajes al nuevo idioma
    setLeads(leads.map(lead => ({
      ...lead,
      customMessage: MESSAGE_TEMPLATES[newLanguage][lead.selectedTemplate](lead.name || "[Nombre]"),
    })));
  };

  // Actualizar el nombre de un lead
  const handleLeadNameChange = (id: string, name: string) => {
    setLeads(leads.map(lead => {
      if (lead.id === id) {
        const messageName = name.trim() || "[Nombre]";
        return {
          ...lead,
          name,
          customMessage: MESSAGE_TEMPLATES[language][lead.selectedTemplate](messageName),
        };
      }
      return lead;
    }));
  };

  // Cambiar la plantilla de mensaje de un lead
  const handleTemplateChange = (id: string, template: MessageTemplate) => {
    setLeads(leads.map(lead => {
      if (lead.id === id) {
        const messageName = lead.name.trim() || "[Nombre]";
        return {
          ...lead,
          selectedTemplate: template,
          customMessage: MESSAGE_TEMPLATES[language][template](messageName),
        };
      }
      return lead;
    }));
  };

  // Actualizar el mensaje personalizado de un lead
  const handleCustomMessageChange = (id: string, message: string) => {
    setLeads(leads.map(lead =>
      lead.id === id ? { ...lead, customMessage: message } : lead
    ));
  };

  const addLead = () => {
    setLeads([
      ...leads,
      {
        id: Date.now().toString(),
        name: "",
        phoneNumber: "",
        customMessage: MESSAGE_TEMPLATES[language].short("[Nombre]"),
        selectedTemplate: "short",
      },
    ]);
  };

  const removeLead = (id: string) => {
    if (leads.length > 1) {
      setLeads(leads.filter((lead) => lead.id !== id));
    }
  };

  const updateLeadPhone = (id: string, phoneNumber: string) => {
    setLeads(leads.map(lead =>
      lead.id === id ? { ...lead, phoneNumber } : lead
    ));
  };

  const generateWhatsAppLink = (lead: Lead) => {
    // Reemplazar [Nombre] con el nombre real en el mensaje personalizado
    const message = lead.customMessage.replace(/\[Nombre\]/g, lead.name || "[Nombre]");
    const cleanPhone = lead.phoneNumber.replace(/\D/g, "");
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  };

  const openWhatsApp = (lead: Lead) => {
    if (!lead.phoneNumber.trim()) {
      alert(language === "es" ? "Por favor, ingresa un número de teléfono" : "Si us plau, introdueix un número de telèfon");
      return;
    }
    if (!lead.name.trim()) {
      alert(language === "es" ? "Por favor, ingresa el nombre del cliente" : "Si us plau, introdueix el nom del client");
      return;
    }
    const link = generateWhatsAppLink(lead);
    window.open(link, "_blank");
  };

  return (
    <div className="container max-w-4xl mx-auto p-4 sm:p-6 py-6 sm:py-12">
      <div className="mb-6 sm:mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
          <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600" />
          <h1 className="text-emerald-600">Exora Lead Manager</h1>
        </div>
        <p className="text-slate-600 px-4 sm:px-0">
          {language === "es"
            ? "Genera mensajes personalizados de WhatsApp para tus leads"
            : "Genera missatges personalitzats de WhatsApp per als teus leads"}
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <CardTitle>
                {language === "es" ? "Nuevo Lead" : "Nou Lead"}
              </CardTitle>
              <CardDescription className="mt-1.5">
                {language === "es"
                  ? "Completa la información del cliente para generar el mensaje"
                  : "Completa la informació del client per generar el missatge"}
              </CardDescription>
            </div>
            <Tabs value={language} onValueChange={(v) => handleLanguageChange(v as Language)}>
              <TabsList className="grid w-full grid-cols-2 sm:w-auto">
                <TabsTrigger value="es">Español</TabsTrigger>
                <TabsTrigger value="ca">Català</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Leads */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <Label>
                {language === "es" ? "Clientes (Leads)" : "Clients (Leads)"}
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addLead}
                className="w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 mr-1" />
                {language === "es" ? "Añadir cliente" : "Afegir client"}
              </Button>
            </div>

            <div className="space-y-4">
              {leads.map((lead, index) => (
                <div key={lead.id} className="p-4 border-2 border-slate-200 rounded-lg bg-white space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700">
                      {language === "es" ? "Cliente" : "Client"} #{index + 1}
                    </span>
                    {leads.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLead(lead.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor={`name-${lead.id}`} className="text-xs">
                        {language === "es" ? "Nombre" : "Nom"}
                      </Label>
                      <Input
                        id={`name-${lead.id}`}
                        placeholder={language === "es" ? "Nombre del cliente" : "Nom del client"}
                        value={lead.name}
                        onChange={(e) => handleLeadNameChange(lead.id, e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`phone-${lead.id}`} className="text-xs">
                        {language === "es" ? "Teléfono" : "Telèfon"}
                      </Label>
                      <Input
                        id={`phone-${lead.id}`}
                        placeholder={
                          language === "es"
                            ? "Ej: +34612345678"
                            : "Ex: +34612345678"
                        }
                        value={lead.phoneNumber}
                        onChange={(e) => updateLeadPhone(lead.id, e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`template-${lead.id}`} className="text-xs">
                      {language === "es" ? "Plantilla de Mensaje" : "Plantilla de Missatge"}
                    </Label>
                    <Select
                      value={lead.selectedTemplate}
                      onValueChange={(v) => handleTemplateChange(lead.id, v as MessageTemplate)}
                    >
                      <SelectTrigger id={`template-${lead.id}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">
                          {TEMPLATE_LABELS[language].short}
                        </SelectItem>
                        <SelectItem value="long">
                          {TEMPLATE_LABELS[language].long}
                        </SelectItem>
                        <SelectItem value="trial">
                          {TEMPLATE_LABELS[language].trial}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`message-${lead.id}`} className="text-xs">
                      {language === "es" ? "Mensaje Personalizado" : "Missatge Personalitzat"}
                    </Label>
                    <Textarea
                      id={`message-${lead.id}`}
                      value={lead.customMessage}
                      onChange={(e) => handleCustomMessageChange(lead.id, e.target.value)}
                      className="min-h-[200px] font-mono text-xs whitespace-pre-wrap"
                      placeholder={language === "es" ? "Edita el mensaje aquí..." : "Edita el missatge aquí..."}
                    />
                    <p className="text-xs text-slate-500">
                      {language === "es"
                        ? "💡 Usa [Nombre] para el cliente y [NombreAgente] para tu nombre (ej: Juanjo, Jordi, etc.)"
                        : "💡 Utilitza [Nombre] pel client i [NombreAgente] pel teu nom (ex: Juanjo, Jordi, etc.)"}
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="default"
                    size="default"
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => openWhatsApp(lead)}
                    disabled={!lead.phoneNumber.trim() || !lead.name.trim()}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {language === "es" ? "Enviar por WhatsApp" : "Enviar per WhatsApp"}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instrucciones */}
      <Card className="mt-4 sm:mt-6 border-emerald-200 bg-emerald-50">
        <CardContent className="pt-4 sm:pt-6">
          <h3 className="mb-2 text-emerald-900">
            {language === "es" ? "💡 Cómo usar" : "💡 Com utilitzar"}
          </h3>
          <ul className="space-y-1.5 text-sm text-emerald-800">
            <li>
              {language === "es"
                ? "1. Ingresa el nombre y número de teléfono de cada cliente"
                : "1. Introdueix el nom i número de telèfon de cada client"}
            </li>
            <li>
              {language === "es"
                ? "2. Selecciona la plantilla de mensaje (corta o larga)"
                : "2. Selecciona la plantilla de missatge (curt o llarg)"}
            </li>
            <li>
              {language === "es"
                ? "3. Edita el mensaje personalizado para cada cliente si lo necesitas"
                : "3. Edita el missatge personalitzat per a cada client si ho necessites"}
            </li>
            <li>
              {language === "es"
                ? "4. Añade más clientes con el botón 'Añadir cliente' si quieres enviar a varios"
                : "4. Afegeix més clients amb el botó 'Afegir client' si vols enviar a diversos"}
            </li>
            <li>
              {language === "es"
                ? "5. Haz clic en 'Enviar por WhatsApp' en cada cliente para abrir la conversación"
                : "5. Fes clic a 'Enviar per WhatsApp' a cada client per obrir la conversa"}
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
