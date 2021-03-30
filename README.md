# 🐺 Balto Prettier

Balto is Smart and Fast:

* Installs _your_ versions of prettier and prettier plugins
* _Only_ runs on files that have changed

Sample config (place in `.github/workflows/balto.yml`):

```yaml
name: Balto

on: [pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v1
      - uses: planningcenter/balto-prettier@v0.1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          extensions: "js,jsx"
      - uses: stefanzweifel/git-auto-commit-action@v4
        with:
          commit_message: Auto-format by balto-prettier

```

## Inputs

| Name | Description | Required | Default |
|:-:|:-:|:-:|:-:|
| `extensions` | A comma separated list of extensions to run Prettier on | no | `"js"` |
