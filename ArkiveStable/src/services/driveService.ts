export type DriveFile = {
  id: string;
  name: string;
  mimeType?: string;
};

/**
 * Google Drive operations (stub).
 * Replace with real Drive SDK calls (upload/list/download).
 */
export async function listFiles(): Promise<DriveFile[]> {
  return Promise.resolve([
    {id: 'file-1', name: 'Encrypted Report.pdf', mimeType: 'application/pdf'},
    {id: 'file-2', name: 'Project Notes.txt', mimeType: 'text/plain'},
  ]);
}

export async function uploadFile(_file: unknown): Promise<DriveFile> {
  return Promise.resolve({id: 'uploaded-1', name: 'Uploaded File'});
}

export async function downloadFile(_fileId: string): Promise<unknown> {
  // Should return encrypted bytes / base64 / blob, depending on your setup.
  return Promise.resolve({encrypted: true});
}
