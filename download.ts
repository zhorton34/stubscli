import { ensureDir } from "jsr:@std/fs";
import { join } from "jsr:@std/path";

// Function to download a file from a URL
export async function downloadFile(url: string, filePath: string) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to download file: ${res.status} ${res.statusText}`);
  }
  const fileData = await res.text();
  await Deno.writeTextFile(filePath, fileData);
  console.log(`Downloaded: ${filePath}`);
}

// Function to download a folder's contents from GitHub API
export async function downloadFolder(folderApiUrl: string, localPath: string) {
  try {
    await ensureDir(localPath);
    const res = await fetch(folderApiUrl);
    if (!res.ok) {
      throw new Error(`API request failed: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();

    if (!Array.isArray(data)) {
      console.error('Unexpected API response:', data);
      throw new Error('API response is not an array of files');
    }

    for (const file of data) {
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
    throw error;
  }
}

// Simplified downloadStub function with better error handling
export async function downloadStub(repoOwner: string, repoName: string, stubPath: string, localPath: string) {
  const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${stubPath}`;
  try {
    await downloadFolder(apiUrl, localPath);
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes('404')) {
        console.error(`Error: The stub '${stubPath}' was not found in the repository '${repoOwner}/${repoName}'.`);
        console.error("Please check if the stub path is correct and the repository is accessible.");
      } else {
        console.error(`Error downloading stub: ${error.message}`);
      }
    } else {
      console.error(`Unknown error occurred while downloading stub`);
    }
    throw error;
  }
}

// Example usage (wrapped in an async function to allow top-level await):
if (import.meta.main) {
  (async () => {
    const folderApiUrl = "https://api.github.com/repos/zhorton34/stubs/contents/scrapers/minimal_crawlee.stub";
    const localPath = "./minimal_crawlee_stub";
    try {
      await ensureDir(localPath);
      await downloadFolder(folderApiUrl, localPath);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Failed to download stub: ${error.message}`);
      } else {
        console.error(`Unknown error occurred while downloading stub`);
      }
    }
  })();
}
