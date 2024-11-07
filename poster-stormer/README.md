# Poster Stormer

**Poster Stormer** is a web application that generates movie posters based on user-input prompts and additional features. The app is designed with React, showcasing a user-friendly interface where users can select genres, decades, and styles for poster generation.

## Table of Contents

- [Poster Stormer](#poster-stormer)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Running the App](#running-the-app)
  - [How to Use](#how-to-use)
  - [Components](#components)
    - [App.js](#appjs)
    - [PromptInput](#promptinput)
    - [AdditionalOptions](#additionaloptions)
    - [PosterDisplay](#posterdisplay)
  - [Mock Data](#mock-data)
    - [Example Mock Poster Data](#example-mock-poster-data)

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or later)
- [npm](https://www.npmjs.com/) (Node package manager, comes with Node.js)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/poster-stormer.git
   cd poster-stormer
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

### Running the App

To start the app in development mode, run:

```bash
npm start
```

This command will start the development server, and you can view the app in your browser at `http://localhost:3000`.

To build the app for production, run:

```bash
npm run build
```

This will create an optimized production build in the `build` folder.

## How to Use

1. **Input a Prompt**: In the `PromptInput` section, type your movie prompt that will inspire the poster generation.
2. **Select Additional Options**: Expand the options to choose:
   - **Genre**: Select a genre from the dropdown menu.
   - **Decade**: Specify the decade for the poster style (e.g., 1980s).
   - **Number of Posters**: Choose how many posters you want to generate (up to 10).
   - **Style**: Enter a style (e.g., Retro, Minimalist).
3. **Generate Posters**: Click the "Generate" button to view the posters based on the selected criteria.
4. **Navigate Posters**: Use the "Previous" and "Next" buttons to browse through generated posters.

## Components

### App.js

`App.js` is the main component of the application. It manages the state and structure of the app.

- **State Variables**:
  - `numberOfPosters`: Tracks the number of posters requested by the user.
  - `postersToDisplay`: Holds the array of posters to display, based on the mock data or actual generated posters.
  - `currentIndex`: Tracks the current poster displayed.

- **Functions**:
  - `handleGenerate`: Slices the `mockPosters` data based on `numberOfPosters` and sets the selected posters in the display.
  - `handleNext` and `handlePrev`: Navigate through the list of generated posters, updating `currentIndex` as needed.

- **Components Used**:
  - `<PromptInput />`: The text input for movie prompt.
  - `<AdditionalOptions />`: Displays the genre, decade, and style selectors.
  - `<PosterDisplay />`: Displays the generated poster along with navigation buttons.

### PromptInput

Located in `Components/PromptInput.js`

This component provides a text area for users to type in their movie prompt.

- **Description**: 
  - Renders a text area for prompt input with a placeholder text "Type your movie prompt here."
  - Includes an "Edit" button for potential additional editing features.

- **Styling**: Defined in `PromptInput.css`.

### AdditionalOptions

Located in `Components/AdditionalOptions.js`

This component renders additional options for the poster generation, including genre, decade, number of posters, and style.

- **Props**:
  - `setNumberOfPosters`: Function to update the number of posters requested by the user.

- **Options**:
  - **Genre**: Dropdown menu with a comprehensive list of genres.
  - **Decade**: Input field where users can specify a decade (e.g., "1980s").
  - **Number of Posters**: Numeric input allowing users to select how many posters to generate.
  - **Style**: Input for specifying a style (e.g., "Retro").

- **Styling**: Defined in `AdditionalOptions.css`.

### PosterDisplay

Located in `Components/PosterDisplay.js`

This component displays the generated posters, allowing navigation between them.

- **Props**:
  - `poster`: Current poster to display (passed as an object with `image` and `title`).
  - `onNext` and `onPrev`: Functions to navigate to the next or previous poster.
  - `canNext` and `canPrev`: Boolean values to enable/disable navigation buttons.

- **Description**:
  - Shows the poster image and title.
  - If no posters are generated, displays a placeholder message.
  - Renders "Previous" and "Next" buttons for navigation.

- **Styling**: Defined in `PosterDisplay.css`.

## Mock Data

Located in `mockData.js`

This file provides sample data for the posters, allowing you to test the app before implementing a real poster generation API.

- **Data Structure**:
  - Each mock poster has properties:
    - `id`: Unique identifier for the poster.
    - `image`: URL or path to the poster image.
    - `title`: Title of the poster.
    - `genre`, `decade`, and `style`: Attributes matching user input.

### Example Mock Poster Data

```javascript
const mockPosters = [
  {
    id: 1,
    image: 'poster1.png',
    title: 'Sci-Fi Adventure',
    genre: 'Sci-Fi',
    decade: '1980s',
    style: 'Retro',
  },
  {
    id: 2,
    image: 'poster2.png',
    title: 'Fantasy Quest',
    genre: 'Fantasy',
    decade: '1990s',
    style: 'Illustrative',
  },
  {
    id: 3,
    image: 'poster3.png',
    title: 'Thriller Nights',
    genre: 'Thriller',
    decade: '2000s',
    style: 'Minimalist',
  },
];
```