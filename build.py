import json
import shutil
from pathlib import Path
from urllib.parse import urlsplit

from jinja2 import Environment, FileSystemLoader, select_autoescape


ROOT = Path(__file__).parent
PAGES = ROOT / "pages"
CONTENT = ROOT / "content"
SITE = ROOT / "_site"
STATIC_FILES = ("styles.css", "main.js")
STATIC_DIRS = ("images",)


def load_json(path: Path):
    if not path.exists():
        return {}

    with path.open() as data_file:
        return json.load(data_file)


def page_output_path(template_path: Path) -> Path:
    relative_path = template_path.relative_to(PAGES)
    return SITE / relative_path.with_suffix("")


def page_content_path(output_path: Path) -> Path:
    relative_path = output_path.relative_to(SITE)
    return CONTENT / relative_path.with_suffix(".json")


def relative_prefix(output_path: Path) -> str:
    relative_parent = output_path.parent.relative_to(SITE)
    if str(relative_parent) == ".":
        return ""
    return "../" * len(relative_parent.parts)


def prefixed_path(prefix: str, path: str) -> str:
    parsed = urlsplit(path)
    if parsed.scheme or path.startswith("#"):
        return path
    return f"{prefix}{path}"


def main():
    if SITE.exists():
        shutil.rmtree(SITE)
    SITE.mkdir()
    (SITE / ".nojekyll").touch()

    env = Environment(
        loader=FileSystemLoader([PAGES, ROOT / "templates"]),
        autoescape=select_autoescape(["html", "xml"]),
        trim_blocks=True,
        lstrip_blocks=True,
    )

    site = load_json(CONTENT / "site.json")

    for template_path in sorted(PAGES.rglob("*.html.j2")):
        output_path = page_output_path(template_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        prefix = relative_prefix(output_path)

        template = env.get_template(str(template_path.relative_to(PAGES)))
        page = load_json(page_content_path(output_path))
        rendered = template.render(
            site=site,
            page=page,
            asset=lambda path, prefix=prefix: prefixed_path(prefix, path),
            url=lambda path, prefix=prefix: prefixed_path(prefix, path),
            **page,
        )
        output_path.write_text(rendered, encoding="utf-8")

    for filename in STATIC_FILES:
        shutil.copy2(ROOT / filename, SITE / filename)
    for dirname in STATIC_DIRS:
        shutil.copytree(ROOT / dirname, SITE / dirname)


if __name__ == "__main__":
    main()
