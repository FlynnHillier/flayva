export const echo = async (message: string) => {
  const response = await fetch(`http://localhost:3000/api/test/echo`, {
    method: "POST",
    body: JSON.stringify({ message }),
    headers: {
      "content-type": "application/json",
    },
  });
  return await response.text();
};

export const hello = async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const response = await fetch(`${import.meta.env.VITE_SERVER_ORIGIN}/api/test/hello`);
  return await response.text();
};
