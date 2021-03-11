const ws = new WebSocket("ws://localhost:3000");



ws.onmessage = (msg) => {
  let content = JSON.parse(msg.data)
  if (content.message) {
    const html = `<p><b>${content.author}:</b> ${content.message} </p>`;
    document.getElementById("messages").innerHTML += html;
  }
  
};


const postForm = async (url, data)=> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
}
const handleSubmit = async (evt) => {
  evt.preventDefault();
  const message = document.getElementById("message");
  const author = document.getElementById("author");
  const ts = Date.now();
  const response = await postForm("/chat/api/messages", {
    author: author.value,
    message: message.value,
    ts,
  });
  let htmlresponse= response.error?`<p>${response.error}</p>`:"<p>Mensaje enviado :D</p>"
  
    document.getElementById("responseMessage").innerHTML = htmlresponse;
  
  message.value = "";

};

const form = document.getElementById("form");
form.addEventListener("submit", handleSubmit);
