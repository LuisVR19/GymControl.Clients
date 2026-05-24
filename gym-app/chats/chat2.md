# Selector de rutina semanal

_Started 2026-05-04 18:00 UTC_

---

## User

quiero un modal en el app mobil que abra un modal o algo que permita seleccionar una rutina y asignarla a un dia de la semana en la pantalla de agenda

## Assistant

Voy a revisar el prototipo actual para entender el contexto y el sistema de diseño existente.

_[tool: list_files]_

_[tool: read_file]_

Voy a leer el archivo del cliente app para entender la pantalla de agenda.

_[tool: read_file]_

Voy a añadir un modal a la pantalla de agenda que permita seleccionar una rutina y asignarla a un día de la semana. El plus button ya existe en el header — lo conectaré al modal.

_[tool: str_replace_edit]_

Ahora actualizo la lista "Próximos" para usar las asignaciones dinámicas y conectar el botón de empty state.

_[tool: str_replace_edit]_

_[tool: snip]_

Verifico que cargue limpio y dejo el preview en la pantalla Agenda con el modal abierto para que lo veas.

_[tool: done]_

Listo. Añadí un **bottom sheet de 2 pasos** que se abre desde el `+` del header de Agenda (y un nuevo CTA "Asignar rutina" junto a "Próximos"):

1. **Elegí una rutina** — lista con las 6 rutinas del programa, con icono, ej./series/min y radio de selección.
2. **Asignala a un día** — chips L–D mostrando qué días ya están ocupados, selector de hora (06:00–20:00), y aviso si vas a reemplazar una sesión existente.

El estado se guarda: la nueva asignación aparece en "Próximos" ordenada por fecha, reemplazando la del mismo día si existía.

_[tool: fork_verifier_agent]_

Listo — el modal está conectado y funcional. Abrílo desde el `+` arriba o desde "Asignar rutina" junto a Próximos.

## User

Verifier agent check completed

## Assistant

_[tool: snip]_

Buen catch. El sheet se renderiza dentro del contenedor scrollable del Calendar, así que el `position:absolute; inset:0` se posiciona contra el Calendar (que es alto, con scroll), no contra el viewport del device. Voy a subir el sheet al nivel de `ClientApp`.

_[tool: read_file]_

Voy a refactorizar: levantar el estado del sheet y assignments a `ClientApp`, y renderizar el sheet como hermano del scroll container.

_[tool: str_replace_edit]_

Ahora actualizo los handlers que usan `setSheetOpen` dentro de `ClientCalendar` para que llamen `onOpenSheet`, y elimino el render del sheet del final del Calendar.

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

Ahora elimino el sheet del final del Calendar y lo levanto a `ClientApp`:

_[tool: str_replace_edit]_

Ahora actualizo `ClientApp` para que sea el dueño del estado del sheet y assignments, y renderice el sheet como hermano del scroll container:

_[tool: str_replace_edit]_

_[tool: snip]_

_[tool: done]_

Arreglado: el sheet ahora se renderiza al nivel de `ClientApp` (hermano del scroll container), así que cubre el viewport del device sin importar el scroll del Calendar.

_[tool: fork_verifier_agent]_

Listo. El sheet ahora vive a nivel de `ClientApp` y cubre correctamente el viewport del device. Esperando confirmación del verificador.

## User

Verifier agent check completed

## Assistant

_[tool: snip]_

Verificado. El modal de asignar rutina funciona correctamente.

## User

quiero que en la parte mobile agregue los modales respectivos para agregar nuevas medidas

## Assistant

_[tool: grep]_

## Assistant

_[tool: grep]_

## User

en la pantalla de progreso, donde se agregan nuevas medidas de peso y de mas para el usuario, esos modales son los que tiene que hacer

## Assistant

_[tool: snip]_

_[tool: read_file]_

## Assistant

_[tool: snip]_

## Assistant

_[tool: snip]_

## Assistant

_[tool: snip]_

_[tool: read_file]_

## User

en la pantalla de progreso, donde se agregan nuevas medidas de peso y de mas para el usuario, esos modales son los que tiene que hacer

## Assistant

Voy a añadir un modal "Nueva medida" en la pantalla de progreso, conectado al botón "+ Nueva" en la card de Medidas corporales, y otro para "+ Registrar peso" en el card de Peso corporal.

_[tool: snip]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: snip]_

_[tool: str_replace_edit]_

_[tool: snip]_

Ahora añado los dos sheets nuevos. Los pongo justo después del `AssignRoutineSheet`:

_[tool: grep]_

_[tool: str_replace_edit]_

_[tool: snip]_

_[tool: read_file]_

_[tool: str_replace_edit]_

_[tool: done]_

Listo — añadí dos modales en la pantalla de Progreso:

**Registrar peso** (botón en la card de Peso corporal)
- Stepper grande ±0.1 kg con shortcuts ±0.5 / ±1
- Selector de momento (Mañana / Mediodía / Noche)
- Nota opcional
- Actualiza la cifra y la sparkline

**Nueva medida** (botón "+ Nueva" en Medidas corporales)
- Chips para activar zonas: Pecho, Cintura, Brazo, Pierna, Cadera, Cuello
- Para cada zona activa: muestra valor anterior, input numérico y delta en vivo
- Guarda actualizando los valores y deltas en la grilla

_[tool: fork_verifier_agent]_

_[tool: snip]_

Probá los modales abriendo la pantalla de Progreso → tocá "Registrar" en la card de Peso, o "+ Nueva" en Medidas corporales.

## User

en la pantalla de rutinas, agregue una opcion para ver la rutina en donde ponga todos los ejercicios y no solo se vean en donde se completa

## Assistant

_[tool: read_file]_

_[tool: snip]_

Voy a hacer dos cambios: (1) tocar una rutina abre un detalle con todos los ejercicios, (2) desde ahí se puede empezar el entreno (si es la activa) o sólo verla.

_[tool: str_replace_edit]_

_[tool: snip]_

Ahora conecto la nueva pantalla en `ClientApp`:

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: done]_

_[tool: snip]_

Listo. Ahora **tocar cualquier rutina** abre una pantalla de detalle con:

- Header con día, nombre, totales (ejercicios / series / minutos estimados)
- Pills de grupos musculares trabajados
- **Lista completa de ejercicios** agrupados por músculo, cada uno con: número, nombre, series×reps, descanso, tempo y última carga registrada
- CTA fijo abajo: "Empezar entreno" si es la rutina activa, "Hacer esta rutina" en las demás

Hay 5 rutinas con ejercicios distintos (push, pull, legs, hombros, pull volumen). El botón ← vuelve a la lista.

_[tool: fork_verifier_agent]_

_[tool: snip]_

Probá tocando cualquiera de las 5 rutinas en la pantalla de Rutinas.

