# Rechner-Setup (einmalig, unabhängig vom einzelnen Projekt)

Das hier musst du **einmal pro Rechner** einrichten – nicht pro Projekt. Neuer Laptop, neuer Kollege, Rechner neu aufgesetzt: hier anfangen, bevor du überhaupt ein Projekt aus dem Template startest.

---

## 1. Software installieren

- **[VSCode](https://code.visualstudio.com/)**
- **[Node.js](https://nodejs.org/)** (LTS-Version, aktuell empfohlen: 24+)
- **[GitHub Desktop](https://desktop.github.com/)** (zum Committen/Pushen ohne Terminal-Git-Befehle)
- **[mkcert](https://github.com/FiloSottile/mkcert)** (für lokale HTTPS-Zertifikate):
  ```powershell
  winget install FiloSottile.mkcert
  ```
  Neues Terminal öffnen (PATH wird erst nach Neustart des Terminals erkannt), dann testen:
  ```powershell
  mkcert -version
  ```

### VSCode-Extensions

- **Live Server** (Autor: ritwickdey)
- **ESLint** (Autor: Microsoft)
- **Prettier - Code formatter** (Autor: Prettier)
- **GitHub Actions** (Autor: GitHub) – optional, für Syntax-Highlighting/Live-Status der Workflows direkt in VSCode

### VSCode-Einstellungen (global, nicht projektspezifisch)

`Strg + ,` → Settings:
- **"Format On Save"** aktivieren
- **"Default Formatter"** → "Prettier - Code formatter" auswählen

---

## 2. Lokale Zertifizierungsstelle installieren (einmalig)

```powershell
mkcert -install
```

Installiert eine lokale Root-CA in den Windows-Zertifikatsspeicher. Danach vertrauen Chrome/Brave/Edge automatisch allen Zertifikaten, die mkcert erstellt – **kein** "Nicht sicher"-Warnhinweis im Browser.

## 3. Zentrales HTTPS-Zertifikat für localhost erzeugen (einmalig, für alle zukünftigen Projekte)

```powershell
mkdir C:\Users\<Name>\.certs\localhost
cd C:\Users\<Name>\.certs\localhost
mkcert localhost 127.0.0.1
```

Erzeugt `localhost+1.pem` (Zertifikat) und `localhost+1-key.pem` (Schlüssel). Dieser eine Zertifikat-Satz wird von **jedem** zukünftigen Projekt wiederverwendet – in jedem neuen Projekt wird nur eine `.vscode/settings.json` angelegt, die auf diesen zentralen Pfad zeigt (siehe Haupt-README).

**Nicht in Git einchecken** – liegt bewusst außerhalb jedes Projektordners, betrifft also kein `.gitignore` eines einzelnen Repos.

---

## 4. GitHub-Zugang einrichten

1. Persönlichen GitHub-Account anlegen/nutzen
2. Mitglied der Organisation **pixelgiantagency** werden (Einladung nötig)
3. In GitHub Desktop einmalig anmelden (File → Options → Accounts → Sign in)

### Organisations-weite Actions-Berechtigung (einmalig für die ganze Organisation, nicht pro Repo)

Ohne diesen Schritt lässt sich "Read and write permissions" bei einzelnen Repos nicht auswählen:

1. `https://github.com/organizations/pixelgiantagency/settings/actions`
2. **"Workflow permissions"** → **"Read and write permissions"** → Save

Erst danach lässt sich dieselbe Einstellung bei einzelnen Repos setzen (das muss dann trotzdem noch **pro Repo** einmalig gemacht werden, siehe Haupt-README Schritt 10).

---

## 5. Browser-Vorbereitung (empfohlen, aber optional)

Für den lokalen `?dev=true`-Workflow blockieren Chrome/Brave standardmäßig Verbindungen von einer öffentlichen HTTPS-Seite zu `127.0.0.1` ("Local Network Access"). Details und Fix siehe Haupt-README, Abschnitt "Browser-Stolperstein".

**Empfehlung:** Ein separates Browser-Profil ("Dev") anlegen, in dem diese Sicherheitsfunktion dauerhaft deaktiviert ist, damit das normale Alltags-Profil ungeschützt bleibt. Siehe Haupt-README für die konkreten Schritte.

---

Nach diesen fünf Schritten: Bereit, ein neues Projekt aus dem Template zu starten (siehe Haupt-README, "Neues Projekt aus diesem Template starten").
