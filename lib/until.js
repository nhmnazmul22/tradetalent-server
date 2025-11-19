export const generateTimeStamp = (key = "createdAt", date = Date.now()) => {
  key = new Date(date).toISOString();
  return key;
};
