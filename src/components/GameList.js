import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_KEY = "74ba1ac21463455b938f651fc0ca75e5";
const BASE_URL = "https://api.rawg.io/api/games";

const GameList = () => {
  const [games, setGames] = useState([]);
  const [filters, setFilters] = useState({
    year: "",
    genre: "",
    platform: "",
    tag: "",
    developer: "",
    search: "",
  });

  const fetchGames = () => {
    let url = `${BASE_URL}?key=${API_KEY}&ordering=-metacritic`;

    if (filters.year) url += `&dates=${filters.year}-01-01,${filters.year}-12-31`;
    if (filters.genre) url += `&genres=${filters.genre}`;
    if (filters.platform) url += `&platforms=${filters.platform}`;
    if (filters.tag) url += `&tags=${filters.tag}`;
    if (filters.developer) url += `&developers=${filters.developer}`;
    if (filters.search) url += `&search=${filters.search}`;

    axios
      .get(url)
      .then((response) => {
        setGames(response.data.results);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    fetchGames();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h1>Top Videojuegos según Metacritic</h1>

      <input
        type="text"
        name="search"
        placeholder="Buscar por nombre..."
        onChange={handleFilterChange}
      />

      <div>
        <input type="number" name="year" placeholder="Año" onChange={handleFilterChange} />
        <input type="text" name="genre" placeholder="Género" onChange={handleFilterChange} />
        <input type="text" name="platform" placeholder="Plataforma" onChange={handleFilterChange} />
        <input type="text" name="tag" placeholder="Tag" onChange={handleFilterChange} />
        <input type="text" name="developer" placeholder="Desarrolladora" onChange={handleFilterChange} />
        <button onClick={fetchGames}>Aplicar filtros</button>
      </div>

      <ul>
        {games.map((game) => (
          <li key={game.id}>
            <Link to={`/game/${game.id}`}>
              <img src={game.background_image} alt={game.name} width="100" />
              <strong>{game.name}</strong> - Puntuación: {game.metacritic}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GameList;
