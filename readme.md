# Refactor CLI

You can use this CLI to connect to OpenAI's API to programmatically invoke a command across a selection of files.

## Set-Up

Create an `.env` file in the project root with `OPENAI_API=[Your Secret API key]`

## Invocation

Here are some examples of invoking the CLI

```bash
node index.js --command="add documentation" --input=./**/*.js --extension=with-comments.js
node index.js --command="convert to typescript" --input=./**/*.js --extension=ts
```


