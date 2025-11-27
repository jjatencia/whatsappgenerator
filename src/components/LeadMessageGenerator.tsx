import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { MessageSquare, Plus, X, Send, Settings, Edit, Trash2 } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

type Language = "es" | "ca";
type MessageTemplate = "short" | "long" | "trial" | string;

interface Lead {
  id: string;
  name: string;
  phoneNumber: string;
  customMessage: string;
  selectedTemplate: MessageTemplate;
}

interface CustomPreset {
  id: string;
  name: string;
  label: {
    es: string;
    ca: string;
  };
  message: {
    es: string;
    ca: string;
  };
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
  const [agentName, setAgentName] = useState<string>("Juanjo");
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: "1",
      name: "",
      phoneNumber: "",
      customMessage: MESSAGE_TEMPLATES.es.short("[Nombre]"),
      selectedTemplate: "short",
    },
  ]);

  // Estados para Custom Presets
  const [customPresets, setCustomPresets] = useState<CustomPreset[]>([]);
  const [isPresetsDialogOpen, setIsPresetsDialogOpen] = useState(false);
  const [editingPreset, setEditingPreset] = useState<CustomPreset | null>(null);
  const [newPresetName, setNewPresetName] = useState("");
  const [newPresetLabelEs, setNewPresetLabelEs] = useState("");
  const [newPresetLabelCa, setNewPresetLabelCa] = useState("");
  const [newPresetMessageEs, setNewPresetMessageEs] = useState("");
  const [newPresetMessageCa, setNewPresetMessageCa] = useState("");

  // Cargar custom presets desde localStorage al iniciar
  useEffect(() => {
    const stored = localStorage.getItem("customPresets");
    if (stored) {
      try {
        setCustomPresets(JSON.parse(stored));
      } catch (e) {
        console.error("Error loading custom presets:", e);
      }
    }
  }, []);

  // Guardar custom presets en localStorage cuando cambien
  useEffect(() => {
    if (customPresets.length > 0 || localStorage.getItem("customPresets")) {
      localStorage.setItem("customPresets", JSON.stringify(customPresets));
    }
  }, [customPresets]);

  // Funciones para gestionar custom presets
  const openNewPresetDialog = () => {
    setEditingPreset(null);
    setNewPresetName("");
    setNewPresetLabelEs("");
    setNewPresetLabelCa("");
    setNewPresetMessageEs("");
    setNewPresetMessageCa("");
    setIsPresetsDialogOpen(true);
  };

  const openEditPresetDialog = (preset: CustomPreset) => {
    setEditingPreset(preset);
    setNewPresetName(preset.name);
    setNewPresetLabelEs(preset.label.es);
    setNewPresetLabelCa(preset.label.ca);
    setNewPresetMessageEs(preset.message.es);
    setNewPresetMessageCa(preset.message.ca);
    setIsPresetsDialogOpen(true);
  };

  const saveCustomPreset = () => {
    if (!newPresetName.trim() || !newPresetLabelEs.trim() || !newPresetMessageEs.trim()) {
      alert(language === "es"
        ? "Por favor completa al menos el nombre, etiqueta en español y mensaje en español"
        : "Si us plau completa almenys el nom, etiqueta en espanyol i missatge en espanyol");
      return;
    }

    const preset: CustomPreset = {
      id: editingPreset?.id || `custom-${Date.now()}`,
      name: newPresetName.trim(),
      label: {
        es: newPresetLabelEs.trim(),
        ca: newPresetLabelCa.trim() || newPresetLabelEs.trim(),
      },
      message: {
        es: newPresetMessageEs.trim(),
        ca: newPresetMessageCa.trim() || newPresetMessageEs.trim(),
      },
    };

    if (editingPreset) {
      // Editar preset existente
      setCustomPresets(customPresets.map(p => p.id === editingPreset.id ? preset : p));
    } else {
      // Crear nuevo preset
      setCustomPresets([...customPresets, preset]);
    }

    setIsPresetsDialogOpen(false);
  };

  const deleteCustomPreset = (id: string) => {
    if (confirm(language === "es"
      ? "¿Estás seguro de eliminar esta plantilla?"
      : "Estàs segur d'eliminar aquesta plantilla?")) {
      setCustomPresets(customPresets.filter(p => p.id !== id));
    }
  };

  // Función para obtener el mensaje de una plantilla (hardcoded o custom)
  const getTemplateMessage = (template: MessageTemplate, name: string, lang?: Language): string => {
    const currentLang = lang || language;
    // Primero buscar en custom presets
    const customPreset = customPresets.find(p => p.id === template);
    if (customPreset) {
      return customPreset.message[currentLang].replace(/\[Nombre\]/g, name);
    }
    // Si no, usar hardcoded templates
    if (template === "short" || template === "long" || template === "trial") {
      return MESSAGE_TEMPLATES[currentLang][template](name);
    }
    return MESSAGE_TEMPLATES[currentLang].short(name);
  };

  // Actualizar el mensaje cuando cambia el idioma
  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    // Actualizar todos los mensajes al nuevo idioma
    setLeads(leads.map(lead => ({
      ...lead,
      customMessage: getTemplateMessage(lead.selectedTemplate, lead.name || "[Nombre]", newLanguage),
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
          customMessage: getTemplateMessage(lead.selectedTemplate, messageName),
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
          customMessage: getTemplateMessage(template, messageName),
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
    // Reemplazar [Nombre] y [NombreAgente] con los nombres reales en el mensaje personalizado
    let message = lead.customMessage.replace(/\[Nombre\]/g, lead.name || "[Nombre]");
    message = message.replace(/\[NombreAgente\]/g, agentName || "Juanjo");
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

  // Ejecutar atajo de Apple directamente
  const runAppleShortcut = () => {
    const validLeads = leads.filter(lead => lead.phoneNumber.trim() && lead.name.trim());

    if (validLeads.length === 0) {
      alert(language === "es"
        ? "No hay clientes válidos con nombre y teléfono"
        : "No hi ha clients vàlids amb nom i telèfon");
      return;
    }

    const formatted = validLeads.map(lead => {
      let message = lead.customMessage.replace(/\[Nombre\]/g, lead.name);
      message = message.replace(/\[NombreAgente\]/g, agentName || "Juanjo");
      const cleanPhone = lead.phoneNumber.replace(/\D/g, "");
      return `${cleanPhone} ||| ${message}`;
    }).join('\n\n');

    // Crear URL para ejecutar el atajo de Apple con el texto como parámetro
    const encodedText = encodeURIComponent(formatted);
    const shortcutURL = `shortcuts://run-shortcut?name=EnviarWhatsappLBJ&input=text&text=${encodedText}`;

    // Intentar abrir el atajo
    window.location.href = shortcutURL;

    // Mostrar mensaje de confirmación
    setTimeout(() => {
      alert(language === "es"
        ? `✅ Ejecutando atajo con ${validLeads.length} mensaje(s)...`
        : `✅ Executant atajo amb ${validLeads.length} missatge(s)...`);
    }, 500);
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
          {/* Nombre del Agente */}
          <div className="space-y-2 p-4 bg-emerald-50 border-2 border-emerald-200 rounded-lg">
            <Label htmlFor="agent-name" className="text-sm font-semibold text-emerald-900">
              {language === "es" ? "Tu Nombre (Agente)" : "El Teu Nom (Agent)"}
            </Label>
            <Input
              id="agent-name"
              placeholder={language === "es" ? "Ej: Juanjo, Jordi, etc." : "Ex: Juanjo, Jordi, etc."}
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              className="bg-white"
            />
            <p className="text-xs text-emerald-700">
              {language === "es"
                ? "💡 Este nombre reemplazará [NombreAgente] en todos los mensajes"
                : "💡 Aquest nom reemplaçarà [NombreAgente] a tots els missatges"}
            </p>
          </div>

          {/* Gestión de Plantillas */}
          <div className="space-y-2 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-semibold text-blue-900">
                  {language === "es" ? "Plantillas de Mensajes" : "Plantilles de Missatges"}
                </Label>
                <p className="text-xs text-blue-700 mt-1">
                  {language === "es"
                    ? "Crea tus propias plantillas para diferentes situaciones"
                    : "Crea les teves pròpies plantilles per a diferents situacions"}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={openNewPresetDialog}
                className="bg-white"
              >
                <Settings className="w-4 h-4 mr-1" />
                {language === "es" ? "Gestionar" : "Gestionar"}
              </Button>
            </div>
          </div>

          {/* Leads */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <Label>
                {language === "es" ? "Clientes (Leads)" : "Clients (Leads)"}
              </Label>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
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
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={runAppleShortcut}
                  className="w-full sm:w-auto"
                  style={{ backgroundColor: '#2563eb', color: 'white' }}
                >
                  <Send className="w-4 h-4 mr-1" />
                  {language === "es" ? "Enviar con Atajo" : "Enviar amb Atajo"}
                </Button>
              </div>
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
                        {customPresets.length > 0 && (
                          <>
                            <SelectItem value="separator" disabled>
                              ──────────────
                            </SelectItem>
                            {customPresets.map((preset) => (
                              <SelectItem key={preset.id} value={preset.id}>
                                {preset.label[language]}
                              </SelectItem>
                            ))}
                          </>
                        )}
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
              <strong>
                {language === "es"
                  ? "5. ENVÍO AUTOMÁTICO: Haz clic en 'Enviar con Atajo' para ejecutar automáticamente el atajo 'EnviarWhatsappLBJ'"
                  : "5. ENVIAMENT AUTOMÀTIC: Fes clic a 'Enviar amb Atajo' per executar automàticament l'atall 'EnviarWhatsappLBJ'"}
              </strong>
            </li>
            <li>
              {language === "es"
                ? "6. O haz clic en 'Enviar por WhatsApp' en cada cliente individualmente para abrir la conversación manualmente"
                : "6. O fes clic a 'Enviar per WhatsApp' a cada client individualment per obrir la conversa manualment"}
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Diálogo de Gestión de Plantillas */}
      <Dialog open={isPresetsDialogOpen} onOpenChange={setIsPresetsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {language === "es" ? "Gestionar Plantillas de Mensajes" : "Gestionar Plantilles de Missatges"}
            </DialogTitle>
            <DialogDescription>
              {language === "es"
                ? "Crea, edita o elimina tus plantillas personalizadas para diferentes situaciones"
                : "Crea, edita o elimina les teves plantilles personalitzades per a diferents situacions"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 overflow-y-auto flex-1 pr-2">
            {/* Formulario para crear/editar preset */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {editingPreset
                    ? (language === "es" ? "Editar Plantilla" : "Editar Plantilla")
                    : (language === "es" ? "Nueva Plantilla" : "Nova Plantilla")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="preset-name">
                    {language === "es" ? "Nombre Interno (Identificador)" : "Nom Intern (Identificador)"}
                  </Label>
                  <Input
                    id="preset-name"
                    placeholder={language === "es" ? "Ej: seguimiento-post-llamada" : "Ex: seguiment-post-trucada"}
                    value={newPresetName}
                    onChange={(e) => setNewPresetName(e.target.value)}
                  />
                  <p className="text-xs text-slate-500">
                    {language === "es"
                      ? "Solo para identificación interna, no se muestra a los clientes"
                      : "Només per identificació interna, no es mostra als clients"}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="preset-label-es">
                      {language === "es" ? "Etiqueta en Español *" : "Etiqueta en Espanyol *"}
                    </Label>
                    <Input
                      id="preset-label-es"
                      placeholder="Ej: Seguimiento Post-Llamada"
                      value={newPresetLabelEs}
                      onChange={(e) => setNewPresetLabelEs(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preset-label-ca">
                      {language === "es" ? "Etiqueta en Catalán" : "Etiqueta en Català"}
                    </Label>
                    <Input
                      id="preset-label-ca"
                      placeholder="Ex: Seguiment Post-Trucada"
                      value={newPresetLabelCa}
                      onChange={(e) => setNewPresetLabelCa(e.target.value)}
                    />
                    <p className="text-xs text-slate-500">
                      {language === "es"
                        ? "Opcional: si no se completa, se usará la etiqueta en español"
                        : "Opcional: si no es completa, s'utilitzarà l'etiqueta en espanyol"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="preset-message-es">
                      {language === "es" ? "Mensaje en Español *" : "Missatge en Espanyol *"}
                    </Label>
                    <Textarea
                      id="preset-message-es"
                      placeholder={language === "es"
                        ? "Hola [Nombre] 👋\n\nSoy [NombreAgente]..."
                        : "Hola [Nombre] 👋\n\nSóc [NombreAgente]..."}
                      value={newPresetMessageEs}
                      onChange={(e) => setNewPresetMessageEs(e.target.value)}
                      className="min-h-[200px] font-mono text-xs"
                    />
                    <p className="text-xs text-slate-500">
                      {language === "es"
                        ? "Usa [Nombre] para el cliente y [NombreAgente] para tu nombre"
                        : "Utilitza [Nombre] pel client i [NombreAgente] pel teu nom"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preset-message-ca">
                      {language === "es" ? "Mensaje en Catalán" : "Missatge en Català"}
                    </Label>
                    <Textarea
                      id="preset-message-ca"
                      placeholder="Hola [Nombre] 👋\n\nSóc [NombreAgente]..."
                      value={newPresetMessageCa}
                      onChange={(e) => setNewPresetMessageCa(e.target.value)}
                      className="min-h-[200px] font-mono text-xs"
                    />
                    <p className="text-xs text-slate-500">
                      {language === "es"
                        ? "Opcional: si no se completa, se usará el mensaje en español"
                        : "Opcional: si no es completa, s'utilitzarà el missatge en espanyol"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={saveCustomPreset}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    {editingPreset
                      ? (language === "es" ? "Actualizar Plantilla" : "Actualitzar Plantilla")
                      : (language === "es" ? "Crear Plantilla" : "Crear Plantilla")}
                  </Button>
                  {editingPreset && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={openNewPresetDialog}
                    >
                      {language === "es" ? "Cancelar Edición" : "Cancel·lar Edició"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Lista de plantillas existentes */}
            {customPresets.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {language === "es" ? "Plantillas Personalizadas" : "Plantilles Personalitzades"}
                  </CardTitle>
                  <CardDescription>
                    {language === "es"
                      ? `Tienes ${customPresets.length} plantilla(s) personalizada(s)`
                      : `Tens ${customPresets.length} plantilla/es personalitzada/es`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {customPresets.map((preset) => (
                      <div
                        key={preset.id}
                        className="p-4 border-2 border-slate-200 rounded-lg bg-slate-50 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-slate-900">
                              {preset.label[language]}
                            </h4>
                            <p className="text-xs text-slate-500">
                              {language === "es" ? "ID: " : "ID: "}{preset.name}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => openEditPresetDialog(preset)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => deleteCustomPreset(preset.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-xs text-slate-700 font-mono bg-white p-2 rounded border border-slate-200 whitespace-pre-wrap">
                          {preset.message[language].substring(0, 150)}
                          {preset.message[language].length > 150 && "..."}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
