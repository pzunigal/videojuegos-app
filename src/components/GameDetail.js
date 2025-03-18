import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const API_KEY = "74ba1ac21463455b938f651fc0ca75e5";
const BASE_URL = "https://api.rawg.io/api/games";

const GameDetail = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/${id}?key=${API_KEY}`)
      .then((response) => {
        setGame(response.data);
      })
      .catch((error) => {
        console.error("Error fetching game details:", error);
      });
  }, [id]);

  if (!game) return <p>Cargando...</p>;

  return (
    <div>
      <Link to="/">← Volver a la lista</Link>
      <h1>{game.name}</h1>
      <img src={game.background_image} alt={game.name} width="400" />
      <p><strong>Puntuación:</strong> {game.metacritic}</p>
      <p><strong>Año de lanzamiento:</strong> {game.released}</p>
      <p><strong>Géneros:</strong> {game.genres.map((g) => g.name).join(", ")}</p>
      <p><strong>Plataformas:</strong> {game.platforms.map((p) => p.platform.name).join(", ")}</p>
      <p><strong>Desarrollador:</strong> {game.developers ? game.developers.map((d) => d.name).join(", ") : "N/A"}</p>
      
      {game.clip ? (
        <div>
          <h2>Trailer</h2>
          <video width="400" controls>
            <source src={game.clip.clips.full} type="video/mp4" />
            Tu navegador no soporta el video.
          </video>
        </div>
      ) : (
        <p>No hay tráiler disponible</p>
      )}

      <p><strong>Descripción:</strong></p>
      <p dangerouslySetInnerHTML={{ __html: game.description }} />
    </div>
  );
};

export default GameDetail;
