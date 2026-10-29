#!/usr/bin/env bash
# Isolated final-submission preview. Never uses the production deploy helper,
# backend service, nginx web root, session key, or MySQL socket/database.
set -euo pipefail
umask 077

# Non-interactive SSH shells do not load the Nix profile automatically.
if ! command -v nix-shell >/dev/null 2>&1; then
    set +u
    if [[ -r "$HOME/.nix-profile/etc/profile.d/nix.sh" ]]; then
        . "$HOME/.nix-profile/etc/profile.d/nix.sh"
    elif [[ -r /nix/var/nix/profiles/default/etc/profile.d/nix-daemon.sh ]]; then
        . /nix/var/nix/profiles/default/etc/profile.d/nix-daemon.sh
    fi
    set -u
fi
command -v nix-shell >/dev/null 2>&1 || { echo "Nix is required for the staging build."; exit 1; }

ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
STAGING_DIR="${STAGING_DIR:-$HOME/staging/codesangam-project-links}"
STAGING_PORT="${STAGING_PORT:-18084}"
OAUTH_ENV_FILE="${OAUTH_ENV_FILE:-$HOME/repos/cc_club_mnnit/CodeSangam/server/.env}"
if [[ "$ROOT" == "$HOME/repos/cc_club_mnnit/CodeSangam" ]]; then
    echo "Refusing to build in the live clone. Use a separate clone under ~/staging."
    exit 1
fi
if [[ "$STAGING_DIR" != "$HOME/staging/"* || "$STAGING_DIR" == "$HOME/staging/" ]]; then
    echo "STAGING_DIR must be a specific directory below ~/staging."
    exit 1
fi
STAGING_LISTEN_HOST="${STAGING_LISTEN_HOST:-$(tailscale ip -4)}"
if [[ -z "$STAGING_LISTEN_HOST" || "$STAGING_LISTEN_HOST" == "0.0.0.0" || "$STAGING_LISTEN_HOST" == "::" ]]; then
    echo "Use a loopback or Tailnet bind address, not a public wildcard."
    exit 1
fi
STAGING_LISTEN_HOST="$STAGING_LISTEN_HOST" python3 - <<'PY'
import ipaddress, os, sys
address = ipaddress.ip_address(os.environ["STAGING_LISTEN_HOST"])
if not address.is_loopback and address not in ipaddress.ip_network("100.64.0.0/10"):
    sys.exit("Use a loopback or Tailnet IPv4 address for staging.")
