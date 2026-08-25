#!/usr/bin/env bash
# publish-preview.sh — disposable GitHub Pages preview of this branch's static export.
#
# BasePath approach: this script exports NEXT_PUBLIC_PREVIEW_BASE_PATH="/<repo>"
# and next.config.js applies basePath/assetPrefix ONLY when that env var is
# non-empty. Unset, production config is unchanged (root-relative export for
# darce.xyz). We never push to darce.github.io itself.
#
# Resume PDF: daniel_arce_resume.pdf is EXCLUDED by default. Pass
# --include-resume to keep it in the preview repo.
#
# Usage:
#   scripts/publish-preview.sh [--repo NAME] [--no-build] [--include-resume] [--teardown] [--yes]
#
# Default repo name: qm-review-01
#
# --teardown calls `gh repo delete` and needs the delete_repo scope:
#   gh auth refresh -h github.com -s delete_repo

set -euo pipefail

DEFAULT_REPO="qm-review-01"
# EXCLUDE_RESUME_PDF=1 by default. Pass --include-resume to publish the PDF.
EXCLUDE_RESUME_PDF=1
PAGES_POLL_TRIES=20
PAGES_POLL_SECONDS=15

REPO="$DEFAULT_REPO"
NO_BUILD=0
TEARDOWN=0
YES=0
STAGE=""
OWNER=""
BRANCH=""
REPO_ROOT=""
PREVIEW_URL=""

usage() {
  cat <<'EOF'
Usage: scripts/publish-preview.sh [--repo NAME] [--no-build] [--include-resume] [--teardown] [--yes]

Publish this repo's Next.js static export to a disposable public GitHub repo
with GitHub Pages enabled, or tear that preview repo down.

  --repo NAME         Preview repo name (default: qm-review-01)
  --no-build          Skip `npm run build`; require an existing out/index.html
  --include-resume    Keep daniel_arce_resume.pdf in the preview (excluded by default)
  --teardown          Delete the preview repo instead of publishing
  --yes               Skip confirmation prompts (required for non-interactive teardown/overwrite)
  -h, --help          Show this help

Teardown needs the delete_repo scope:
  gh auth refresh -h github.com -s delete_repo

Must be run from the git repository root.
EOF
}

die() {
  printf 'error: %s\n' "$*" >&2
  exit 1
}

info() {
  printf '%s\n' "$*"
}

cleanup() {
  if [[ -n "${STAGE:-}" && "$STAGE" != "/" && -d "$STAGE" ]]; then
    rm -rf "$STAGE"
  fi
}

trap cleanup EXIT

confirm() {
  local msg="$1"
  local ans
  if [[ "$YES" -eq 1 ]]; then
    return 0
  fi
  if [[ ! -t 0 ]]; then
    die "refusing unconfirmed action in non-interactive mode (pass --yes)"
  fi
  read -r -p "${msg} [y/N] " ans
  case "$ans" in
    y|Y|yes|YES) return 0 ;;
    *) die "aborted" ;;
  esac
}

lowercase() {
  printf '%s' "$1" | tr '[:upper:]' '[:lower:]'
}

parse_args() {
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --repo)
        [[ $# -ge 2 ]] || die "--repo requires a NAME"
        REPO="$2"
        shift 2
        ;;
      --no-build)
        NO_BUILD=1
        shift
        ;;
      --include-resume)
        EXCLUDE_RESUME_PDF=0
        shift
        ;;
      --teardown)
        TEARDOWN=1
        shift
        ;;
      --yes)
        YES=1
        shift
        ;;
      -h|--help)
        usage
        exit 0
        ;;
      *)
        usage >&2
        die "unknown argument: $1"
        ;;
    esac
  done
}

require_repo_root() {
  local toplevel cwd
  toplevel=$(git rev-parse --show-toplevel 2>/dev/null) || die "not inside a git repository"
  cwd=$(pwd -P)
  toplevel=$(cd "$toplevel" && pwd -P)
  [[ "$cwd" == "$toplevel" ]] || die "run from the repo root (${toplevel})"
  REPO_ROOT="$toplevel"
}

