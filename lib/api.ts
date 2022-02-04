import path from "path";
import * as fs from "fs";

const dataDirectory = path.join(process.cwd(), "api-data/data/")

const getAllPokemon = () => {
    const pokemonLocations = JSON.parse(fs.readFileSync(path.join(dataDirectory, 'api/v2/pokemon/index.json'), {encoding: 'utf-8'})).results

    return pokemonLocations.map(location => {

        return JSON.parse(fs.readFileSync(path.join(dataDirectory, location.url, 'index.json'), {encoding: 'utf-8'}))
    })
}

export const pokemon = getAllPokemon()

export const getPokemon = (name: string) => {
    return pokemon.find((pokemon) => pokemon.name === name)
}

const getAllMoves = () => {
    const moveLocations = JSON.parse(fs.readFileSync(path.join(dataDirectory, 'api/v2/move/index.json'), {encoding: 'utf-8'})).results

    return moveLocations.map(location => {

        return JSON.parse(fs.readFileSync(path.join(dataDirectory, location.url, 'index.json'), {encoding: 'utf-8'}))
    })
}

export const moves = getAllMoves()

export const getMove = (name: string) => {
    return moves.find((move) => move.name === name)
}

const getAllAbilities = () => {
    const abilityLocations = JSON.parse(fs.readFileSync(path.join(dataDirectory, 'api/v2/ability/index.json'), {encoding: 'utf-8'})).results

    return abilityLocations.map(location => {

        return JSON.parse(fs.readFileSync(path.join(dataDirectory, location.url, 'index.json'), {encoding: 'utf-8'}))
    })
}

export const abilities = getAllAbilities();

export const getAbility = (name: string) => {
    return abilities.find(ability => ability.name === name)
}
