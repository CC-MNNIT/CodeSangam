#!/bin/bash
# Deploy CodeSangam.
#
# Mirrors the flow of repos/sac-website/deploy.sh: pull, build inside a Nix
# shell, sanity-check the build, copy it into the nginx web root through a
# root-owned helper, restart the backend, reload nginx.
#
# The site is served at the domain root (https://codesangam.cc-club.in/).
# Set BASE_PATH to host it under a subdirectory instead, e.g.
#   BASE_PATH=/codesangam bash deploy.sh
# which rewrites client/.env, the CRA homepage and the Go BASE_URL to match.
# The Go server honours BASE_URL, and the client routes are all built from
# REACT_APP_BASE_URL, so those two plus nginx own the path — nothing else.

# Exit immediately if any command fails
set -e

# ---------------------------------------------------------------- variables
REPO_DIR="$HOME/repos/cc_club_mnnit/CodeSangam"
BACKEND_PORT=8082
# Empty (root hosting) by default. "/codesangam" for subdirectory hosting.
BASE_PATH="${BASE_PATH:-}"
# Canonical public origin, used for the OAuth callback and mentor CSV links.
PUBLIC_ORIGIN="${PUBLIC_ORIGIN:-https://codesangam.cc-club.in}"

echo "Starting Nix-powered CodeSangam deployment..."

# 1. Operate in the repository, and re-exec after pulling so that an update to
#    this very script is picked up (editing a script mid-run corrupts it).
cd "$REPO_DIR"
echo "Operating in: $REPO_DIR"
if [ -z "${DEPLOY_PULLED:-}" ]; then
  echo "Pulling latest changes from Git..."
  git pull --ff-only origin main || git pull origin main
  export DEPLOY_PULLED=1
  exec bash "$0"
fi

. "$HOME/.nix-profile/etc/profile.d/nix.sh"

# 2. Client config. Generated from the committed example so that the only
#    machine-specific value (BASE_PATH) is applied here.
echo "Writing client/.env (BASE_PATH='$BASE_PATH')..."
{
  echo "REACT_APP_BASE_URL=${BASE_PATH#/}"
  echo "PORT=3001"
  echo "REACT_APP_WEBSTER_RANKINGS_DATA_API="
  echo "REACT_APP_DROIDRUSH_RANKINGS_DATA_API="
  echo "REACT_APP_LOGICALRHYTHM_RANKINGS_DATA_API="
  echo "REACT_APP_SOFTABLITZ_RANKINGS_DATA_API="
} > client/.env

# 3. Build the client inside an isolated Nix environment. The CRA "homepage"
#    field decides where the bundle loads its assets from, so it has to agree
#    with REACT_APP_BASE_URL or every asset 404s.
echo "Building the client inside Nix..."
nix-shell shell.nix --run "cd client && npm install && npm run build --homepage '$BASE_PATH/'"

# 4. Build the Go backend. The Makefile "build" target runs swag init first, so
#    swag has to be on PATH; install it into the Nix shell's GOPATH if absent.
echo "Building the backend inside Nix..."
nix-shell shell.nix --run "cd server && export PATH=\$PATH:\$(go env GOPATH)/bin && (which swag >/dev/null 2>&1 || go install github.com/swaggo/swag/cmd/swag@v1.16.2) && make build"

# 4b. The CSS for the Go-rendered pages (login, dashboard, admin) is a committed
#     build artefact: nothing regenerates it, so a template that starts using a
#     new utility class would silently ship without its styles. Regenerate and
#     refuse to deploy if the committed file disagrees - a loud failure here is
#     far better than an unstyled page in production. Tailwind is pinned by
#     client/package-lock.json, so this is deterministic. The backup is restored
#     either way, leaving the worktree clean for the next `git pull`.
echo "Checking the server CSS is in step with the templates..."
CSS_FILE=server/web/static/css/app.css
# The backup lives outside the repo: inside server/web/static it would be
# publicly served and could be swept into a later `git add`.
CSS_BACKUP="$(mktemp)"
cp "$CSS_FILE" "$CSS_BACKUP"
if ! nix-shell shell.nix --run "npm --prefix client run build:server-css"; then
  # A half-written CSS file would be served straight away, so put it back even
  # when the build itself failed.
  mv "$CSS_BACKUP" "$CSS_FILE"
  echo
  echo "ERROR: the server CSS build failed; the committed file has been restored."
  exit 1
fi
if ! cmp -s "$CSS_BACKUP" "$CSS_FILE"; then
  mv "$CSS_BACKUP" "$CSS_FILE"
  echo
  echo "ERROR: $CSS_FILE is out of date with the templates."
  echo "       Run 'npm --prefix client run build:server-css' in the repo, commit the"
  echo "       result, then deploy again. Nothing has been published."
  exit 1
fi
rm -f "$CSS_BACKUP"

# 5. Sanity check both artefacts before touching anything live.
if [ ! -f client/build/index.html ]; then
  echo "Client build failed: client/build/index.html missing — leaving the live site untouched."
  exit 1
fi
if [ ! -x server/bin/codesangam-backend ]; then
  echo "Backend build failed: server/bin/codesangam-backend missing — leaving the live site untouched."
  exit 1
fi

# 6. Server config: keep the secrets, refresh the two path-dependent values.
#    sed -i on this file is safe because /codesangam cannot occur in a secret.
if [ ! -f server/.env ]; then
  echo "server/.env is missing. Create it from server/.env.example first."
  exit 1
fi
echo "Updating server/.env (BASE_URL='$BASE_PATH')..."
sed -i "s|^BASE_URL=.*|BASE_URL=$BASE_PATH|" server/.env
sed -i "s|^PORT=.*|PORT=$BACKEND_PORT|" server/.env
sed -i "s|^REDIRECT_URL=.*|REDIRECT_URL=$PUBLIC_ORIGIN$BASE_PATH/api/auth/callback|" server/.env

# 7. Publish the client build through the root-owned sync helper, then swap the
#    backend and the nginx config. The helper refuses to run on an empty build,
#    so a failed deploy can never blank the live site.
echo "Syncing client build to the web root..."
sudo /usr/local/bin/codesangam-deploy-sync "$BASE_PATH"

echo "Restarting the backend..."
sudo /bin/systemctl restart codesangam-backend

echo "Testing and reloading nginx..."
sudo /usr/sbin/nginx -t
sudo /bin/systemctl reload nginx

echo "Deployment successful."
if [ -n "$BASE_PATH" ]; then
  echo "  Prod:    $PUBLIC_ORIGIN$BASE_PATH/"
  echo "  Staging: http://sac-server.tail312b97.ts.net:8081$BASE_PATH/"
else
  echo "  Prod:    $PUBLIC_ORIGIN/"
  echo "  Staging: http://sac-server.tail312b97.ts.net:8081/"
fi
