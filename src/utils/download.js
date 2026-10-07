export async function downloadImage(url, filename) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Could not download the image");

  const blobUrl = URL.createObjectURL(await response.blob());
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(blobUrl);
}