require_gh() {
  command -v gh >/dev/null 2>&1 || die "gh CLI is required but not found in PATH"
  gh auth status >/dev/null 2>&1 || die "gh is not authenticated. Run: gh auth login"
}

require_node() {
  command -v node >/dev/null 2>&1 || die "node is required but not found in PATH"
  command -v npm >/dev/null 2>&1 || die "npm is required but not found in PATH"
}

validate_repo_name() {
  local lc
  [[ -n "$REPO" ]] || die "repo name is empty"
  [[ "$REPO" != "." && "$REPO" != ".." ]] || die "invalid repo name: ${REPO}"
  printf '%s' "$REPO" | grep -Eq '^[A-Za-z0-9._-]+$' || die "invalid repo name: ${REPO}"
  lc=$(lowercase "$REPO")
  if [[ "$lc" == "darce.github.io" ]]; then
    die "refusing to publish to darce.github.io (live site). Choose a disposable preview repo name."
  fi
}

resolve_owner() {
  OWNER=$(gh api user --jq .login)
  [[ -n "$OWNER" ]] || die "could not resolve authenticated GitHub user via gh"
  if [[ "$(lowercase "${OWNER}/${REPO}")" == "darce/darce.github.io" ]]; then
    die "refusing to publish to darce/darce.github.io"
  fi
}

resolve_branch() {
  BRANCH=$(git rev-parse --abbrev-ref HEAD)
  [[ -n "$BRANCH" ]] || die "could not resolve current branch"
}

expected_url() {
  printf 'https://%s.github.io/%s/' "$OWNER" "$REPO"
}

teardown_preview() {
  confirm "Delete public repo ${OWNER}/${REPO}? This cannot be undone."
  info "deleting ${OWNER}/${REPO}"
  gh repo delete "${OWNER}/${REPO}" --yes
  info "deleted ${OWNER}/${REPO}"
}

build_export() {
  export NEXT_PUBLIC_PREVIEW_BASE_PATH="/${REPO}"
  if [[ "$NO_BUILD" -eq 1 ]]; then
    info "skipping build (--no-build); expecting out/ built with NEXT_PUBLIC_PREVIEW_BASE_PATH=${NEXT_PUBLIC_PREVIEW_BASE_PATH}"
  else
    info "building with NEXT_PUBLIC_PREVIEW_BASE_PATH=${NEXT_PUBLIC_PREVIEW_BASE_PATH}"
    npm run build
  fi
  [[ -f "${REPO_ROOT}/out/index.html" ]] || die "out/index.html is missing (run without --no-build, or build first)"
  if ! grep -q "${NEXT_PUBLIC_PREVIEW_BASE_PATH}/" "${REPO_ROOT}/out/index.html"; then
    info "notice: out/index.html may be missing basePath ${NEXT_PUBLIC_PREVIEW_BASE_PATH}; preview assets may 404 under project Pages"
  fi
}

