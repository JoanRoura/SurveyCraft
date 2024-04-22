export const currentDate = (): string => {
  // Obtener la fecha actual
  const date = new Date();

  // Obtener día, mes y año
  const day = String(date.getDate()).padStart(2, '0'); // Añade un cero delante si es necesario
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses comienzan desde 0
  const year = date.getFullYear();

  // Formatear la fecha como día/mes/año
  const formatDate = `${day}/${month}/${year}`;

  return formatDate;
}
