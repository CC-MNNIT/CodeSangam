# Running and hosting CodeSangam

React (CRA) client + Go (Echo) backend + MySQL. The live site is at
**https://codesangam.cc-club.in/**, with a Tailnet-only staging copy on
**http://sac-server.tail312b97.ts.net:8081/**.

## Local development

The toolchain comes from Nix — `shell.nix` has Node 20, Go and the MySQL
client, which is all the client and backend builds need.

```bash
nix-shell            # or: nix-shell --run "cd client && npm start"
cp client/.env.example client/.env
cp server/.env.example server/.env   # then fill in the secrets
cd client && npm install && npm start   # http://localhost:3000
```

The backend needs MySQL. It opens two schemas at startup and exits if either is
unreachable (`server/config/connectDb.go`): `DB_URL` for the event data, and
`CONTRI_DB_URL` for ContriHUB rankings. A local `mysql-server` with two empty
databases is enough to develop against — the leaderboard just returns `[]`.

## Deploying

```bash
ssh sac@sac-server.tail312b97.ts.net
bash ~/repos/cc_club_mnnit/CodeSangam/deploy.sh
```

`deploy.sh` pulls `main`, rewrites `client/.env` and the three path-dependent
lines in `server/.env`, builds both halves inside `nix-shell`, checks the
artefacts exist, then copies the client into the nginx web root via the
root-owned `/usr/local/bin/codesangam-deploy-sync`, restarts the backend and
reloads nginx. A failed build aborts before the live site is touched.

To host under a subdirectory instead of the domain root:

```bash
BASE_PATH=/codesangam bash deploy.sh
```

That moves the app, the API and the OAuth callback together. Nothing else in
the codebase hardcodes a path — client routes come from `REACT_APP_BASE_URL`,
the Go API from `BASE_URL`, and the server-rendered templates use
`{{ .BaseUrl }}`.

## What lives on the server (not in git)

| Path | Purpose |
| --- | --- |
| `~/repos/cc_club_mnnit/CodeSangam` | clone, built in place |
| `client/.env`, `server/.env` | machine config + secrets, gitignored |
| `/var/www/codesangam.tailnet/html` | nginx web root the client build is copied into |
| `/etc/nginx/sites-available/codesangam.cc-club.in` | live vhost; Certbot rewrote it in place to add TLS, so edit the live file and keep this repo copy in sync |
| `/etc/nginx/sites-available/codesangam.tailnet` | Tailnet staging vhost on :8081 |
| `/etc/systemd/system/codesangam-backend.service` | runs the Go binary, `After=mysql.service` |
| `/etc/sudoers.d/codesangam-deploy` | passwordless sudo for the sync helper, the restart and the nginx reload/test only |
| `mysql` databases `codesangam`, `contrihub` | event data, ContriHUB stub |

The three root-owned files are kept in `deploy/` in this repo so a fresh
machine can be set up from scratch:

```bash
sudo cp deploy/codesangam-deploy-sync /usr/local/bin/ && sudo chmod 755 /usr/local/bin/codesangam-deploy-sync
sudo cp deploy/codesangam-backend.service /etc/systemd/system/ && sudo systemctl daemon-reload && sudo systemctl enable --now codesangam-backend
sudo cp deploy/codesangam-deploy.sudoers /etc/sudoers.d/codesangam-deploy && sudo chmod 440 /etc/sudoers.d/codesangam-deploy
sudo cp nginx/codesangam.tailnet /etc/nginx/sites-available/ && sudo ln -sf /etc/nginx/sites-available/codesangam.tailnet /etc/nginx/sites-enabled/
```

## Upload limits

Skip this and only the smallest abstracts get through. Three layers apply, in
this order, and they must stay consistent:

| Layer | Setting | Value | On breach |
| --- | --- | --- | --- |
| nginx | `client_max_body_size` in the `location /api/` block of every vhost | `4m` (4,194,304 B) | `413`, shown as "That file is too large to upload." |
| Go router | `middleware.BodyLimit` in `server/main.go` | `5M` (5,000,000 B) | `413` JSON |
| Go app | `MaxFileSize` in `server/controller/codesangam.go` | 3 MB | `400` "This PDF is larger than 3 MB…" |

nginx is deliberately the *outer* wall: when it rejects first the user gets a
clean 413, whereas a router-level rejection closes the connection mid-upload
and nginx turns that into a confusing 502. Note nginx's `m` is binary
(1024²) while `BodyLimit`'s `M` is decimal (1000²) — that is why the numbers
do not match.

`nginx` defaults `client_max_body_size` to **1 MB**, which is smaller than the
3 MB the app and the dashboard advertise; if it is ever missing from a vhost,
abstracts between 1 MB and 3 MB fail with no useful reason in the UI.

