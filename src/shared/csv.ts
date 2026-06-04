export const toCSV = (headers: string[], rows: (string | number | null | undefined)[][]): string => {
  const headerLine = headers.map(escapeCSV).join(",");
  const dataLines = rows.map((row) =>
    row.map((cell) => escapeCSV(String(cell ?? ""))).join(","),
  );
  return [headerLine, ...dataLines].join("\r\n");
};

const escapeCSV = (value: string): string => {
  if (value.includes(",") || value.includes('"') || value.includes("\n") || value.includes("\r")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};
