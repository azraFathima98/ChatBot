const chatList = [];
let user = "";
var md = window.markdownit();

document.getElementById("selectUser").addEventListener("change", function () {
  user = this.value;
});

function sendMessage() {
  let txtUserInput = document.getElementById("txtUserInput").value.trim();
  if (txtUserInput !== "") {
    let chatBubble = "";

    // Add user's message
    if (user === "Me") {
      chatBubble = `<h3 class="text-end bg-success text-white">${txtUserInput}</h3>`; 
    } else {
      chatBubble = `<h3 class="text-start bg-secondary text-white">${txtUserInput}</h3>`;
    }
    chatList.push(chatBubble);
    loadChatBox();

    // Clear input field after sending message
    document.getElementById("txtUserInput").value = "";

    // Fetch chatbot response
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "contents": [
        {
          "parts": [
            {
              "text": txtUserInput
            }
          ]
        }
      ]
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key="api_key", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        const botReply = result.candidates[0].content.parts[0].text;
        const botMessage = `<h3 class="text-start bg-secondary text-white">${md.render(botReply)}</h3>`;
        chatList.push(botMessage);
        loadChatBox();
      })
      .catch((error) => console.error(error));
  }
}

function loadChatBox() {
  const chatBox = document.getElementById("chatBox");
  chatBox.innerHTML = ''; // Clear the chatBox before reloading
  chatList.forEach(message => {
    const messageElement = document.createElement('div');
    messageElement.innerHTML = message;
    chatBox.appendChild(messageElement);
  });
}
