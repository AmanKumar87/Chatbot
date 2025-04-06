// Toggle Chatbot
const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeChatbot = document.querySelector(".close-chatbot");
const chatbotContainer = document.querySelector(".chatbot-container");
const tryNowButton = document.getElementById("try-now-button");

if (chatbotToggler && closeChatbot && chatbotContainer) {
  chatbotToggler.addEventListener("click", () => {
    chatbotContainer.classList.toggle("active");
  });

  closeChatbot.addEventListener("click", () => {
    chatbotContainer.classList.remove("active");
  });
}

// Try Now Button Click Handler
if (tryNowButton) {
  tryNowButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (chatbotContainer) {
      chatbotContainer.classList.add("active");
    }
  });
}

// Full Chatbot Button Click Handler
const fullChatbotButton = document.getElementById("full-chatbot-button");
if (fullChatbotButton) {
  fullChatbotButton.addEventListener("click", (e) => {
    // No need to prevent default as we want the link to navigate
    console.log("Navigating to full chatbot experience");
  });
}

// Chatbot Interaction
const inputField = document.querySelector(".chatbot-input");
const sendButton = document.querySelector("#send-button");
const chatMessages = document.querySelector(".chatbot-messages");

// Check if we're on the full chatbot page
const isFullChatbotPage = document.querySelector(".chatbot-fullpage") !== null;

// Initialize chat if elements exist
if (inputField && sendButton && chatMessages) {
  // If we're on the full chatbot page, we might want to focus the input field
  if (isFullChatbotPage) {
    inputField.focus();
  }

  // Add event listeners for sending messages
  sendButton.addEventListener("click", sendMessage);

  // Allow pressing Enter to send message
  inputField.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  });
}

function addUserMessage(message) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("user-message");
  messageDiv.innerHTML = `<p>${message}</p>`;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add Markdown parser function
function parseMarkdown(text) {
  // Replace bold text
  text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Replace italic text
  text = text.replace(/\*(.*?)\*/g, "<em>$1</em>");

  // Replace headers
  text = text.replace(/#{1,6}\s+(.*?)(?:\n|$)/g, "<h3>$1</h3>");

  // Replace lists
  text = text.replace(/^\s*\*\s+(.*?)$/gm, "<li>$1</li>");
  text = text.replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>");

  // Replace paragraphs
  text = text.replace(/\n\n/g, "</p><p>");

  // Wrap in paragraph tags if not already wrapped
  if (!text.startsWith("<p>")) {
    text = "<p>" + text;
  }
  if (!text.endsWith("</p>")) {
    text = text + "</p>";
  }

  return text;
}

// Add text-to-speech functionality
let speechSynthesis = window.speechSynthesis;
let speaking = false;
let ttsEnabled = true; // Default to enabled

function speakText(text) {
  // Only speak if TTS is enabled
  if (!ttsEnabled) return;

  // Stop any ongoing speech
  if (speaking) {
    speechSynthesis.cancel();
  }

  // Create a new speech utterance
  const utterance = new SpeechSynthesisUtterance(text);

  // Set properties
  utterance.rate = 1.0; // Speed
  utterance.pitch = 1.0; // Pitch
  utterance.volume = 1.0; // Volume

  // Get available voices and set to a female voice if available
  const voices = speechSynthesis.getVoices();
  const femaleVoice = voices.find(
    (voice) => voice.name.includes("female") || voice.name.includes("Female")
  );
  if (femaleVoice) {
    utterance.voice = femaleVoice;
  }

  // Set speaking flag
  speaking = true;

  // Handle end of speech
  utterance.onend = () => {
    speaking = false;
  };

  // Speak the text
  speechSynthesis.speak(utterance);
}

// Toggle TTS button
const ttsButton = document.getElementById("tts-button");
if (ttsButton) {
  // Set initial state
  ttsButton.classList.add("active");

  ttsButton.addEventListener("click", () => {
    ttsEnabled = !ttsEnabled;

    if (ttsEnabled) {
      ttsButton.classList.add("active");
      ttsButton.title = "Disable Text-to-Speech";
    } else {
      ttsButton.classList.remove("active");
      ttsButton.title = "Enable Text-to-Speech";

      // Stop any ongoing speech
      if (speaking) {
        speechSynthesis.cancel();
      }
    }
  });
}

function addBotMessage(message) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("bot-message");

  // Parse Markdown and set as HTML
  messageDiv.innerHTML = parseMarkdown(message);

  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Speak the message
  speakText(message);
}

function showTypingIndicator() {
  const typingDiv = document.createElement("div");
  typingDiv.classList.add("typing-indicator");
  typingDiv.innerHTML = `
    <div class="typing-content">
      <span class="typing-text">GreenBuddy is typing</span>
      <div class="typing-dots">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    </div>
  `;
  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
  const typingDiv = document.querySelector(".typing-indicator");
  if (typingDiv) {
    typingDiv.remove();
  }
}

function sendMessage() {
  const messageInput = document.querySelector(".chatbot-input");
  const message = messageInput.value.trim();

  if (message === "") return;

  // Add user message to chat
  addUserMessage(message);
  messageInput.value = "";

  // Show typing indicator
  showTypingIndicator();

  // Send message to backend
  fetch("http://localhost:5000/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: message }),
  })
    .then((response) => response.json())
    .then((data) => {
      // Hide typing indicator
      hideTypingIndicator();

      if (data.status === "success") {
        // Add bot response to chat
        addBotMessage(data.response);
      } else if (data.status === "rate_limit") {
        // Handle rate limit error
        addBotMessage(data.response);
        // Add a note about retrying
        setTimeout(() => {
          addBotMessage("You can try your question again now.");
        }, 2000);
      } else {
        // Handle other errors
        addBotMessage("Sorry, I encountered an error. Please try again.");
        console.error("Error:", data.error);
      }
    })
    .catch((error) => {
      // Hide typing indicator
      hideTypingIndicator();

      // Add error message to chat
      addBotMessage("Sorry, I encountered an error. Please try again.");
      console.error("Error:", error);
    });
}

// Dark mode toggle
const darkModeToggle = document.getElementById("dark-mode-toggle");
if (darkModeToggle) {
  darkModeToggle.addEventListener("change", () => {
    document.body.classList.toggle("dark-mode");
  });
}
