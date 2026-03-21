#!/usr/bin/env bash
# NCC Hook Profile helper — sourced by all hook scripts
# NCC_HOOK_PROFILE: minimal | standard (default) | strict
#
# minimal  — security-guard only
# standard — security-guard + validate + advisory + repo-profiler + compact-recovery
# strict   — all hooks (adds deprecation-guard, comment-checker, todo-enforcer)

NCC_HOOK_PROFILE="${NCC_HOOK_PROFILE:-standard}"

ncc_profile_allows() {
  local hook_name="$1"
  case "$NCC_HOOK_PROFILE" in
    minimal)
      [[ "$hook_name" == "security-guard" ]] && return 0
      return 1
      ;;
    standard)
      case "$hook_name" in
        security-guard|validate-post-write|advisory-post-write|repo-profiler|compact-recovery)
          return 0 ;;
        *)
          return 1 ;;
      esac
      ;;
    strict)
      return 0
      ;;
    *)
      # Unknown profile — fall back to standard
      case "$hook_name" in
        security-guard|validate-post-write|advisory-post-write|repo-profiler|compact-recovery)
          return 0 ;;
        *)
          return 1 ;;
      esac
      ;;
  esac
}
