import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { MessageSquare, Plus, X, Send } from "lucide-react";
import { Badge } from "./ui/badge";

type MessageType = "app-general" | "reservas-fuera-horario" | "sin-competencia";
type Language = "es" | "ca";

interface Lead {
  id: string;
  name: string;
  phoneNumber: string;
}

const MESSAGES = {
  es: {
    "app-general": (name: string) => `Hola ${name}

Soy Juanjo de Exora. Vi que te interesó nuestro video sobre la app de reservas.

Te entiendo perfectamente: perder reservas fuera de horario o compartir app con tu competencia es frustrante.

Por eso Exora es diferente:
✓ Tu propia app, con tu logo y tu marca
✓ Reservas 24/7 automáticas (sin perder ni una)
✓ Cobros online integrados
✓ 0 competencia, solo tu negocio

Y lo mejor: 15 días gratis para probarlo sin compromiso.

¿Hablamos? Agenda aquí cuando te venga bien:
https://hablaconunexperto.exora.app

O entra directamente en https://exora.app, te registras en 5 minutos y yo me encargo de ayudarte con toda la configuración.

¿Te animas?`,
    "reservas-fuera-horario": (name: string) => `Hola ${name}

Soy Juanjo de Exora. Vi que te interesó nuestro video sobre las reservas fuera de horario.

Imagino lo frustrante que es: pierdes el 40% de las reservas porque llaman cuando estás cerrado... y el otro 60% te interrumpe mientras estás con otro cliente. Tijeras en mano, teléfono sonando.

Con Exora esto se acabó:
✓ Reservas automáticas 24/7 (capturas ese 40% perdido)
✓ Cero interrupciones mientras trabajas
✓ Cobros online integrados
✓ Tu propia app, con tu marca

Resultado: más reservas, menos estrés, más tiempo para lo que importa.

15 días gratis para probarlo, sin compromiso.

¿Hablamos? Agenda aquí cuando te venga bien: https://hablaconunexperto.exora.app

O entra directamente en https://exora.app, te registras en 5 minutos y yo me encargo de ayudarte con toda la configuración.

¿Te animas?`,
    "sin-competencia": (name: string) => `Hola ${name}

Soy Juanjo de Exora. Vi que te interesó nuestro video sobre dejar de compartir app con tu competencia.

Te entiendo: trabajas duro para fidelizar a tus clientes... y luego entran en una app donde ven otras 10 barberías/peluquerías. Un clic y los pierdes.

¿Por qué regalar lo que tanto te costó conseguir?

Con Exora:
✓ Tu propia app, solo tu negocio
✓ Tu logo, tu marca, tu identidad
✓ 0 competencia dentro
✓ Tus clientes son tuyos, siempre
✓ Reservas y cobros 100% bajo tu control

Tu marca merece brillar sola, no escondida entre otras.

15 días gratis para probarlo, sin compromiso.

¿Hablamos? Agenda aquí cuando te venga bien: https://hablaconunexperto.exora.app

O entra directamente en https://exora.app, te registras en 5 minutos y yo me encargo de ayudarte con toda la configuración.

¿Te animas?`,
  },
  ca: {
    "app-general": (name: string) => `Hola ${name}

Sóc en Juanjo d'Exora. He vist que t'ha interessat el nostre vídeo sobre l'app de reserves.

T'entenc perfectament: perdre reserves fora d'horari o compartir app amb la teva competència és frustrant.

Per això Exora és diferent:
✓ La teva pròpia app, amb el teu logo i la teva marca
✓ Reserves 24/7 automàtiques (sense perdre'n ni una)
✓ Cobraments online integrats
✓ 0 competència, només el teu negoci

I el millor: 15 dies gratis per provar-ho sense compromís.

Parlem? Agenda aquí quan et vagi bé:
https://hablaconunexperto.exora.app

O entra directament a https://exora.app, et registres en 5 minuts i jo m'encarrego d'ajudar-te amb tota la configuració.

T'animes?`,
    "reservas-fuera-horario": (name: string) => `Hola ${name}

Sóc en Juanjo d'Exora. He vist que t'ha interessat el nostre vídeo sobre les reserves fora d'horari.

M'imagino el frustrant que és: perds el 40% de les reserves perquè truquen quan estàs tancat... i l'altre 60% t'interromp mentre estàs amb un altre client. Tisores a la mà, telèfon sonant.

Amb Exora això s'ha acabat:
✓ Reserves automàtiques 24/7 (captures aquest 40% perdut)
✓ Zero interrupcions mentre treballes
✓ Cobraments online integrats
✓ La teva pròpia app, amb la teva marca

Resultat: més reserves, menys estrès, més temps per al que importa.

15 dies gratis per provar-ho, sense compromís.

Parlem? Agenda aquí quan et vagi bé: https://hablaconunexperto.exora.app

O entra directament a https://exora.app, et registres en 5 minuts i jo m'encarrego d'ajudar-te amb tota la configuració.

T'animes?`,
    "sin-competencia": (name: string) => `Hola ${name}

Sóc en Juanjo d'Exora. He vist que t'ha interessat el nostre vídeo sobre deixar de compartir app amb la teva competència.

T'entenc: treballes dur per fidelitzar els teus clients... i després entren en una app on veuen altres 10 barberies/perruqueries. Un clic i els perds.

Per què regalar el que tant et va costar aconseguir?

Amb Exora:
✓ La teva pròpia app, només el teu negoci
✓ El teu logo, la teva marca, la teva identitat
✓ 0 competència dins
✓ Els teus clients són teus, sempre
✓ Reserves i cobraments 100% sota el teu control

La teva marca mereix brillar sola, no amagada entre d'altres.

15 dies gratis per provar-ho, sense compromís.

Parlem? Agenda aquí quan et vagi bé: https://hablaconunexperto.exora.app

O entra directament a https://exora.app, et registres en 5 minuts i jo m'encarrego d'ajudar-te amb tota la configuració.

T'animes?`,
  },
};

