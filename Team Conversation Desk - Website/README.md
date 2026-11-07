# 🎴 Team Conversation Deck

![html](https://img.shields.io/badge/HTML5-%23E34F26?logo=html5&logoColor=white)
![css](https://img.shields.io/badge/CSS3-%231572B6?logo=css3&logoColor=white)
![javascript](https://img.shields.io/badge/JavaScript-ES6%2B-yellow?logo=javascript&logoColor=black)
![platform](https://img.shields.io/badge/Platform-Web-lightgrey)
![version](https://img.shields.io/badge/Version-v3.0-purple)
![license](https://img.shields.io/badge/License-MIT-green)

A lightweight, zero-backend web app that helps teams spark meaningful
conversations through randomly drawn question cards.

👉 **Live site:** http://teamcardgames.online

Designed for team meetings, retrospectives, workshops, 1:1s, and casual
check-ins, the Team Conversation Deck encourages connection, reflection,
and thoughtful discussion through simple, focused prompts.

------------------------------------------------------------------------

## ✨ Features

-   🎴 **223 fresh conversation cards** (new in v3.0) across 10 categories:
    Fun, Would You Rather, Reflect, Teamwork, Communication, Growth,
    Productivity, Wellbeing, AI and Cyber Security
-   🌡 **Depth filter**: Light, Medium and Deep, so you can match the
    questions to how well the group knows each other
-   🗂 **Multi-select categories**: mix and match any combination
-   🃏 Real card-flip animation with a full deck, **no repeats** until you
    reshuffle
-   ◀ **Back button** and clickable recent-card history to revisit a question
-   ⏱ Optional **talk timer** (1, 2 or 3 minutes per card)
-   🖥 **Presenter mode**: full-screen, large text, ideal for screen-sharing
-   📋 Copy a question to the clipboard in one click
-   🌙 Light and dark themes (follows your device by default, remembers your
    choice)
-   ⌨️ Keyboard shortcuts: `Space` draw, `←` back, `S` shuffle,
    `F` presenter mode, `T` theme
-   📱 Fully responsive, accessible (focus states, reduced-motion support)
-   ⚡ No framework, no backend, no build step

------------------------------------------------------------------------

## 🧠 How It Works

-   All conversation cards live in `cards.js`.
-   When the app loads (or you shuffle), the cards matching your filters
    are shuffled into a deck.
-   Cards are drawn in order from the shuffled deck, so there are **no
    duplicates** until the deck is finished.
-   Each card has an optional hint to help people get started.
-   Your filter, timer and theme choices are saved in your browser
    (`localStorage`).

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
    git clone https://github.com/chris-dewey-1991/Team-Building-Activities.git
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

2.  Add a line to the `window.CARDS` array:

    ``` js
    { category: "Fun", depth: 1, text: "Your question here", hint: "Optional guidance text" },
    ```

    -   `depth`: `1` = Light, `2` = Medium, `3` = Deep

3.  Save and refresh the page.

To add a new category, add it to `window.CATEGORIES` at the top of
`cards.js` and (optionally) give it a colour in `styles.css`
under the "Category colours" section.

### Supported Categories

-   Fun
-   Would You Rather
-   Reflect
-   Teamwork
-   Communication
-   Growth
-   Productivity
-   Wellbeing
-   AI
-   Cyber Security

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
-   No data storage beyond your saved theme and filter preferences in your own browser

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
Version 3.0\
© Chris Dewey
