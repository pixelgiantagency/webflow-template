# Pixelgiant Webflow Template

Ausgangspunkt für neue Webflow-Kundenprojekte: TypeScript + esbuild + GitHub Actions + jsDelivr. Ersetzt die Notwendigkeit für Drittanbieter-Hosting von Custom Code.

**Neuer Rechner?** Siehe zuerst [`docs/machine-setup.md`](docs/machine-setup.md) – dort steht, was einmalig auf dem Rechner installiert sein muss, bevor dieses Template überhaupt nutzbar ist.

## Neues Projekt aus diesem Template starten

1. Auf GitHub: **"Use this template"** → neues Repository anlegen (public, wegen jsDelivr)
2. Lokal klonen (GitHub Desktop oder `git clone`)
3. `npm install`
4. `src/main.ts` und `src/global.ts` als Ausgangspunkt nutzen, projektspezifische Components in `src/components/` ergänzen
5. Nicht benötigte Typ-Dateien in `src/types/` löschen bzw. neue ergänzen (siehe unten)
6. `package.json`: `name` auf den neuen Projektnamen anpassen
7. Head-Snippet mit den korrekten Repo-Pfaden in Webflow einfügen (siehe unten)
8. `.github/workflows/build.yml` braucht **keine** Anpassung – nutzt automatisch den richtigen Repo-Namen über GitHub-Kontextvariablen
9. In den Repo-Settings (**und** ggf. Organisations-Settings, siehe machine-setup) unter Actions → General → "Read and write permissions" aktivieren
10. **Ersten Test machen** (siehe Checkliste ganz unten), bevor du mit dem eigentlichen Projekt loslegst

---

## Projektstruktur

```
src/
  main.ts                  → Einstiegspunkt, importiert & ruft alle init-Funktionen auf
  global.ts                → Site-weite, projektunabhängige Funktionen (GSAP-Setup, Refresh-Fixes)
  components/               → Seitenspezifische Funktionen, ein File pro Feature
  types/                    → GSAP-Plugin-Typdeklarationen (siehe unten, nur was gebraucht wird)
dist/
  bundle.js                 → Automatisch generiert, nicht manuell bearbeiten
.github/workflows/build.yml → Baut & pusht dist/bundle.js automatisch bei jedem Push
```

---

## GSAP-Plugins hinzufügen/entfernen

Jedes GSAP-Plugin bekommt seine eigene, kleine `.d.ts`-Datei in `src/types/` – dadurch bleibt pro Projekt nur drin, was tatsächlich gebraucht wird, und der Dateibaum dokumentiert selbst, welche Plugins im Einsatz sind.

**Wichtig:** Eine `.d.ts`-Datei sagt TypeScript nur "vertrau mir, das existiert zur Laufzeit" – sie prüft **nicht**, ob das Plugin tatsächlich per Webflow-CDN eingebunden ist. `.d.ts`-Dateien und die echten CDN-Einbindungen in Webflow müssen manuell synchron gehalten werden.

### Rezept für ein neues Plugin

```typescript
// src/types/<plugin-name>.d.ts
import type { PluginName as PluginNameType } from 'gsap/PluginName';

declare global {
  const PluginName: typeof PluginNameType;
  // Nur nötig, falls Instanzen dieses Plugins in Variablen gespeichert werden
  // (wie bei ScrollSmoother/ScrollTrigger):
  // type PluginName = InstanceType<typeof PluginNameType>;
}

export {};
```

### Referenz: gängige GSAP-Plugins

| Plugin           | npm-Importpfad          | Typischer Einsatz                             |
| ---------------- | ----------------------- | --------------------------------------------- |
| ScrollTrigger    | `gsap/ScrollTrigger`    | Scroll-gesteuerte Animationen                 |
| ScrollSmoother   | `gsap/ScrollSmoother`   | Smooth Scrolling                              |
| SplitText        | `gsap/SplitText`        | Text-Reveal-Animationen                       |
| Observer         | `gsap/Observer`         | Scroll-/Wheel-/Touch-Gesten (z.B. Slideshows) |
| CustomEase       | `gsap/CustomEase`       | Individuelle Easing-Kurven                    |
| Draggable        | `gsap/Draggable`        | Drag-Interaktionen                            |
| Flip             | `gsap/Flip`             | Layout-Übergangs-Animationen                  |
| MotionPathPlugin | `gsap/MotionPathPlugin` | Bewegung entlang eines Pfads                  |
| TextPlugin       | `gsap/TextPlugin`       | Text-Tippeffekte                              |
| DrawSVGPlugin    | `gsap/DrawSVGPlugin`    | SVG-Linien zeichnen                           |
| MorphSVGPlugin   | `gsap/MorphSVGPlugin`   | SVG-Form-Morphing                             |