## Registration deadline

`REGISTRATION_DEADLINE` in `server/.env` is a unix timestamp enforced by
`middleware.DeadlineMiddleware` on exactly two routes:

- `POST /api/v1/cs/register` — team registration
- `POST /api/v1/cs/abstract` — abstract upload

Everything else stays open: dashboards, mentor allotment, mid-term evaluation,
the admin panel and the leaderboards. The value is read at startup, so moving
the cutoff is an edit plus `systemctl restart codesangam-backend` — no rebuild
and no deploy.

For the 2026 edition:

```bash
date -d "2026-10-21 00:00:00 IST" +%s   # 1792521000
```

The timestamp is the first second at which registration is closed, so that value
keeps registration open until 23:59:59 IST on 20 October. **Leaving it empty
means registration never closes** — a missing or unparseable value deliberately
does not lock teams out (an unparseable one is logged at startup).

The landing page reads the deadline from `GET /api/v1/cs/deadline`, so the
countdown can never disagree with what the server enforces; the dashboard gets
the same value server-rendered on `<body data-deadline="…">` and renders its
closed state server-side too, so the page is honest even without JavaScript.
When the cutoff passes, the submission forms are hidden and the server refuses
the writes regardless — the countdown is presentation only.

## Development period

`DEVELOPMENT_START` and `DEVELOPMENT_END` in `server/.env` are the window the
club announced, shown as a second line under the countdown on the dashboard and
the landing page. For 2026:

```bash
date -d "2026-10-21 00:00:00 IST" +%s   # 1792521000  DEVELOPMENT_START
date -d "2026-10-29 10:00:00 IST" +%s   # 1793248200  DEVELOPMENT_END
```

**Display only — nothing enforces the end date.** Abstracts already close at the
registration deadline; allotment and mid-term evaluation stay open afterwards. If
submissions or judging ever need to stop at a fixed moment, that requires a new
gate, not this value.

The label is formatted server-side in IST and sent in `development_label`, so the
client does no timezone maths and there is only ever one copy of these dates.
Either variable left empty (or unparseable, which is logged) hides the line.
Mentors see the development period but not the countdown — they have no
submission forms to close.

`DECLARE_RESULT` is the separate "show results" switch. While it is false,
`GET /api/v1/cs/ranking` returns an empty list, and the client hides its
leaderboards behind `RESULTS_ANNOUNCED` in `client/src/Utils/Config.tsx` —
**flip both after the event**. Note the event key: the client route is
`logicalrhythm` but the server accepts `logical`.

## The server CSS is a committed artefact

`server/web/static/css/app.css` is generated from `server/web/src/app.css` by
`npm --prefix client run build:server-css` (Tailwind, scanning
`server/web/templates/*.html` and `server/web/static/js/*.js`). Nothing else
regenerates it, so **using a new utility class in a template requires
regenerating and committing that file** — otherwise the page ships without the
style.

`deploy.sh` guards this: it regenerates the CSS, compares it with the committed
file and aborts the deploy if they differ, before anything is published.

## Google OAuth

One OAuth client serves every environment. Redirect URIs to register:

- `https://codesangam.cc-club.in/api/auth/callback` — production
- `http://localhost:8004/api/auth/callback` — local development

Authorised JavaScript origin: `https://codesangam.cc-club.in`. A redirect URI
must match `REDIRECT_URL` in `server/.env` exactly. Google's callback only
accepts `https` (or `localhost`), so sign-in cannot be exercised over plain
HTTP on the Tailnet staging host — use the production domain to test the flow.

## Registration numbers

`validateRegNo` in `server/dao/codesangam.go` is a hard-coded allow-list of
cohorts: the 2023/2024/2025 batches, the 2024CA/2025CA MCA batches, and the 2026
batch plus 2026CA for 1st years. It is checked for the leader (whose reg no is
derived from their Google address) and for every teammate entered, so a reg no
outside the list cannot register a team or join one. Extend those patterns
before opening registration to a newer batch, or their sign-up is rejected with
"Registration number … isn't eligible for CodeSangam events."

`ValidSenior` still recognises only the 2021 batch and 2022 MCA, but it grants
nothing any more and should stay that way. A user's registration number is
derived from the local part of the address they signed in with — nothing
verifies it against the institute — so "senior" is self-declared: an account
called `attacker.20210001@gmail.com` satisfies it. Reading an abstract is
team-scoped instead: a member of the team, the mentor allotted to it, or a
panel admin. Mentors reach their teams through allotment, which only ever hands
out teams that already submitted an abstract.
