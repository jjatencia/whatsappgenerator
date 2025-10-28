import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { MessageSquare, Plus, X, Send } from "lucide-react";
import { Textarea } from "./ui/textarea";

type Language = "es" | "ca";

interface Lead {
  id: string;
  name: string;
  phoneNumber: string;
}

const DEFAULT_MESSAGE = {
  es: (name: string) => `Hola ${name} 👋
Soy Juanjo de Exora.
Vi que te interesó nuestro anuncio —quería contarte que ahora puedes tener tu propia app de reservas personalizada desde 34,90 €/mes (precio promocional por haber rellenado el formulario).

Sin competencia, sin comisiones y con tus clientes bajo tu control.

¿Quieres que te explique cómo funciona en 5 min?
👉 https://hablaconunexperto.exora.app`,
  ca: (name: string) => `Hola ${name} 👋
Sóc en Juanjo d'Exora.
He vist que t'ha interessat el nostre anunci —volia explicar-te que ara pots tenir la teva pròpia app de reserves personalitzada des de 34,90 €/mes (preu promocional per haver emplenat el formulari).

Sense competència, sense comissions i amb els teus clients sota el teu control.

Vols que t'expliqui com funciona en 5 min?
👉 https://hablaconunexperto.exora.app`,
};


export function LeadMessageGenerator() {
  const [leads, setLeads] = useState<Lead[]>([
    { id: "1", name: "", phoneNumber: "" },
  ]);
  const [language, setLanguage] = useState<Language>("es");
  const [customMessage, setCustomMessage] = useState<string>(
    DEFAULT_MESSAGE.es("[Nombre]")
  );

  // Actualizar el mensaje cuando cambia el idioma
  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    const leadName = leads[0]?.name || "[Nombre]";
    setCustomMessage(DEFAULT_MESSAGE[newLanguage](leadName));
  };

  // Actualizar el mensaje cuando cambia el nombre del primer lead
  const handleLeadNameChange = (id: string, name: string) => {
    updateLead(id, "name", name);
    if (id === leads[0]?.id) {
      const messageName = name.trim() || "[Nombre]";
      setCustomMessage(DEFAULT_MESSAGE[language](messageName));
    }
  };

  const addLead = () => {
    setLeads([
      ...leads,
      { id: Date.now().toString(), name: "", phoneNumber: "" },
    ]);
  };

  const removeLead = (id: string) => {
    if (leads.length > 1) {
      setLeads(leads.filter((lead) => lead.id !== id));
    }
  };

  const updateLead = (id: string, field: "name" | "phoneNumber", value: string) => {
    setLeads(
      leads.map((lead) =>
        lead.id === id ? { ...lead, [field]: value } : lead
      )
    );
  };

  const generateWhatsAppLink = (name: string, phone: string) => {
    // Reemplazar [Nombre] con el nombre real en el mensaje personalizado
    const message = customMessage.replace(/\[Nombre\]/g, name || "[Nombre]");
    const cleanPhone = phone.replace(/\D/g, "");
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  };

  const openWhatsApp = (name: string, phone: string) => {
    if (!phone.trim()) {
      alert(language === "es" ? "Por favor, ingresa un número de teléfono" : "Si us plau, introdueix un número de telèfon");
      return;
    }
    if (!name.trim()) {
      alert(language === "es" ? "Por favor, ingresa el nombre del cliente" : "Si us plau, introdueix el nom del client");
      return;
    }
    const link = generateWhatsAppLink(name, phone);
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
                <div key={lead.id} className="p-4 border border-slate-200 rounded-lg bg-white space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">
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
                  
                  <div className="space-y-2">
                    <Input
                      placeholder={language === "es" ? "Nombre del cliente" : "Nom del client"}
                      value={lead.name}
                      onChange={(e) => handleLeadNameChange(lead.id, e.target.value)}
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      placeholder={
                        language === "es"
                          ? "Número de teléfono (ej: +34612345678)"
                          : "Número de telèfon (ex: +34612345678)"
                      }
                      value={lead.phoneNumber}
                      onChange={(e) => updateLead(lead.id, "phoneNumber", e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="default"
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto"
                      onClick={() => openWhatsApp(lead.name, lead.phoneNumber)}
                      disabled={!lead.phoneNumber.trim() || !lead.name.trim()}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vista previa del mensaje - Editable */}
          <div className="space-y-2">
            <Label htmlFor="messagePreview">
              {language === "es" ? "Vista Previa del Mensaje" : "Vista Prèvia del Missatge"}
            </Label>
            <Textarea
              id="messagePreview"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="min-h-[300px] font-mono text-sm whitespace-pre-wrap"
              placeholder={language === "es" ? "Edita tu mensaje aquí..." : "Edita el teu missatge aquí..."}
            />
            <p className="text-xs text-slate-500">
              {language === "es"
                ? "💡 Usa [Nombre] como marcador de posición que se reemplazará con el nombre de cada cliente"
                : "💡 Utilitza [Nombre] com a marcador que es reemplaçarà amb el nom de cada client"}
            </p>
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
                ? "1. Edita el mensaje en la vista previa según tus necesidades"
                : "1. Edita el missatge a la vista prèvia segons les teves necessitats"}
            </li>
            <li>
              {language === "es"
                ? "2. Ingresa el nombre y número de teléfono de cada cliente"
                : "2. Introdueix el nom i número de telèfon de cada client"}
            </li>
            <li>
              {language === "es"
                ? "3. Puedes añadir múltiples clientes con el botón 'Añadir cliente'"
                : "3. Pots afegir múltiples clients amb el botó 'Afegir client'"}
            </li>
            <li>
              {language === "es"
                ? "4. Haz clic en 'WhatsApp' para abrir la conversación con el mensaje personalizado"
                : "4. Fes clic a 'WhatsApp' per obrir la conversa amb el missatge personalitzat"}
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
