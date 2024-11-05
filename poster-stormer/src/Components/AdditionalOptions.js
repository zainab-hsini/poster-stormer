import React from 'react';

const genres = [
  "Horror",
  "Action",
  "Drama",
  "Thriller",
  "Science fiction",
  "Western",
  "Comedy",
  "Romance",
  "Crime film",
  "Experimental",
  "Adventure",
  "Fantasy",
  "Animation",
  "Documentary",
  "Mystery",
  "Fiction",
  "Musical",
  "Romantic comedy",
  "Noir",
  "Historical drama",
  "Historical Fiction",
  "Children's film",
  "Television",
  "Animated film",
  "Dark comedy",
  "War",
  "Historical film",
  "Music",
  "Narrative",
  "Epic",
  "Exploitation",
  "History",
  "Biographical",
  "Disaster",
  "Action comedy",
  "Magical Realism",
  "Fairy tale",
  "Superhero",
  "Chick flick",
  "Prison",
  "Music genre",
  "Heist",
  "Comedy horror",
  "Art"
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
            <input type="number" min="1" max="10" onChange={(e) => setNumberOfPosters(e.target.value)} />
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
