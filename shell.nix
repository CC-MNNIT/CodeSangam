{ pkgs ? import <nixpkgs> {} }:

# Toolchain for CodeSangam: CRA client build + Go backend build.
# mysql80 is only for the mysql client binary; the server itself is the
# system mysql-server (see HOSTING.md).
pkgs.mkShell {
  buildInputs = [
    pkgs.nodejs_20
    pkgs.go
    pkgs.mysql80
  ];
}
