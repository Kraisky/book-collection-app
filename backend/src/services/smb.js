import Client from "smbhclient";
import path from "path";

let smbClient = null;

export async function connectToSMB(sharePath, username, password) {
  try {
    const parts = sharePath.split("\\").filter(p => p);
    const host = parts[0];
    const share = parts[1];

    smbClient = new Client({
      address: host,
      username: username,
      password: password,
      share: share
    });

    await smbClient.connect();
    console.log("Connected to SMB share");
    return true;
  } catch (error) {
    console.error("SMB connection error:", error);
    return false;
  }
}

export async function scanBooksFolder(folderPath = "/") {
  if (!smbClient) {
    throw new Error("SMB client not connected");
  }

  const bookFiles = [];
  const supportedFormats = [".pdf", ".epub", ".mobi", ".azw", ".azw3"];

  try {
    const files = await smbClient.readdir(folderPath);
    
    for (const file of files) {
      const filePath = path.join(folderPath, file.filename);
      
      if (file.isDirectory) {
        const subFiles = await scanBooksFolder(filePath);
        bookFiles.push(...subFiles);
      } else {
        const ext = path.extname(file.filename).toLowerCase();
        if (supportedFormats.includes(ext)) {
          bookFiles.push({
            filename: file.filename,
            path: filePath,
            size: file.size
          });
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning folder ${folderPath}:`, error);
  }

  return bookFiles;
}

export async function disconnectSMB() {
  if (smbClient) {
    try {
      await smbClient.disconnect();
      smbClient = null;
      console.log("Disconnected from SMB share");
    } catch (error) {
      console.error("Error disconnecting:", error);
    }
  }
}

export function getSMBClient() {
  return smbClient;
}
