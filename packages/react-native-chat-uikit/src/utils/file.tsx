export const imageExtRegex = /jpeg|jpg|png|webp|gif/i;
export const audioExtRegex =
  /3gp|aac|aax|act|aiff|flac|gsm|m4a|m4b|m4p|tta|wma|mp3|webm|wav/i;
export const videoExtRegex = /mov|vod|mp4|avi/i;
export const getFileType = (extOrType: string) => {
  if (extOrType.indexOf('/') > -1) {
    const type = extOrType.split('/')[0];
    if (type === 'video') return 'video';
    if (type === 'audio') return 'audio';
    if (type === 'image') return 'image';
    return 'file';
  }

  if (extOrType.match(imageExtRegex)) return 'image';
  if (extOrType.match(audioExtRegex)) return 'audio';
  if (extOrType.match(videoExtRegex)) return 'video';
  return 'file';
};
export function getFileExtension(filePath: string) {
  const idx = filePath.lastIndexOf('.');
  if (idx === -1) return '';
  return filePath.slice(idx - filePath.length).toLowerCase();
}
export function generateFileName(fileName: string, extension: string) {
  if (fileName.indexOf(extension) > -1) {
    return fileName;
  } else {
    if (extension.indexOf('.') === 0) {
      return `${fileName}${extension}`;
    } else {
      return `${fileName}.${extension}`;
    }
  }
}

export function passwordRuleCheck(): boolean {
  return false;
}
export function idRuleCheck(): boolean {
  return false;
}