stage_export() {
  STAGE=$(mktemp -d)
  info "staging export in temp dir"
  cp -a "${REPO_ROOT}/out/." "$STAGE/"

  # Critical: CNAME would repoint the live darce.xyz domain onto this preview repo.
  rm -f "$STAGE/CNAME"
  if [[ -e "$STAGE/CNAME" ]]; then
    die "CNAME still present in staging; aborting to protect darce.xyz"
  fi

  # Jekyll strips directories that start with _; GitHub Pages must serve _next/.
  : >"$STAGE/.nojekyll"

  cat >"$STAGE/robots.txt" <<'EOF'
User-agent: *
Disallow: /
EOF

  cat >"$STAGE/README.md" <<EOF
# Temporary preview

This is a temporary preview of branch \`${BRANCH}\` from \`darce/darce.github.io\`.

Disposable GitHub Pages deployment for review only. Not the live site.

Teardown (from the source repo root):

\`\`\`
scripts/publish-preview.sh --teardown --repo ${REPO} --yes
\`\`\`
EOF

  if [[ "$EXCLUDE_RESUME_PDF" -eq 1 ]]; then
    if [[ -e "$STAGE/daniel_arce_resume.pdf" ]]; then
      rm -f "$STAGE/daniel_arce_resume.pdf"
      info "notice: excluding daniel_arce_resume.pdf from preview (pass --include-resume to keep it)"
    else
      info "notice: resume PDF already absent from export; default remains EXCLUDE"
    fi
  else
    info "notice: including daniel_arce_resume.pdf in preview (--include-resume)"
  fi
}

publish_stage() {
  local git_name git_email create_msg sha
  git_name=$(git config user.name || true)
  git_email=$(git config user.email || true)
  [[ -n "$git_name" && -n "$git_email" ]] || die "git user.name and user.email must be set"
  sha=$(git rev-parse --short HEAD)

  confirm "Create/update public repo ${OWNER}/${REPO} and push this preview?"

  (
    cd "$STAGE"
    if ! git init -b main >/dev/null 2>&1; then
      git init >/dev/null
      git symbolic-ref HEAD refs/heads/main
    fi
    git config user.name "$git_name"
    git config user.email "$git_email"
    git add -A
    git commit -m "Preview of ${BRANCH} (${sha})"

    if ! create_msg=$(gh repo create "${OWNER}/${REPO}" --public --source=. --push 2>&1); then
      if printf '%s' "$create_msg" | grep -qiE 'already exists|Name already exists'; then
        info "repo ${OWNER}/${REPO} already exists; force-pushing main"
        if git remote get-url origin >/dev/null 2>&1; then
          git remote set-url origin "git@github.com:${OWNER}/${REPO}.git"
        else
          git remote add origin "git@github.com:${OWNER}/${REPO}.git"
        fi
        git push --force -u origin main
      else
        printf '%s\n' "$create_msg" >&2
        exit 1
      fi
    fi
  )
}

enable_pages() {
  local i err_out
  info "enabling GitHub Pages on ${OWNER}/${REPO}"
  for ((i = 1; i <= 12; i++)); do
    if err_out=$(gh api -X POST "repos/${OWNER}/${REPO}/pages" \
      -f "source[branch]=main" -f "source[path]=/" 2>&1); then
      return 0
    fi
    if printf '%s' "$err_out" | grep -qiE '409|already exists|already enabled|already a GitHub Pages site'; then
      if err_out=$(gh api -X PUT "repos/${OWNER}/${REPO}/pages" \
        -f "source[branch]=main" -f "source[path]=/" 2>&1); then
        return 0
      fi
      if gh api "repos/${OWNER}/${REPO}/pages" >/dev/null 2>&1; then
        return 0
      fi
    fi
    info "Pages API not ready yet (attempt ${i}/12); retrying in 5s"
    sleep 5
  done
  info "warning: could not enable Pages via API; expected URL is still $(expected_url)"
  return 0
}

poll_pages() {
  local i status html expected
  expected=$(expected_url)
  PREVIEW_URL="$expected"
  for ((i = 1; i <= PAGES_POLL_TRIES; i++)); do
    status=$(gh api "repos/${OWNER}/${REPO}/pages" --jq '.status // ""' 2>/dev/null) || status=""
    html=$(gh api "repos/${OWNER}/${REPO}/pages" --jq '.html_url // ""' 2>/dev/null) || html=""
    if [[ "$status" == "built" || -n "${html:-}" ]]; then
      if [[ -n "${html:-}" ]]; then
        PREVIEW_URL="$html"
      else
        PREVIEW_URL="$expected"
      fi
      return 0
    fi
    info "Pages status=${status:-unknown}; retry ${i}/${PAGES_POLL_TRIES} in ${PAGES_POLL_SECONDS}s"
    sleep "$PAGES_POLL_SECONDS"
  done
  info "timed out waiting for Pages build; expected URL: ${expected}"
}

print_banner() {
  local url="$1"
  cat <<EOF

============================================================
 Preview URL: ${url}
 Teardown:    scripts/publish-preview.sh --teardown --repo ${REPO} --yes
============================================================
EOF
}

main() {
  parse_args "$@"
  require_repo_root
  require_gh
  validate_repo_name
  resolve_owner
  resolve_branch

  if [[ "$TEARDOWN" -eq 1 ]]; then
    teardown_preview
    return 0
  fi

  require_node
  build_export
  stage_export
  publish_stage
  enable_pages
  poll_pages
  print_banner "$PREVIEW_URL"
}

main "$@"
