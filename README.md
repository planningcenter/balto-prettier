# 🐺 Balto Prettier

Balto is Smart and Fast:

* Installs _your_ versions of prettier and prettier plugins
* _Only_ runs on files that have changed

Balto is a composable action that runs `prettier --write` on changed files, and it's up to you do decide what you want to do with its results.

## Example Usage

By combining balto-prettier with [stefanzweifel/git-auto-commit-action](https://github.com/stefanzweifel/git-auto-commit-action) you could create a job that commits any changes made by prettier to the open PR, serving as a safety net for any contributors who don't have prettier setup in their editor or IDE.

Here's a sample config that does just that (place in `.github/workflows/balto.yml`):

```yaml
name: Balto

on: [pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          ref: ${{ github.head_ref }}
          fetch-depth: 0
      - uses: planningcenter/balto-prettier@v0.2
        with:
          extensions: js,jsx
      - uses: stefanzweifel/git-auto-commit-action@v4
        with:
          commit_message: Formatting by balto-prettier
```

### prettier/plugin-ruby

While you can use the [prettier plugin for Ruby](https://github.com/prettier/plugin-ruby) from node, for newer versions of the plugin (>= 3.0), you'll also need a few Ruby gems installed. The easiest way to make sure those dependencies are in place is for your project to include the [prettier gem](https://rubygems.org/gems/prettier) and keep that version synced with the version of the node package.

If your project uses this plugin and it's part of your package.json, this action will automatically detect it and install the prettier gem from your Gemfile.lock. It's also setup so that you don't need to install all of your project's dependencies (note the `bundle: none` in the example below), making it quick.

```yaml
name: Balto

on: [pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          ref: ${{ github.head_ref }}
          fetch-depth: 0
      - uses: ruby/setup-ruby@v1
        with:
          bundler: none
      - uses: planningcenter/balto-prettier@v0.2
        with:
          extensions: js,jsx,rb,rake
      - uses: stefanzweifel/git-auto-commit-action@v4
        with:
          commit_message: Formatting by balto-prettier
```

### Other Plugins

If you're using other prettier plugins that rely on other tools or languages, you'll need to set those up, with other actions or steps.

## Inputs

| Name | Description | Required | Default |
|:-:|:-:|:-:|:-:|
| `extensions` | A comma separated list of extensions to run Prettier on | no | `"js"` |
