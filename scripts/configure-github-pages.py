#!/usr/bin/env python3
"""Configure GitHub Pages + Actions secrets for wkk-ai/french-course.

Requires GH_TOKEN from the wkk-ai account (repo admin). The willkazuo HTTPS
credential on this machine cannot manage the private wkk-ai/french-course repo.
"""
from __future__ import annotations

import base64
import json
import os
import sys
import urllib.error
import urllib.request
from pathlib import Path

REPO = "wkk-ai/french-course"
SITE_URL = "https://wkk-ai.github.io/french-course/"
ROOT = Path(__file__).resolve().parents[1]


def load_env_local() -> dict[str, str]:
    env: dict[str, str] = {}
    for line in (ROOT / ".env.local").read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        env[key] = value
    return env


def gh_request(token: str, method: str, path: str, data: dict | None = None) -> dict | None:
    url = f"https://api.github.com{path}"
    body = json.dumps(data).encode() if data is not None else None
    req = urllib.request.Request(
        url,
        data=body,
        method=method,
        headers={
            "Authorization": f"Bearer {token}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "Content-Type": "application/json",
            "User-Agent": "french-course-pages-setup",
        },
    )
    with urllib.request.urlopen(req) as resp:
        raw = resp.read().decode()
        return json.loads(raw) if raw else None


def set_secret(token: str, name: str, value: str) -> None:
    from nacl import encoding, public

    key_info = gh_request(token, "GET", f"/repos/{REPO}/actions/secrets/public-key")
    assert key_info is not None
    public_key = public.PublicKey(key_info["key"].encode("utf-8"), encoding.Base64Encoder())
    sealed = public.SealedBox(public_key).encrypt(value.encode("utf-8"))
    encrypted_value = base64.b64encode(sealed).decode("utf-8")
    gh_request(
        token,
        "PUT",
        f"/repos/{REPO}/actions/secrets/{name}",
        {"encrypted_value": encrypted_value, "key_id": key_info["key_id"]},
    )
    print(f"✓ secret {name}")


def enable_pages(token: str) -> None:
    try:
        gh_request(token, "PUT", f"/repos/{REPO}/pages", {"build_type": "workflow"})
        print("✓ Pages source: GitHub Actions")
    except urllib.error.HTTPError as err:
        payload = err.read().decode()
        if err.code == 404:
            gh_request(token, "POST", f"/repos/{REPO}/pages", {"build_type": "workflow"})
            print("✓ Pages site created (GitHub Actions)")
        elif err.code == 409:
            gh_request(token, "PATCH", f"/repos/{REPO}/pages", {"build_type": "workflow"})
            print("✓ Pages source updated to GitHub Actions")
        else:
            raise RuntimeError(f"Pages API {err.code}: {payload}") from err


def main() -> None:
    token = os.environ.get("GH_TOKEN", "").strip()
    if not token:
        print("Set GH_TOKEN to a wkk-ai PAT with repo + workflow scope.", file=sys.stderr)
        sys.exit(1)

    user = gh_request(token, "GET", "/user")
    assert user is not None
    print(f"GitHub user: {user['login']}")

    try:
        gh_request(token, "GET", f"/repos/{REPO}")
    except urllib.error.HTTPError as err:
        if err.code == 404:
            print(
                f"Token cannot access {REPO}. Create the PAT while logged in as wkk-ai.",
                file=sys.stderr,
            )
            sys.exit(1)
        raise

    env = load_env_local()
    for key in ("NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"):
        if key not in env:
            print(f"Missing {key} in .env.local", file=sys.stderr)
            sys.exit(1)

    enable_pages(token)
    set_secret(token, "NEXT_PUBLIC_SUPABASE_URL", env["NEXT_PUBLIC_SUPABASE_URL"])
    set_secret(token, "NEXT_PUBLIC_SUPABASE_ANON_KEY", env["NEXT_PUBLIC_SUPABASE_ANON_KEY"])

    gh_request(
        token,
        "POST",
        f"/repos/{REPO}/actions/workflows/deploy-pages.yml/dispatches",
        {"ref": "main"},
    )
    print("✓ Deploy workflow dispatched")
    print()
    print("Supabase Auth → URL configuration:")
    print(f"  Site URL: {SITE_URL}")
    print(f"  Redirect URLs: {SITE_URL}**")
    print("  https://supabase.com/dashboard/project/entvhrwlfcwnmwpneuvj/auth/url-configuration")
    print(f"\nLive site (after deploy): {SITE_URL}")


if __name__ == "__main__":
    main()
