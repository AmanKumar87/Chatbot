# GreenBuddy - Your Gardening Expert 🌱

GreenBuddy is a specialized chatbot designed to provide expert gardening advice and information. It uses the Gemini API to deliver detailed, formatted responses to all your gardening-related questions.

## Features

- **Gardening-Focused Responses**: Specialized in providing information about plants, gardening techniques, and horticulture
- **Formatted Text**: Responses are formatted with proper headings, lists, and emphasis for better readability
- **Text-to-Speech**: Built-in text-to-speech functionality that reads responses aloud
- **Modern UI**: Clean, responsive interface with dark mode support
- **Real-time Interaction**: Instant responses to your gardening queries

## Screenshots

![GreenBuddy Chatbot](screenshots/chatbot.png)

## Installation

1. Clone this repository:

   ```
   git clone https://github.com/yourusername/greenbuddy.git
   cd greenbuddy
   ```

2. Install the required dependencies:

   ```
   pip install -r requirements.txt
   ```

3. Create a `.env` file in the root directory with your Gemini API key:

   ```
   GEMINI_API_KEY=your_api_key_here
   ```

4. Start the Flask server:

   ```
   python app.py
   ```

5. Open `chatbot.html` in your web browser to start using GreenBuddy.

## Usage

1. **Ask Gardening Questions**: Type your gardening-related questions in the input field and press Enter or click the send button.
2. **Toggle Text-to-Speech**: Click the speaker button to enable/disable text-to-speech for bot responses.
3. **Dark Mode**: Toggle dark mode using the switch in the top-right corner.

## Example Questions

- How to grow roses in my garden?
- What are the best plants for beginners?
- How often should I water my indoor plants?
- What's the best soil for growing tomatoes?
- How to start a vegetable garden?

## Technical Details

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Python Flask
- **API**: Google Gemini API
- **Text-to-Speech**: Web Speech API

## Requirements

- Python 3.7+
- Flask
- Google Generative AI Python library
- Web browser with JavaScript enabled

## Troubleshooting

- **Server Not Starting**: Make sure your Gemini API key is correctly set in the `.env` file.
- **No Responses**: Check that the Flask server is running and accessible at http://localhost:5000.
- **Text-to-Speech Not Working**: Ensure your browser supports the Web Speech API (most modern browsers do).

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Gemini API for providing the AI capabilities
- Flask for the backend framework
- Web Speech API for text-to-speech functionality
