# 🎴 Team Conversation Deck

![html](https://img.shields.io/badge/HTML5-%23E34F26?logo=html5&logoColor=white)
![css](https://img.shields.io/badge/CSS3-%231572B6?logo=css3&logoColor=white)
![javascript](https://img.shields.io/badge/JavaScript-ES6%2B-yellow?logo=javascript&logoColor=black)
![platform](https://img.shields.io/badge/Platform-Web-lightgrey)
![version](https://img.shields.io/badge/Version-v2.0-purple)
![license](https://img.shields.io/badge/License-MIT-green)

A lightweight, zero-backend web app that helps teams spark meaningful
conversations through randomly drawn question cards.

👉 **Live site:** http://teamcardgames.online

Designed for team meetings, retrospectives, workshops, 1:1s, and casual
check-ins, the Team Conversation Deck encourages connection, reflection,
and thoughtful discussion through simple, focused prompts.

------------------------------------------------------------------------

## ✨ Features

-   🎲 Random card draw with **no repeats** until reshuffle
-   🗂 Category filtering:
    -   Fun
    -   Reflect
    -   Teamwork
    -   Growth
    -   Productivity
    -   Wellbeing
    -   Communication
-   🌙 Dark & Light mode with saved preference
-   🔄 Safe reshuffle when the deck is exhausted
-   🕘 Recent card history (last 6 cards)
-   ⌨️ Keyboard support (`Enter` to draw)
-   📱 Fully responsive (desktop, tablet, mobile)
-   ⚡ No framework, no backend, no build step

------------------------------------------------------------------------

## 🧠 How It Works

-   All conversation cards live in `cards.js` as a simple JavaScript
    array.
-   When the app loads (or is reset), the deck is shuffled.
-   Cards are drawn sequentially from the shuffled deck, ensuring **no
    duplicates**.
-   Once all cards are used, the user is prompted to reshuffle.
-   Optional hints provide gentle guidance for deeper conversation.
-   Category selection dynamically rebuilds and reshuffles the deck.
-   Theme preference is stored locally using `localStorage`.

------------------------------------------------------------------------

## 📂 Project Structure

    /
    ├── index.html    # App layout and markup
    ├── styles.css    # Styling, themes, animations, responsive layout
    ├── app.js        # Core app logic (shuffle, draw, history, theme)
    └── cards.js      # Conversation card data

------------------------------------------------------------------------

## 🚀 Getting Started (Local)

No installation or build process required.

### Option 1: Open directly

1.  Clone the repository:

    ``` bash
    git clone https://github.com/your-username/team-conversation-deck.git
    ```

2.  Open `index.html` in your browser.

### Option 2: Serve locally (optional)

If you prefer a local server:

``` bash
npx serve .
```

------------------------------------------------------------------------

## 🧩 Customising the Deck

To add, remove, or edit cards:

1.  Open `cards.js`

2.  Modify the `window.CARDS` array:

    ``` js
    {
      text: "Your question here",
      category: "Fun",
      hint: "Optional guidance text"
    }
    ```

3.  Save and refresh the page.

### Supported Categories

-   Fun
-   Reflect
-   Teamwork
-   Growth
-   Productivity
-   Wellbeing
-   Communication

------------------------------------------------------------------------

## ♿ Accessibility

-   Semantic HTML structure
-   Keyboard interaction supported
-   Clear visual contrast in both themes
-   Motion limited to short, non-looping animations
-   Readable font sizes across screen sizes

------------------------------------------------------------------------

## 🎯 Ideal Use Cases

-   Team retrospectives
-   Icebreakers
-   Remote team check-ins
-   Workshops & offsites
-   Leadership coaching
-   1:1 conversations
-   New team onboarding

------------------------------------------------------------------------

## 🛠 Tech Stack

-   **HTML5**
-   **CSS3**
-   **Vanilla JavaScript**

------------------------------------------------------------------------

## 🔒 Privacy

-   No analytics
-   No cookies
-   No tracking
-   No data storage beyond local theme preference

All interaction happens entirely in the browser.

------------------------------------------------------------------------

## 🤝 Contributing

Contributions are welcome.

Fork the repo, make your changes, and submit a pull request.

------------------------------------------------------------------------

## 📄 License

Free for personal and team use.\
If reused publicly or commercially, please credit the original author.

------------------------------------------------------------------------

## 👤 Author

**Chris Dewey**\
Version 2.0\
© Chris Dewey
