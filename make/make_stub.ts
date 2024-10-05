import { ensureDir } from "jsr:@std/fs";
import { join } from "jsr:@std/path";
import { exists } from "jsr:@std/fs/exists";
import { Confirm } from "https://deno.land/x/cliffy@v0.25.7/prompt/mod.ts";
import { downloadStub } from "../download.ts";

async function readGeneratorsConfig() {
  try {
    const cwd = Deno.cwd();
    const configPath = join(cwd, ".stubscli.json");
    const content = await Deno.readTextFile(configPath);
    return JSON.parse(content).generators;
  } catch (error) {
    console.error("Error reading .stubscli.json:", error);
    return [];
  }
}

export async function makeStub(args: string[]) {
  const [type, name, output = '.'] = args;
  const generators = await readGeneratorsConfig();
  const generator = generators.find((g: any) => g.type === type);

  if (!generator) {
    console.error(`No generator found for type: ${type}`);
    return;
  }

  const localPath = join(output, ...generator.path, name);

  // Check if the localPath already exists
  if (await exists(localPath)) {
    const shouldOverwrite = await Confirm.prompt({
      message: `The directory '${localPath}' already exists. Do you want to overwrite it?`,
      default: false,
    });

    if (!shouldOverwrite) {
      console.log("Operation cancelled. No files were changed.");
      return;
    }
  }

  await ensureDir(localPath);

  // Parse the GitHub API URL
  const url = new URL(generator.stub);
  const pathParts = url.pathname.split('/').filter(part => part !== '');
  const repoOwner = pathParts[1];
  const repoName = pathParts[2];
  const stubPath = pathParts.slice(4).join('/');

  try {
    await downloadStub(repoOwner, repoName, stubPath, localPath);
    console.log(`${type} '${name}' has been successfully created at '${localPath}'`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Failed to create ${type} '${name}': ${error.message}`);
    } else {
      console.error(`Failed to create ${type} '${name}': Unknown error`);
    }
  }
}