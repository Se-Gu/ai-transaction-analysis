export async function uploadCSV(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("http://localhost:5800/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}
