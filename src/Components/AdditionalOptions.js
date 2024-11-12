import React from "react";

const genres = [
  "Action",
  "Adult",
  "Adventure",
  "Animation",
  "Biography",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "Game-Show",
  "History",
  "Horror",
  "Music",
  "Musical",
  "Mystery",
  "News",
  "Reality-TV",
  "Romance",
  "Sci-Fi",
  "Short",
  "Sport",
  "Talk-Show",
  "Thriller",
  "War",
  "Western",
];

function AdditionalOptions({ setNumberOfPosters }) {
  return (
    <div className="additional-options">
      <details>
        <summary>Expand for more features</summary>
        <div className="options">
          <label>
            Genre:
            <select>
              {genres.map((genre, index) => (
                <option key={index} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </label>
          <label>
            Decade:
            <input type="text" placeholder="e.g., 1980s" />
          </label>
          <label>
            # of posters:
            <input
              type="number"
              min="1"
              max="10"
              onChange={(e) => setNumberOfPosters(e.target.value)}
            />
          </label>
          <label>
            Style:
            <input type="text" placeholder="e.g., Retro" />
          </label>
        </div>
      </details>
    </div>
  );
}

export default AdditionalOptions;