Alle GSAP-Plugins sind seit 2025 kostenlos nutzbar. Vollständige, aktuelle Liste: [gsap.com/docs/v3/Plugins](https://gsap.com/docs/v3/Plugins/)

**Nicht vergessen:** Zusätzlich zur `.d.ts`-Datei muss `gsap.registerPlugin(...)` in `global.ts` (bzw. wo das Plugin genutzt wird) um das neue Plugin ergänzt werden, und das Plugin muss per Webflow-UI tatsächlich als CDN-Script eingebunden sein.

---

## .gitignore – was rein muss und was nicht

```
node_modules/
```

**Bewusst NICHT drin: `dist/`.** Das widerspricht der üblichen Regel ("Build-Output nicht committen"), ist hier aber notwendig: jsDelivr liefert bei `gh/`-URLs die Rohdatei direkt aus dem Repository aus – es gibt keinen Server, der zur Laufzeit baut. `dist/bundle.js` muss also zwingend im Repo liegen. Gepflegt wird sie trotzdem nicht manuell, sondern automatisch von der GitHub Action bei jedem Push (siehe "Deployment" unten).

---

## Lokale Entwicklung (pro Projekt)

Kein Zertifikat, keine HTTPS-Konfiguration nötig – der lokale Dev-Server läuft über reines HTTP. Grund: `localhost`/`127.0.0.1` gelten browserseitig als sichere Ursprünge, auch wenn sie von einer HTTPS-Seite aus geladen werden (funktioniert identisch auf Windows und Mac, ohne Zertifikat-Verwaltung).

```powershell
npm run dev
```

Startet einen lokalen Server unter `http://localhost:3000`, der bei jeder Anfrage automatisch neu baut. Läuft im Terminal weiter, einfach offen lassen.

**Kurzer Funktionstest:** `http://localhost:3000/bundle.js` direkt im Browser öffnen – sollte den kompilierten Code zeigen, ohne Warnung.

**Ablauf beim Entwickeln:** Code ändern → `Strg+S` (speichern) → im Browser-Tab mit der Test-/Staging-Seite manuell **F5** drücken (kein automatisches Reload der Webflow-Seite, da diese ja nicht vom lokalen Server selbst ausgeliefert wird, sondern den Code nur per Script-Tag nachlädt).

---

## Webflow Head-Snippet (Vorlage)

In Project Settings → Custom Code (Head), mit den echten Werten des jeweiligen Projekts ersetzen:

```javascript
(function () {
  const LOCAL_SCRIPT = 'http://localhost:3000/bundle.js';
  const STAGING_SCRIPT = 'https://cdn.jsdelivr.net/gh/<ORG>/<REPO>@main/dist/bundle.js';
  const PROD_SCRIPT = 'https://cdn.jsdelivr.net/gh/<ORG>/<REPO>@<VERSION>/dist/bundle.js';

  const isStaging = window.location.hostname.includes('webflow.io');
  if (window.location.search.includes('dev=true')) localStorage.setItem('devMode', 'true');
  if (window.location.search.includes('dev=false')) localStorage.removeItem('devMode');
  const isLocalDev = localStorage.getItem('devMode') === 'true';

  let finalScriptUrl = PROD_SCRIPT;
  if (isStaging) {
    if (isLocalDev) {
      finalScriptUrl = LOCAL_SCRIPT;
      console.log('🟡 Lade lokalen Code (localhost:3000)');
    } else {
      finalScriptUrl = STAGING_SCRIPT + '?v=' + Date.now();
      console.log('🔵 Lade Staging Code (GitHub Main)');
    }
  }

  const scriptTag = document.createElement('script');
  scriptTag.src = finalScriptUrl;
  scriptTag.type = 'text/javascript';
  scriptTag.defer = true;
  document.head.appendChild(scriptTag);
})();
```

`<ORG>/<REPO>` durch die echten Werte ersetzen (z.B. `pixelgiantagency/supplyhero`).

**Hinweis:** `localStorage` ist pro Browser getrennt gespeichert. Nach dem Testen mit `?dev=true` in einem Browser nicht vergessen, `?dev=false` aufzurufen, bevor man in einem anderen Browser testet – sonst versucht dieser weiterhin `localhost:3000` zu laden, auch wenn der lokale Server dort gar nicht läuft (Fehler: `ERR_CONNECTION_REFUSED`).

---

## Code-Qualität

```powershell
npm run check     # TypeScript-Typen prüfen
npm run lint       # ESLint
npm run lint -- --fix
npm run format      # Prettier
```

---

## Deployment

**Staging:** automatisch bei jedem Push zu `main` (GitHub Action baut, committet `dist/bundle.js`, purged jsDelivr-Cache).

**Produktion:** bewusster, manueller Schritt:

```powershell
git tag v1.0.0
git push origin v1.0.0
```

Danach `PROD_SCRIPT` im Webflow Head-Code auf die neue Version anpassen und publishen. Rollback: `PROD_SCRIPT` einfach auf eine vorherige Versionsnummer zurücksetzen.

---

## FOUC-Schutz (Flash of Unstyled/Unanimated Content)

Elemente, die per GSAP beim Laden animiert werden (Hero, Navbar etc.), sind ohne Schutz kurz normal sichtbar, bevor GSAP sie versteckt und einanimiert – sichtbar als kurzer Blitzer. Fix, verteilt über zwei Stellen:

**1. CSS im Webflow Head-Code** (diese eine Zeile ist projektübergreifend fertig, ändert sich nie):

```html
<style>
  body:not(.js-ready) [data-fouc-hide] {
    opacity: 0;
  }
</style>
<script>
  // Fallback: falls bundle.js aus irgendeinem Grund nicht lädt, nach 3s trotzdem freigeben
  setTimeout(function () {
    document.body.classList.add('js-ready');
  }, 3000);
</script>
```

**2. In Webflow:** Jedem Element, das beim Laden per GSAP animiert wird (Hero-Heading, Navbar, etc.), zusätzlich das Custom Attribute `data-fouc-hide` geben – kein Code-Editieren nötig, direkt im Designer erledigt.

**3. `revealAfterSetup()`** (bereits in `global.ts`, wird in `main.ts` als letzter Aufruf in `init()` ausgeführt) setzt `js-ready`, sobald alle Animationen ihre Startzustände gesetzt haben.

**⚠️ Kritisch: Niemals `!important` in der CSS-Regel verwenden.** GSAP setzt Animationswerte als Inline-Styles ohne `!important` – ein `!important` in der externen Regel würde die Animation dauerhaft unsichtbar "einfrieren", auch nach `js-ready`. Ohne `!important` gewinnen GSAPs Inline-Styles automatisch, sobald sie zu animieren beginnen.

---

## Bekannte Stolpersteine

**jsDelivr Purge-Throttling.** Der Purge-Endpoint (`purge.jsdelivr.net`) lässt sich für denselben Pfad nur begrenzt oft hintereinander aufrufen – bei zu häufigem Aufruf wird der Request stillschweigend **throttled** (nicht ausgeführt), obwohl die Antwort wie ein Erfolg aussieht. JSON-Response immer prüfen:

```json
{ "paths": { "/gh/.../bundle.js": { "throttled": true, "throttlingReset": 959 } } }
```

`throttled: true` = ignoriert, `throttlingReset` = Sekunden bis zum nächsten möglichen Versuch. Falls throttled: einfach warten oder gar nichts tun – der Cache läuft nach spätestens 12 Stunden (`s-maxage=43200`) ohnehin von selbst ab, auch ganz ohne Purge.

---

## Checkliste: Erster Test nach dem Einrichten eines neuen Projekts

Der Reihe nach abhaken, bevor mit dem eigentlichen Projekt losgelegt wird – jeder Schritt baut auf dem vorherigen auf:

1. `npm run check` → keine Ausgabe/Fehler
2. `npm run lint` → `0 problems`
3. `npm run build` → `dist/bundle.js` wird erzeugt
4. `npm run dev` starten, `http://localhost:3000/bundle.js` direkt im Browser öffnen → lädt ohne Warnung
5. Ersten Commit + Push machen
6. GitHub → Tab "Actions" → Workflow-Lauf wird grün (alle Schritte inkl. `check`/`lint`/`build`/Commit/Purge)
7. GitHub → Tab "Code" → automatischer Commit "chore: rebuild dist [skip ci]" ist sichtbar
8. Direkt im Browser öffnen: `https://cdn.jsdelivr.net/gh/<ORG>/<REPO>@main/dist/bundle.js` → zeigt den gebauten Code
9. Head-Snippet in Webflow einfügen, publishen, Staging-Seite mit `?dev=true` öffnen → Konsole zeigt `🟡 Lade lokalen Code`
10. `?dev=false` aufrufen, Seite ohne Query-Parameter neu laden → Konsole zeigt `🔵 Lade Staging Code (GitHub Main)`

Erst wenn alle 10 Punkte durchlaufen: mit dem eigentlichen Projekt-Code loslegen.
