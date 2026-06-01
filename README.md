NSOC webpage: https://marc-cn.github.io/nsoc-website/

## Editing the site

This is a tiny Jinja2 static site. Edit the template/data files, run the build script, and publish the generated `index.html` with GitHub Pages.

- Edit page structure and fixed sections, including stats, in `templates/index.html.j2`.
- Edit About, Join Us, updates, and team member cards in `content.json`.
- Edit visual styling in `styles.css`.
- Put new images in `images/`, then reference them from `content.json`.

## Local setup

Install the template dependency:

```sh
python3 -m venv .venv
. .venv/bin/activate
python -m pip install -r requirements.txt
```

Build the static page:

```sh
python build.py
```

View the site locally:

```sh
python -m http.server 8000
```

Then open http://localhost:8000 in a browser.

### Add a person

Add another object to `people` in `content.json`:

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

Add another object to `updates` in `content.json`:

```json
{
  "date": "June 2026",
  "title": "Update title",
  "body": "One or two sentences about the update."
}
```
