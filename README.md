NSOC webpage: https://marc-cn.github.io/nsoc-website/

## Editing the site

This is a tiny Jinja2 static site. Edit the page templates/data files, run the build script, and publish the generated `_site/` directory with GitHub Pages.

- Add routable page templates in `pages/`. For example, `pages/index.html.j2` builds to `_site/index.html`, and `pages/people.html.j2` builds to `_site/people.html`.
- Put shared layout in `templates/`, such as `templates/base.html.j2`.
- Put shared site content in `content/site.json`.
- Put page-specific content in the matching `content/` path. For example, `content/index.json` feeds `pages/index.html.j2`, and `content/people.json` feeds `pages/people.html.j2`.
- Edit visual styling in `styles.css`.
- Put new images in `images/`, then reference them from page content JSON.

## Local setup

Install the template dependency:

```sh
uv sync
```

Build the static site:

```sh
uv run python build.py
```

The generated site is written to `_site/`.

Serve the generated site locally:

```sh
uv run python -m http.server 8000 --directory _site
```

Then open http://localhost:8000 in a browser.

### Add a person

Add another object to `people` in `content/people.json`:

```json
{
  "name": "New Person",
  "role": "NYU",
  "image": "images/new-person.jpg",
  "bio": "Short bio goes here."
}
```

If there is no photo yet, use initials instead:

```json
{
  "name": "New Person",
  "role": "NYU",
  "initials": "NP",
  "bio": "Short bio goes here."
}
```

### Add an update

Add another object to `updates` in `content/index.json`:

```json
{
  "date": "June 2026",
  "title": "Update title",
  "body": "One or two sentences about the update."
}
```
