import { useEffect, useState } from "react";
import "./index.css";

const Pokemon = () => {
  const [pokemons, setPokemons] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API = "https://pokeapi.co/api/v2/pokemon?limit=24";

  const fetchAPI = async () => {
    try {
      const response = await fetch(API);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      const detailedPokemonData = data.results.map(async (currPokemon) => {
        const res = await fetch(currPokemon.url);
        const data = await res.json();
        return data;
      });

      const detailedResponse = await Promise.all(detailedPokemonData);
      setPokemons(detailedResponse);
    } catch (err) {
      setError(err);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  const filteredPokemons = pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>Error: {error.message}</h1>;
  }

  return (
    <div className="pokemon-container">
      <input
        type="text"
        placeholder="Search Pokémon"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-bar"
      />
      <div className="pokemon-list">
        {filteredPokemons.map((pokemon) => (
          <div className="pokemon-card" key={pokemon.id}>
            <img
              src={pokemon.sprites.other.dream_world.front_default}
              alt={pokemon.name}
              className="pokemon-image"
            />

            <h1 className="pokemon-name">{pokemon.name}</h1>
            <h2 className="pokemon-name">
              {" "}
              {pokemon.types.map((currType) => currType.type.name).join(", ")}
            </h2>
            <div className="pokemon-details">
              <h3>Height: {pokemon.height}</h3>
              <h3>Weight: {pokemon.weight}</h3>
              <h3>Speed: {pokemon.stats[5].base_stat}</h3>
              <h3>Base Experience: {pokemon.base_experience}</h3>
              <h3>Abilitys : {pokemon.abilities.map((abilityInfo) => abilityInfo.ability.name).slice(0,1).join(', ')} </h3>
              <div>
                {pokemon.stats.map((stat, statIndex) => (
                  <p key={statIndex}>
                    {stat.stat.name}: {stat.base_stat}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pokemon;
