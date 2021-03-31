# 🐺 Balto Prettier

Balto is Smart and Fast:

* Installs _your_ versions of prettier and prettier plugins
* _Only_ runs on files that have changed

Sample config (place in `.github/workflows/balto.yml`) to format changed files in a pull request and commit the fixes:

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
      - uses: planningcenter/balto-prettier@v0.1
        with:
          extensions: js,jsx
      - uses: stefanzweifel/git-auto-commit-action@v4
        with:
          commit_message: Formatting by balto-prettier
```

If you're using prettier plugins that rely on other tools or languages, you'll need to set those up, as well. For example, using the Ruby plugin to do the same sort of formatting commit as above might look like this:

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
          bundler-cache: true
      - uses: planningcenter/balto-prettier@v0.1
        with:
          extensions: js,jsx,rb,rake
      - uses: stefanzweifel/git-auto-commit-action@v4
        with:
          commit_message: Formatting by balto-prettier
```


## Inputs

| Name | Description | Required | Default |
|:-:|:-:|:-:|:-:|
| `extensions` | A comma separated list of extensions to run Prettier on | no | `"js"` |
