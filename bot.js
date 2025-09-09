async function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value.trim();
  if (!message) return;

  appendToChat("You", message);
  input.value = "";

  try {
    const response = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    appendToChat("Medoc", data.response);
  } catch (error) {
    appendToChat("Error", "Failed to connect to the server.");
    console.error(error);
  }
}

function appendToChat(sender, message) {
  const chatbox = document.getElementById("chatbox");
  chatbox.innerHTML += `<strong>${sender}:</strong> ${message}<br><br>`; // ✅ FIXED with backticks
  chatbox.scrollTop = chatbox.scrollHeight;
}

// 🎤 Voice Input
function startVoice() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.start();

  recognition.onresult = function (event) {
    document.getElementById("userInput").value = event.results[0][0].transcript;
  };

  recognition.onerror = function () {
    alert("Voice input failed. Try again!");
  };
}