const MESSAGE_LABELS = {
  es: {
    "app-general": "App de Reservas (General)",
    "reservas-fuera-horario": "Reservas Fuera de Horario",
    "sin-competencia": "Sin Competencia",
  },
  ca: {
    "app-general": "App de Reserves (General)",
    "reservas-fuera-horario": "Reserves Fora d'Horari",
    "sin-competencia": "Sense Competència",
  },
};

export function LeadMessageGenerator() {
  const [leads, setLeads] = useState<Lead[]>([
    { id: "1", name: "", phoneNumber: "" },
  ]);
  const [messageType, setMessageType] = useState<MessageType>("app-general");
  const [language, setLanguage] = useState<Language>("es");

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
    const message = MESSAGES[language][messageType](name || "[Nombre]");
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
            <Tabs value={language} onValueChange={(v) => setLanguage(v as Language)}>
              <TabsList className="grid w-full grid-cols-2 sm:w-auto">
                <TabsTrigger value="es">Español</TabsTrigger>
                <TabsTrigger value="ca">Català</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tipo de mensaje */}
          <div className="space-y-2">
            <Label htmlFor="messageType">
              {language === "es" ? "Tipo de Mensaje" : "Tipus de Missatge"}
            </Label>
            <Select value={messageType} onValueChange={(v) => setMessageType(v as MessageType)}>
              <SelectTrigger id="messageType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="app-general">
                  {MESSAGE_LABELS[language]["app-general"]}
                </SelectItem>
                <SelectItem value="reservas-fuera-horario">
                  {MESSAGE_LABELS[language]["reservas-fuera-horario"]}
                </SelectItem>
                <SelectItem value="sin-competencia">
                  {MESSAGE_LABELS[language]["sin-competencia"]}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

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
                      onChange={(e) => updateLead(lead.id, "name", e.target.value)}
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

          {/* Vista previa del mensaje */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <Label>
                {language === "es" ? "Vista Previa del Mensaje" : "Vista Prèvia del Missatge"}
              </Label>
              <Badge variant="secondary" className="w-fit">
                {MESSAGE_LABELS[language][messageType]}
              </Badge>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 sm:p-4 whitespace-pre-wrap text-sm max-h-[400px] overflow-y-auto">
              {MESSAGES[language][messageType](leads[0]?.name || "[Nombre]")}
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
                ? "1. Selecciona el tipo de mensaje según el video que le interesó al cliente"
                : "1. Selecciona el tipus de missatge segons el vídeo que li va interessar al client"}
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
