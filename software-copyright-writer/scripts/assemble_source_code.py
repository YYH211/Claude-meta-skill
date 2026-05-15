#!/usr/bin/env python3
"""按软著规则拼接源码原文。"""

from __future__ import annotations

import argparse
from pathlib import Path


CODE_SUFFIXES = {
    ".js", ".mjs", ".cjs", ".ts", ".mts", ".cts", ".jsx", ".tsx", ".py", ".java", ".kt", ".go", ".rs", ".c", ".cc",
    ".cpp", ".h", ".hpp", ".cs", ".php", ".rb", ".swift", ".m", ".mm", ".vue", ".svelte",
    ".html", ".css", ".scss", ".less", ".xml", ".sh", ".sql",
}

SKIP_DIRS = {
    ".git", ".svn", ".hg", "node_modules", "dist", "build", "out", "coverage", ".next",
    ".nuxt", "vendor", "third_party", "third-party", "__pycache__", ".idea", ".vscode",
    "tmp", "temp", "public", "assets", "docs", "doc",
}

SKIP_FILE_NAMES = {
    "package-lock.json",
    "pnpm-lock.yaml",
    "yarn.lock",
    "bun.lockb",
    "composer.lock",
    "Cargo.lock",
    "go.sum",
    "poetry.lock",
    "Pipfile.lock",
    "README.md",
    "readme.md",
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="拼接源码原文，超过 3000 行时取前后各 1500 行。")
    parser.add_argument("--path", action="append", required=True, help="源码文件或目录，可重复传入")
    parser.add_argument("--output", required=True, help="输出文件")
    parser.add_argument("--include-ext", action="append", default=[], help="额外纳入的源码后缀，可重复传入")
    parser.add_argument("--exclude-dir", action="append", default=[], help="额外排除的目录名，可重复传入")
    return parser.parse_args()


def is_code_file(path: Path, include_ext: set[str]) -> bool:
    if path.name in SKIP_FILE_NAMES:
        return False
    return path.suffix.lower() in (CODE_SUFFIXES | include_ext)


def should_skip_dir(path: Path, extra_exclude_dirs: set[str]) -> bool:
    return path.name in (SKIP_DIRS | extra_exclude_dirs)


def collect_files(raw_paths: list[str], include_ext: set[str], extra_exclude_dirs: set[str]) -> list[Path]:
    files: list[Path] = []
    for raw in raw_paths:
        path = Path(raw).expanduser().resolve()
        if not path.exists():
            continue
        if path.is_file():
            if is_code_file(path, include_ext):
                files.append(path)
            continue
        for child in sorted(path.rglob("*")):
            if any(should_skip_dir(parent, extra_exclude_dirs) for parent in child.parents):
                continue
            if child.is_file() and is_code_file(child, include_ext):
                files.append(child)
    deduped: list[Path] = []
    seen: set[Path] = set()
    for file_path in files:
        if file_path not in seen:
            deduped.append(file_path)
            seen.add(file_path)
    return deduped


def read_lines(files: list[Path]) -> list[str]:
    lines: list[str] = []
    for file_path in files:
        lines.append(f"===== 文件名: {file_path} =====")
        content = file_path.read_text(encoding="utf-8", errors="ignore")
        lines.extend(content.splitlines())
        lines.append("")
    return lines


def select_submission_lines(lines: list[str]) -> list[str]:
    if len(lines) <= 3000:
        return lines
    return lines[:1500] + lines[-1500:]


def main() -> None:
    args = parse_args()
    include_ext = {ext if ext.startswith(".") else f".{ext}" for ext in args.include_ext}
    extra_exclude_dirs = set(args.exclude_dir)
    files = collect_files(args.path, include_ext, extra_exclude_dirs)
    if not files:
        raise SystemExit("未找到可用的源码文件。")
    lines = read_lines(files)
    selected = select_submission_lines(lines)
    output_path = Path(args.output).expanduser().resolve()
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text("\n".join(selected).rstrip() + "\n", encoding="utf-8")
    print(f"已输出源码原文：{output_path}")
    print(f"汇总文件数：{len(files)}")
    print(f"输出行数：{len(selected)}")


if __name__ == "__main__":
    main()
