import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_KEY = "74ba1ac21463455b938f651fc0ca75e5";
const BASE_URL = "https://api.rawg.io/api/games";
const PLATFORMS_URL = "https://api.rawg.io/api/platforms";
const DEVELOPERS_URL = "https://api.rawg.io/api/developers";

const GameList = () => {
  const [games, setGames] = useState([]);
  const [platforms, setPlatforms] = useState([]); // Lista de plataformas
  const [developers, setDevelopers] = useState([]); // Lista de desarrolladores
  const [filters, setFilters] = useState({
    year: "",
    genre: "",
    platform: "",
    tag: "",
    developer: "",
    search: "",
  });

  // Obtener la lista de plataformas y desarrolladores al cargar el componente
  useEffect(() => {
    const fetchPlatformsAndDevelopers = async () => {
      try {
        const platformsResponse = await axios.get(PLATFORMS_URL, { params: { key: API_KEY } });
        const developersResponse = await axios.get(DEVELOPERS_URL, { params: { key: API_KEY } });
        setPlatforms(platformsResponse.data.results);
        setDevelopers(developersResponse.data.results);
      } catch (error) {
        console.error("Error fetching platforms or developers:", error);
      }
    };

    fetchPlatformsAndDevelopers();
  }, []);

  // Buscar juegos basados en los filtros
  const fetchGames = async () => {
    try {
      const platformId = platforms.find(
        (p) => p.name.toLowerCase() === filters.platform.toLowerCase()
      )?.id;
      const developerId = developers.find(
        (d) => d.name.toLowerCase() === filters.developer.toLowerCase()
      )?.id;

      let url = `${BASE_URL}?key=${API_KEY}&ordering=-metacritic`;

      if (filters.year) url += `&dates=${filters.year}-01-01,${filters.year}-12-31`;
      if (filters.genre) url += `&genres=${filters.genre}`;
      // Para solucionar el problema de las plataformas que solo filtraba por codigo ahora se puede buscar tambien por texto
      if (filters.platform && platformId) url += `&platforms=${platformId}`;
      if (filters.tag) url += `&tags=${filters.tag}`;
      // Aunque desarrolladores aun me da problemas al buscar por texto
      if (filters.developer && developerId) url += `&developers=${developerId}`;
      if (filters.search) url += `&search=${filters.search.replace(/ /g, "+")}`;

      const response = await axios.get(url);
      setGames(response.data.results);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchGames();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApplyFilters = () => {
    fetchGames();
  };

  return (
    <div>
      <h1>Top Videojuegos según Metacritic</h1>

      <input
        type="text"
        name="search"
        placeholder="Buscar por nombre... (Ej: zelda)"
        onChange={handleFilterChange}
      />
      <p>Solo minusculas</p>

      <div>
        <input type="number" name="year" placeholder="Año" onChange={handleFilterChange} />
        <input type="text" name="genre" placeholder="Género (Ej: action, indie)" onChange={handleFilterChange} />
        <input type="text" name="platform" placeholder="Plataforma (Ej: Wii, PC)" onChange={handleFilterChange} />
        <input type="text" name="tag" placeholder="Tag (Ej: singleplayer or multiplayer)" onChange={handleFilterChange} />
        <input type="text" name="developer" placeholder="Desarrolladora (Ej: Nintendo, Valve)" onChange={handleFilterChange} />
        <button onClick={handleApplyFilters}>Aplicar filtros</button>
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