# 🐺 Balto Prettier

Balto is Smart and Fast:

* Installs _your_ versions of prettier and prettier plugins
* _Only_ runs on files that have changed

Balto Prettier comprises a few different actions: 

* The core functionality is found at `planningcenter/balto-prettier`, which runs `prettier --write` on files that have changed. On its own this doesn't result in any action, but it can be combined with other actions for a variety of uses.
* For a "batteries included" setup, `planningcenter/balto-prettier/autofix` will run the core action, commit anything that changed as a result, and add that commit to `.git-blame-ignore-revs`.
* There's also a `planningcenter/balto-prettier/append-to-file` action that is really here for internal use. If you're brave, you can use it on its own, but there are no guarantees that it won't change without notice.

## Example Usage

Assuming most folks will opt for the autofix functionality, here's how you might set that up.

Sample config (place in `.github/workflows/balto.yml`):

```yaml
name: Balto

on: [pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      - uses: planningcenter/balto-prettier/autofix@v1
        with:
          extensions: js,jsx
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
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      - uses: ruby/setup-ruby@v1
      - uses: planningcenter/balto-prettier/autofix@v1
        with:
          extensions: js,jsx,rb,rake
```

### Other Plugins

If you're using other prettier plugins that rely on other tools or languages, you'll need to set those up, with other actions or steps.

## Inputs

| Name | Description | Required | Default |
|:-:|:-:|:-:|:-:|
| `extensions` | A comma separated list of extensions to run Prettier on | no | `"js"` |
