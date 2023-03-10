import fetch from 'node-fetch';

const makeRequest = async (secret, input, instruction) => {
  const response = await fetch("https://api.openai.com/v1/edits", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secret}`,
    },
    body: JSON.stringify({
      model: "code-davinci-edit-001",
      input,
      instruction,
    }),
  });

  const data = await response.json();
  console.log('From OpenAI: ', data)
  if (data.choices && data?.choices[0]?.text) {
    return data.choices[0].text;
  }
  throw new Error(data.error.message);
};

export default makeRequest;