#!/usr/bin/env python3
"""Turn on GitHub Pages (source: GitHub Actions) for wkk-ai/french-course.

Run once on your Mac:  GH_TOKEN=<token with repo admin> python3 scripts/configure-github-pages.py
Or by hand: GitHub repo > Settings > Pages > Build and deployment > Source: GitHub Actions.
No secrets are needed: the Neon login and data addresses are public and live in src/lib/cloud/config.ts.
"""
from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.request

REPO = "wkk-ai/french-course"


def call(token: str, method: str, path: str, data: dict | None = None) -> int:
    request = urllib.request.Request(
        f"https://api.github.com{path}",
        method=method,
        data=json.dumps(data).encode() if data is not None else None,
        headers={"Authorization": f"Bearer {token}", "Accept": "application/vnd.github+json", "User-Agent": "french-course-pages-setup"},
    )
    try:
        with urllib.request.urlopen(request) as response:
            return response.status
    except urllib.error.HTTPError as error:
        print(f"{method} {path} -> {error.code}: {error.read().decode()[:300]}")
        return error.code


def main() -> None:
    token = os.environ.get("GH_TOKEN") or os.environ.get("GITHUB_TOKEN")
    if not token:
        sys.exit("Set GH_TOKEN first.")
    status = call(token, "POST", f"/repos/{REPO}/pages", {"build_type": "workflow"})
    if status == 409:
        status = call(token, "PUT", f"/repos/{REPO}/pages", {"build_type": "workflow"})
    if status in (201, 204):
        print("Pages source set to GitHub Actions. Push to main (or re-run the Deploy workflow) to publish.")
    elif status == 422:
        print("GitHub refused: a private repo needs a paid plan (GitHub Pro) for Pages, or make the repo public.")
    else:
        sys.exit(f"Unexpected status {status}")


if __name__ == "__main__":
    main()
