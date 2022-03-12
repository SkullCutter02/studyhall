export const isFileImage = (mimetype: string) => {
  const allowedMimetypes = ["image/gif", "image/jpeg", "image/png", "image/svg+xml", "image/tiff", "image/webp"];
  return allowedMimetypes.includes(mimetype);
};
