export const formatDate = (dateStr) => {
    if(!dateStr) return ''
  const date = new Date(dateStr);

  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  return date.toLocaleString("en-US", options).replace(",", "");
};
