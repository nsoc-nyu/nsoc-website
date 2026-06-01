import json
from pathlib import Path

from jinja2 import Environment, FileSystemLoader, select_autoescape


ROOT = Path(__file__).parent


def main():
    with (ROOT / "content.json").open() as data_file:
        content = json.load(data_file)

    env = Environment(
        loader=FileSystemLoader(ROOT / "templates"),
        autoescape=select_autoescape(["html", "xml"]),
        trim_blocks=True,
        lstrip_blocks=True,
    )

    template = env.get_template("index.html.j2")
    rendered = template.render(**content)
    (ROOT / "index.html").write_text(rendered, encoding="utf-8")


if __name__ == "__main__":
    main()
