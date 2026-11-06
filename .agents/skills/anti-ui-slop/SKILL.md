---
name: anti-ui-slop
description: Prevents generic AI UI clichés (UI Slop). Enforces intentional typography, purposeful whitespace, authentic contrast, and real-world design craft.
---

# Anti-UI Slop Skill — Eliminación de Clichés y Diseño Genérico de IA

Esta skill erradica los patrones genéricos, repetitivos y artificiales que la IA suele generar por defecto ("UI Slop").

## ¿Qué es "UI Slop"? (Prohibiciones Estrictas)
1. **Gradientes de fondo aleatorios:** Prohibido usar degradados púrpuras, violetas o rosas fluorescentes sin contexto de marca.
2. **Pills/Badges flotantes cliché:** Prohibido poner badges flotantes "✨ Ahora potenciado con IA" o "🚀 Nuevo" si no aportan valor funcional real.
3. **Card Grid 3-columnas idéntico y plano:** No hacer tres tarjetas centradas con exactamente el mismo padding, un ícono dentro de un círculo con fondo pastel al 10% de opacidad y texto genérico en `text-gray-500`.
4. **Hero Centrado Aburrido:** Título gigante centrado + subtítulo idéntico + dos botones (uno negro y uno blanco con borde).
5. **Falta de Jerarquía Tipográfica Real:** Usar Inter en todos los niveles con la misma escala. Debe existir intención, contraste y peso visual.

## Principios de Buen Diseño Web (Craft Real)
1. **Propósito e Identidad de Marca:**
   - Para este proyecto (Portafolio de Felipe Bustamante - Freelancer): diseño limpio, moderno, confiable, con toques cálidos/técnicos, enfocado en mostrar trabajo real y facilitar el contacto directo.
2. **Espaciado Intencional (Whitespace):**
   - El espacio en blanco no es vacío desperdiciado; guía el ojo y otorga elegancia.
3. **Jerarquía Visual y Tipografía:**
   - Títulos con personalidad, pesos contrastados y longitud de línea legible (`max-w-prose` / 65ch para textos).
4. **Micro-interacciones y Estados Reales:**
   - Hover states sutiles (cambios de color limpios, elevación suave sin sombras gigantes `shadow-2xl` innecesarias).
   - Focus visible para accesibilidad (`focus-visible:ring-2`).
   - Estados de carga claros en formularios (spinner / disabled sutil).
5. **Paleta de Colores Funcional:**
   - Colores neutros con balance (evitar grises lavados sin contraste). Un color de acento principal y uno secundario con propósito semántico.
