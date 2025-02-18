import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [pokemons, setPokemons] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const res = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=50");
        const pokemonData = await Promise.all(
          res.data.results.map(async (pokemon) => {
            const details = await axios.get(pokemon.url);
            return {
              name: pokemon.name,
              image: details.data.sprites.front_default,
              type: details.data.types.map((t) => t.type.name).join(", "),
              height: details.data.height,
              weight: details.data.weight,
              url: pokemon.url,
            };
          })
        );
        setPokemons(pokemonData);
      } catch (error) {
        console.error("Error fetching Pokémon:", error);
      }
    };
    fetchPokemons();
  }, []);

  const openModal = async (pokemon) => {
    try {
      const res = await axios.get(pokemon.url);
      setModalData({
        name: pokemon.name.toUpperCase(),
        image: res.data.sprites.other["official-artwork"].front_default || pokemon.image,
        type: pokemon.type,
        height: pokemon.height,
        weight: pokemon.weight,
        abilities: res.data.abilities.map((a) => a.ability.name).join(", "),
        stats: res.data.stats.map((s) => ({
          name: s.stat.name,
          value: s.base_stat,
        })),
      });
      setSelectedPokemon(pokemon);
    } catch (error) {
      console.error("Error fetching Pokémon details:", error);
    }
  };

  const closeModal = () => {
    setSelectedPokemon(null);
    setModalData(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 transition-all duration-300 flex flex-col">
      
      <div className="font-semibold">
  <span className="text-blue-500">the</span>
  <span className="text-white">goodgame</span>
  <span className="text-blue-500">theory</span>
</div>

      <div className="w-full  text-white p-4 text-center text-4xl font-bold shadow-md mb-4">
        Pokemon Explorer
      </div>

      <main className="flex-grow">
        <input
          type="text"
          placeholder="Search Pokémon..."
          className="w-full p-3 mb-6 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {pokemons.filter((p) => p.name.includes(search.toLowerCase())).length > 0 ? (
            pokemons
              .filter((p) => p.name.includes(search.toLowerCase()))
              .map((p) => (
                <div
                  key={p.name}
                  className="relative w-full bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg text-center flex flex-col items-center justify-center transition-all duration-300 hover:bg-blue-500 dark:hover:bg-gray-700 group"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="mx-auto mb-2 transition-transform duration-300 transform group-hover:scale-110"
                  />
                  <h2 className="font-bold text-gray-900 dark:text-gray-100 group-hover:hidden">
                    {p.name.toUpperCase()}
                  </h2>

                  <div className="hidden group-hover:block text-white">
                    <p className="text-sm">Type: {p.type}</p>
                    <p className="text-sm">Height: {p.height} dm</p>
                    <p className="text-sm">Weight: {p.weight} hg</p>
                  

                  <button
                    onClick={() => openModal(p)}
                    className="mt-2 text-sm text-blue-600 dark:text-blue-400  "
                  >
                    See Details
                  </button>
                  </div>
                </div>
              ))
          ) : (
            <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
              No Pokémon Found 
            </p>
          )}
        </div>
      </main>

      <footer className="w-full bg-blue-600 dark:bg-gray-800 text-white p-4 text-center mt-6 shadow-md">
        Made by Arshdeep Kaur 
      </footer>

      {/* MODAL */}
      {selectedPokemon && modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full text-center relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600 dark:text-white text-xl hover:text-red-500"
            >
              &times;
            </button>
            <img src={modalData.image} alt={modalData.name} className="w-40 h-40 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{modalData.name}</h2>
            <p className="text-gray-700 dark:text-gray-300 mt-2">Type: {modalData.type}</p>
            <p className="text-gray-700 dark:text-gray-300">Height: {modalData.height} dm</p>
            <p className="text-gray-700 dark:text-gray-300">Weight: {modalData.weight} hg</p>
            <p className="text-gray-700 dark:text-gray-300 mt-2">
              <span className="font-bold">Abilities:</span> {modalData.abilities}
            </p>
            <div className="mt-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Base Stats</h3>
              {modalData.stats.map((stat) => (
                <p key={stat.name} className="text-gray-700 dark:text-gray-300">
                  {stat.name.toUpperCase()}: {stat.value}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