PY
SOCKET="$STAGING_DIR/mysql.sock"
if [[ ${#SOCKET} -gt 100 ]]; then
    echo "STAGING_DIR is too long for a Unix socket path."
    exit 1
fi
mkdir -p "$STAGING_DIR/releases" "$STAGING_DIR/mysql-data" "$HOME/.config/systemd/user"
RELEASE="$STAGING_DIR/releases/$(date -u +%Y%m%dT%H%M%SZ)-$(git -C "$ROOT" rev-parse --short HEAD)"
mkdir -p "$RELEASE/server/bin"
cp -a "$ROOT/server/web" "$RELEASE/server/web"

echo "Building an isolated staging release..."
(
    cd "$ROOT"
    BUILD_OUTPUT="$RELEASE/server/bin/codesangam-backend" nix-shell shell.nix --run '
        cd server
        export PATH="$PATH:$(go env GOPATH)/bin"
        if ! command -v swag >/dev/null 2>&1; then
            go install github.com/swaggo/swag/cmd/swag@v1.16.2
        fi
        swag init && go test ./... && go vet ./... && go build -o "$BUILD_OUTPUT" .
    '
)
MYSQLD="$(cd "$ROOT" && nix-shell shell.nix --run 'command -v mysqld')"
MYSQL="$(cd "$ROOT" && nix-shell shell.nix --run 'command -v mysql')"
if [[ ! -d "$STAGING_DIR/mysql-data/mysql" ]]; then
    "$MYSQLD" --no-defaults --initialize-insecure --datadir="$STAGING_DIR/mysql-data" --log-error="$STAGING_DIR/mysql-init.log"
fi

DB_UNIT="$HOME/.config/systemd/user/codesangam-project-staging-db.service"
APP_UNIT="$HOME/.config/systemd/user/codesangam-project-staging.service"
for unit in "$DB_UNIT" "$APP_UNIT"; do
    if [[ -f "$unit" ]] && ! grep -Fq "$STAGING_DIR" "$unit"; then
        echo "Refusing to overwrite an unrelated unit: $unit"
        exit 1
    fi
done
cat > "$DB_UNIT" <<EOF
[Unit]
Description=Isolated CodeSangam project staging database

[Service]
WorkingDirectory=$STAGING_DIR
ExecStart=$MYSQLD --no-defaults --datadir=$STAGING_DIR/mysql-data --socket=$SOCKET --pid-file=$STAGING_DIR/mysql.pid --skip-networking --innodb-buffer-pool-size=64M --performance-schema=OFF --log-error=$STAGING_DIR/mysql.log
Restart=on-failure
RestartSec=3

[Install]
WantedBy=default.target
EOF
systemctl --user daemon-reload
systemctl --user start codesangam-project-staging-db
# Bounded readiness check of this new private socket, never the live DB.
ready=false
for attempt in {1..40}; do
    if "$MYSQL" --no-defaults --socket="$SOCKET" -u root -e 'SELECT 1' >/dev/null 2>&1; then
        ready=true
        break
    fi
    sleep 0.25
done
if [[ "$ready" != true ]]; then
    echo "The isolated staging database did not start. See $STAGING_DIR/mysql.log."
    exit 1
fi
"$MYSQL" --no-defaults --socket="$SOCKET" -u root -e '
    CREATE DATABASE IF NOT EXISTS codesangam_test_preview CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    CREATE DATABASE IF NOT EXISTS codesangam_test_contri CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
'
"$MYSQL" --no-defaults --socket="$SOCKET" -u root codesangam_test_preview < "$ROOT/server/testdata/project-schema.sql"
count="$("$MYSQL" --no-defaults --socket="$SOCKET" -u root -N -e 'SELECT COUNT(*) FROM codesangam_test_preview.user')"
if [[ "$count" == "0" ]]; then
    "$MYSQL" --no-defaults --socket="$SOCKET" -u root codesangam_test_preview < "$ROOT/server/testdata/project-seed.sql"
fi

if [[ ! -f "$STAGING_DIR/.env" ]]; then
    STAGING_DIR="$STAGING_DIR" STAGING_PORT="$STAGING_PORT" STAGING_LISTEN_HOST="$STAGING_LISTEN_HOST" OAUTH_ENV_FILE="$OAUTH_ENV_FILE" python3 - <<'PY'
import os, secrets
from pathlib import Path

root = Path(os.environ["STAGING_DIR"])
oauth = {}
source = Path(os.environ["OAUTH_ENV_FILE"])
if source.is_file():
    for line in source.read_text().splitlines():
        key, sep, value = line.partition("=")
        if sep and key in ("CLIENT_ID", "CLIENT_SECRET"):
            oauth[key] = value.strip().strip("'\"")
socket = str(root / "mysql.sock")
values = {
    "BASE_URL": "", "PORT": os.environ["STAGING_PORT"],
    "LISTEN_HOST": os.environ["STAGING_LISTEN_HOST"],
    "REGISTRATION_DEADLINE": "1792521000", "DEVELOPMENT_START": "1792521000",
    "DEVELOPMENT_END": "1793248200", "DECLARE_RESULT": "false",
    "SESSION_SECRET": secrets.token_hex(32),
    "DB_URL": f"root@unix({socket})/codesangam_test_preview?charset=utf8mb4&parseTime=True&loc=Local",
    "CONTRI_DB_URL": f"root@unix({socket})/codesangam_test_contri?charset=utf8mb4&parseTime=True&loc=Local",
    "REDIRECT_URL": "http://localhost:8004/api/auth/callback",
    "CLIENT_ID": oauth.get("CLIENT_ID", ""), "CLIENT_SECRET": oauth.get("CLIENT_SECRET", ""),
}
(root / ".env").write_text("".join(f"{key}={value}\n" for key, value in values.items()))
(root / ".env").chmod(0o600)
PY
fi
ln -s "$STAGING_DIR/.env" "$RELEASE/server/.env"
cat > "$APP_UNIT" <<EOF
[Unit]
Description=Isolated CodeSangam final-project submission preview
After=codesangam-project-staging-db.service
Wants=codesangam-project-staging-db.service

[Service]
WorkingDirectory=$RELEASE/server
ExecStart=$RELEASE/server/bin/codesangam-backend
Restart=on-failure
RestartSec=3

[Install]
WantedBy=default.target
EOF
systemctl --user daemon-reload
systemctl --user restart codesangam-project-staging
curl --fail --silent --show-error --retry 8 --retry-connrefused --retry-delay 1 --max-time 10 "http://$STAGING_LISTEN_HOST:$STAGING_PORT/api/v1/cs/deadline" >/dev/null
echo "Staging: http://$STAGING_LISTEN_HOST:$STAGING_PORT/api/auth/dashboard#project"
echo "Synthetic fixture teams only. Production was not changed."
echo "For Google sign-in, forward localhost:8004 to $STAGING_LISTEN_HOST:$STAGING_PORT via SSH."
