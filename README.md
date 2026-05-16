# 🏥 Estimador de Copago Médico — Agente IA

Agente conversacional inteligente que ayuda a los pacientes a estimar el costo de su **copago médico** según sus síntomas y su plan de seguro. El agente identifica la especialidad médica más adecuada, consulta la póliza del paciente y presenta una comparación de hospitales disponibles ordenados por menor copago.

---

## ¿Cómo funciona?

El agente guía al usuario en una conversación de dos pasos:

```
Usuario describe síntoma  →  Agente solicita número de póliza  →  Agente muestra opciones de hospitales
```

### Flujo detallado

```
┌─────────────────────────────────────────────────────┐
│  1. Usuario escribe su síntoma o molestia médica     │
│     Ej: "Tengo un fuerte dolor de cabeza"            │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│  2. El agente identifica la especialidad médica       │
│     Ej: Neurología — Consulta Neurológica            │
│     Y solicita el número de póliza del paciente      │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│  3. Usuario proporciona su número de póliza          │
│     Formato: POL-XXXX  (ej: POL-1001)               │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│  4. El agente muestra la tarjeta de resultados       │
│     • Plan de seguro y % de cobertura                │
│     • Lista de hospitales ordenados por menor copago │
│     • Precio estimado de copago por hospital         │
└─────────────────────────────────────────────────────┘
```

---

## Pólizas de prueba disponibles

Utiliza cualquiera de los siguientes números de póliza para probar el agente:

| Número de Póliza | Nombre del Paciente | Plan     | Cobertura |
|------------------|---------------------|----------|-----------|
| `POL-1001`       | María García        | Gold     | 85%       |
| `POL-1002`       | Juan Pérez          | Silver   | 70%       |
| `POL-1003`       | Ana Martínez        | Basic    | 50%       |
| `POL-1004`       | Carlos López        | Gold     | 85%       |
| `POL-1005`       | Sofía Rodríguez     | Silver   | 70%       |
| `POL-1006`       | Diego Fernández     | Basic    | 50%       |
| `POL-1007`       | Valentina Torres    | Gold     | 85%       |
| `POL-1008`       | Andrés Ramírez      | Silver   | 70%       |
| `POL-1009`       | Camila Herrera      | Basic    | 50%       |
| `POL-1010`       | Luis Castro         | Gold     | 85%       |

---

## Ejemplos de síntomas para probar

Puedes escribir cualquiera de los siguientes síntomas (en español o inglés):

- `"Tengo dolor de espalda muy fuerte"`
- `"Me duele el pecho y siento presión"`
- `"Tengo dolor de cabeza intenso y persistente"`
- `"Me duele el estómago, tengo náuseas"`
- `"Siento dolor en las rodillas al caminar"`
- `"Tengo fiebre alta y dolor de garganta"`

---

## Instalación y ejecución local

### Requisitos previos

- Node.js 18+
- npm o pnpm
- Cuentas activas en **OpenAI** y **Pinecone**

### 1. Clonar el repositorio

```bash
git clone https://github.com/Ricardo230698/HACKIATON-VIAMATICA.git
cd HACKIATON-VIAMATICA
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes claves:

```env
OPENAI_API_KEY=tu_clave_de_openai
PINECONE_API_KEY=tu_clave_de_pinecone
PINECONE_INDEX_NAME=copay-estimator
```

> **Importante:** Nunca subas el archivo `.env` al repositorio. Ya está incluido en `.gitignore`.

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador. La aplicación redirige automáticamente a `/chat`.

---

## Arquitectura del proyecto

```
src/
├── app/
│   ├── api/copay/chat/route.ts   # API Route — orquesta las señales del agente
│   ├── chat/page.tsx             # Página del chat
│   └── layout.tsx
├── components/
│   ├── CopayChat.tsx             # Componente principal del chat
│   └── chat/
│       ├── ChatHeader.tsx        # Encabezado con logo y badges de plan
│       ├── ChatInput.tsx         # Área de entrada de texto
│       ├── MessageList.tsx       # Lista de mensajes y estados de carga
│       ├── MessageBubble.tsx     # Renderizado de mensajes por rol
│       ├── HandoffPrompt.tsx     # Prompt de transferencia a humano
│       └── ResultPanel.tsx       # Tarjeta de resultados de copago
├── hooks/
│   └── useChat.ts                # Estado del chat y lógica de mensajes
├── services/
│   └── chatService.ts            # Llamadas al API de chat
├── types/index.ts                # Interfaces TypeScript
├── constants/index.ts            # Colores, rutas y valores fijos
└── lib/
    ├── db.ts                     # Consultas SQLite (pólizas)
    ├── pineconeSearch.ts         # Búsqueda semántica de síntomas
    ├── parseSignals.ts           # Parser de señales del LLM
    └── systemPrompt.ts           # Prompt del sistema en español
```

### Tecnologías utilizadas

| Capa         | Tecnología                              |
|--------------|-----------------------------------------|
| Frontend     | Next.js 16, React 19, TailwindCSS       |
| IA / LLM     | OpenAI GPT-4o                           |
| Embeddings   | OpenAI text-embedding-3-large (1024d)   |
| Vector DB    | Pinecone                                |
| Base de datos| SQLite (via sql.js)                     |
| Iconos       | Lucide React                            |

---

## ¿Cómo funciona el agente internamente?

El agente usa un sistema de **señales embebidas** en sus respuestas para comunicarse con el backend:

| Señal               | Se emite cuando...                                      | Acción del backend                                      |
|---------------------|---------------------------------------------------------|---------------------------------------------------------|
| `SYMPTOM_IDENTIFIED`| El usuario describe un síntoma                          | Búsqueda semántica en Pinecone para identificar especialidad |
| `POLICY_LOOKUP`     | El usuario proporciona su número de póliza              | Consulta en SQLite para obtener datos del plan          |
| `COPAY_READY`       | Agente tiene síntoma Y póliza confirmados               | Filtra Pinecone por plan y calcula copago por hospital  |
| `HANDOFF_REQUESTED` | El usuario solicita hablar con una persona              | Muestra el prompt de transferencia a humano             |

### Cálculo del copago

```
Copago = Precio Final − (Precio Final × % Cobertura del Plan)
```

Donde el precio final se calcula como:

```
Precio Final = Costo Base del Servicio × Multiplicador del Hospital
```

---

## Transferencia a agente humano

Si en algún momento el usuario expresa frustración o solicita hablar con una persona, el agente muestra una tarjeta con dos opciones:

- **Sí, conéctame** — Confirma la transferencia y muestra un mensaje de estado
- **No, continuar** — Descarta el prompt y continúa la conversación con el agente IA

---

## Planes de seguro disponibles

| Plan   | Cobertura | Descripción                          |
|--------|-----------|--------------------------------------|
| Gold   | 85%       | Mayor cobertura, menor copago        |
| Silver | 70%       | Cobertura media                      |
| Basic  | 50%       | Cobertura básica, mayor copago       |

---

## Caso de prueba completo

1. Abre [http://localhost:3000/chat](http://localhost:3000/chat)
2. El agente saluda y solicita información
3. Escribe: `"Tengo un dolor muy fuerte en la espalda baja"`
4. El agente reconoce el síntoma e identifica la especialidad (ej: Traumatología)
5. El agente solicita tu número de póliza
6. Escribe: `POL-1001`
7. El agente confirma que encontró la póliza (Plan Gold, 85% cobertura — María García)
8. El agente muestra la tarjeta con las opciones de hospitales y el copago estimado por cada uno
9. El hospital con el **menor copago** aparece marcado con ⭐ y la etiqueta "Mejor Precio"
