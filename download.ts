import { ensureDir } from "jsr:@std/fs";
import { join } from "jsr:@std/path";

// Function to download a file from a URL
export async function downloadFile(url: string, filePath: string) {
  const res = await fetch(url);
  const fileData = await res.text();
  await Deno.writeTextFile(filePath, fileData);
  console.log(`Downloaded: ${filePath}`);
}

// Function to download a folder's contents from GitHub API
export async function downloadFolder(folderApiUrl: string, localPath: string) {
  try {
    await ensureDir(localPath);
    const res = await fetch(folderApiUrl);
    const files = await res.json();

    for (const file of files) {
      const filePath = join(localPath, file.name);
      if (file.type === "file") {
        await downloadFile(file.download_url, filePath);
      } else if (file.type === "dir") {
        await downloadFolder(file.url, filePath);
      }
    }
    console.log(`Downloaded folder: ${localPath}`);
  } catch (error) {
    console.error(`Failed to download folder: ${error}`);
  }
}

// Function to download a stub from a GitHub repository
export async function downloadStub(repoOwner: string, repoName: string, stubPath: string, localPath: string) {
  const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${stubPath}`;
  await downloadFolder(apiUrl, localPath);
}

// Example usage:
const folderApiUrl = "https://api.github.com/repos/zhorton34/stubs/contents/scrapers/minimal_crawlee.stub";
const localPath = "./minimal_crawlee_stub";
await ensureDir(localPath); // Ensure the local folder exists
await downloadFolder(folderApiUrl, localPath);
