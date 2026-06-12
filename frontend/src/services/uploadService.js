export const uploadFile = async ({ endpoint, file, fieldName }) => {
  const formData = new FormData();
  formData.append(fieldName, file);

  const response = await fetch(`https://api-inovatec-232386318067.southamerica-east1.run.app/${endpoint}`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Erro ao subir arquivo");
  }

  return await response.json();
};