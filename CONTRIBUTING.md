# Contributing

Here's some information on contributing to this repo.

## Developing

First, [install Hugo][hugo-install] in the way appropriate for your platform.

To run a development environment:

```
hugo serve
```

[hugo-install]: https://gohugo.io/installation/

## Authorship

Remember to include authorship information for each file, either in `REUSE.toml`, or in the file's header, or in a
`.license` file colocated with the file.

Verify that authorship information is complete by running:

```
$ reuse lint
```

## CSS Style Guide

Use `rem` for dimensions that should shrink/grow when the user changes font size. Avoid `rem` for borders, padding and
vertical spacing.

Use `px` for dimensions that should not shrink/grow when the user changes font size. Use `px` for borders, padding and
vertical spacing.

([Read more][rem] on `rem` vs `px`.)

Always use `5px` increments for vertical `px` dimensions, including `line-height`, to create vertical rhythm.

([Read more][govuk-type-scale] on vertical rhythm.)

Use the provided `--font-size-foo` and `--line-height-foo` variables instead of manually choosing values. When setting a
`--font-size-foo`, always use the appropriate `--line-height-foo` together with it. Exceptions are allowed for unusual
elements.

[govuk-type-scale]: https://design-system.service.gov.uk/styles/type-scale/
[rem]: https://www.joshwcomeau.com/css/surprising-truth-about-pixels-and-accessibility/#strategic-unit-deployment-6
