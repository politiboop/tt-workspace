#!/usr/bin/env bash
# run-all.sh — start all four politiboop dev servers in the background.
#
# Usage:
#   ./run-all.sh                       # start all four
#   ./run-all.sh --install             # npm install in each first, then start
#   ./run-all.sh --only tracker        # start only the tracker
#   ./run-all.sh --only tracker,civics
#   ./run-all.sh --open                # also open browser tabs
#   ./run-all.sh --stop                # stop servers launched by this script
#
# Ports:
#   3000 - controversial-trump/website  (tracker, Docusaurus)
#   4321 - controversial-trump-research (research, Astro)
#   4322 - the-civics-desk              (Civics Desk, Astro)
#   4323 - stand-against-trump          (personal essays, Astro)
#
# Servers run backgrounded; logs go to .run-all-logs/<site>.log.
# Tail with:  tail -f .run-all-logs/tracker.log
# bash 3.2+ compatible (macOS default).

set -euo pipefail

root="$(cd "$(dirname "$0")" && pwd)"
log_dir="$root/.run-all-logs"
pid_dir="$root/.run-all-pids"
mkdir -p "$log_dir" "$pid_dir"

KEYS=(tracker research civics personal)
NAMES=(
  "Tracker (controversial-trump)"
  "Research site (controversial-trump-research)"
  "The Civics Desk (the-civics-desk)"
  "Stand Against Trump (stand-against-trump)"
)
RELPATHS=(
  "controversial-trump/website"
  "controversial-trump-research"
  "the-civics-desk"
  "stand-against-trump"
)
PORTS=(3000 4321 4322 4323)
CMDS=(
  "npm start -- --port 3000 --no-open"
  "npm run dev -- --port 4321"
  "npm run dev -- --port 4322"
  "npm run dev -- --port 4323"
)

key_index() {
  local target="$1" i
  for i in "${!KEYS[@]}"; do
    [[ "${KEYS[$i]}" == "$target" ]] && { echo "$i"; return 0; }
  done
  return 1
}

usage() {
  cat <<'EOF'
Usage:
  ./run-all.sh                       # start all four
  ./run-all.sh --install             # npm install in each first, then start
  ./run-all.sh --only tracker        # start only the tracker
  ./run-all.sh --only tracker,civics
  ./run-all.sh --open                # also open browser tabs
  ./run-all.sh --stop                # stop servers launched by this script

Sites:  tracker, research, civics, personal
Ports:  3000 (tracker), 4321 (research), 4322 (civics), 4323 (personal)
Logs:   .run-all-logs/<site>.log
EOF
}

selected=()
do_install=0
do_open=0
do_stop=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --only)
      shift
      [[ $# -gt 0 ]] || { echo "--only needs a value" >&2; exit 1; }
      IFS=',' read -r -a only_keys <<< "$1"
      for k in "${only_keys[@]}"; do
        if key_index "$k" >/dev/null; then
          selected+=("$k")
        else
          echo "Unknown site: $k (valid: ${KEYS[*]})" >&2
          exit 1
        fi
      done
      shift
      ;;
    --install) do_install=1; shift ;;
    --open)    do_open=1;    shift ;;
    --stop)    do_stop=1;    shift ;;
    -h|--help) usage; exit 0 ;;
    *)
      echo "Unknown arg: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ ${#selected[@]} -eq 0 ]]; then
  selected=("${KEYS[@]}")
fi

if [[ $do_stop -eq 1 ]]; then
  any=0
  for k in "${KEYS[@]}"; do
    i=$(key_index "$k")
    pidfile="$pid_dir/$k.pid"
    port="${PORTS[$i]}"
    if [[ -f "$pidfile" ]]; then
      pid=$(cat "$pidfile")
      if [[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null; then
        echo "Stopping ${NAMES[$i]} (PID $pid)"
        pkill -TERM -P "$pid" 2>/dev/null || true
        kill -TERM "$pid" 2>/dev/null || true
        any=1
      fi
      rm -f "$pidfile"
    fi
    port_pid=$(lsof -ti tcp:"$port" 2>/dev/null || true)
    if [[ -n "$port_pid" ]]; then
      echo "Cleaning leftover process on port $port (PIDs: $port_pid)"
      kill -TERM $port_pid 2>/dev/null || true
      any=1
    fi
  done
  if [[ $any -eq 0 ]]; then
    echo "No politiboop dev servers found."
  fi
  exit 0
fi

for k in "${selected[@]}"; do
  i=$(key_index "$k")
  pkg="$root/${RELPATHS[$i]}/package.json"
  if [[ ! -f "$pkg" ]]; then
    echo "Missing package.json at: $pkg" >&2
    exit 1
  fi
done

if [[ $do_install -eq 1 ]]; then
  for k in "${selected[@]}"; do
    i=$(key_index "$k")
    echo
    echo "==> npm install in ${NAMES[$i]}"
    (cd "$root/${RELPATHS[$i]}" && npm install)
  done
fi

for k in "${selected[@]}"; do
  i=$(key_index "$k")
  path="$root/${RELPATHS[$i]}"
  cmd="${CMDS[$i]}"
  log="$log_dir/$k.log"
  pidfile="$pid_dir/$k.pid"
  port="${PORTS[$i]}"
  url="http://localhost:$port"

  existing=$(lsof -ti tcp:"$port" 2>/dev/null || true)
  if [[ -n "$existing" ]]; then
    echo "Skipping ${NAMES[$i]} — port $port already in use (PID $existing). Run --stop first."
    continue
  fi

  echo
  echo "Starting ${NAMES[$i]}"
  echo "  cwd:  $path"
  echo "  cmd:  $cmd"
  echo "  url:  $url"
  echo "  log:  $log"

  : > "$log"

  (
    cd "$path"
    exec bash -c "$cmd" >> "$log" 2>&1
  ) &
  echo $! > "$pidfile"
done

if [[ $do_open -eq 1 ]]; then
  sleep 6
  for k in "${selected[@]}"; do
    i=$(key_index "$k")
    open "http://localhost:${PORTS[$i]}" 2>/dev/null || true
  done
fi

echo
echo "Selected dev servers launched. URLs:"
for k in "${selected[@]}"; do
  i=$(key_index "$k")
  printf "  http://localhost:%-5s  %s\n" "${PORTS[$i]}" "${NAMES[$i]}"
done
echo
echo "Logs: tail -f $log_dir/<site>.log"
echo "Stop: $0 --stop"
