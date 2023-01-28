import { program } from 'commander';
import glob from 'glob-promise';
import async, { findSeries } from 'async';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import makeRequest from './makeRequest.js'

import * as dotenv from 'dotenv'
dotenv.config()

program
  .requiredOption('-c, --command <string>', 'the command you want to apply over your files')
  .requiredOption('-i, --input <string>', 'the glob pattern of files you want to analyze')
  .option('-e, --extension <string>', 'the extension suffix')
  .action(async (options, optionsInstance) => {
    const { input, command, extension } = options;

    const files = await glob(input);
    console.log(`File Count: ${files.length}`)
    console.log(`We will observe these files: ${files}`)
    const newFiles = [];
    const errors = [];

    async.eachLimit(files, 5, async (file) => {
      const fileContent = fs.readFileSync(file).toString();
      if (fileContent.length > 4000) {
        console.log(`Skipping ${file} due to size constraints`);
        return Promise.resolve();
      }

      // console.log(fileContent, command)
      try {
        const result = await makeRequest(process.env.OPENAI_API, fileContent, command);
        const dir = path.dirname(file);
        const ext = path.extname(file)
        const withoutExt = path.basename(file, ext)
        const newFilename = `${dir}/${withoutExt}.${extension}`;
        fs.writeFileSync(newFilename, result)
        newFiles.push(newFilename);
      } catch (e) {
        errors.push(`Could not parse: ${file}. Reason: ${e}.`);
        return Promise.resolve();
      }
    }, (err, results) => {
      console.log('DONE')
      console.log('ERRORS')
      console.log(JSON.stringify(errors, null, 2))
      console.log('NEW FILES', newFiles);
    });
  });

program.parse();