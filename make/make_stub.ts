import { downloadStub } from "../download.ts";
import { ensureDir, copy } from "jsr:@std/fs";
import { join } from "jsr:@std/path";

export async function makeStub(args: string[]) {
  if (args.length < 2) {
    console.error("Usage: make:stub <stub-name> <local-path>");
    Deno.exit(1);
  }

  const [stubName, localPath] = args;
  const repoOwner = "zhorton34";
  const repoName = "stubs";

  // Read the generators configuration from deno.json
  const denoConfig = JSON.parse(await Deno.readTextFile("./deno.json"));
  const generator = denoConfig.generators.find((g: any) => g.name === `make:${stubName}`);

  if (!generator) {
    console.error(`No generator found for stub: ${stubName}`);
    Deno.exit(1);
  }

  try {
    if (generator.isFolder) {
      // For folder scaffolding
      const sourcePath = join(Deno.cwd(), generator.stub);
      await ensureDir(localPath);
      await copy(sourcePath, localPath, { overwrite: true });
      console.log(`Stub folder '${stubName}' has been successfully created at '${localPath}'`);
    } else {
      // For single file scaffolding
      const stubPath = generator.stub.startsWith("http") ? generator.stub : `${generator.type}/${stubName}.stub`;
      await downloadStub(repoOwner, repoName, stubPath, localPath);
      console.log(`Stub '${stubName}' has been successfully created at '${localPath}'`);
    }
  } catch (error) {
    console.error(`Failed to create stub: ${error}`);
  }
}