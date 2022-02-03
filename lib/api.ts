import path from "path";
import * as fs from "fs";

const dataDirectory = path.join(process.cwd(), "api-data/data/")

export const getAllPokemon = () => {
    const pokemonLocations = JSON.parse(fs.readFileSync(path.join(dataDirectory, 'api/v2/pokemon/index.json'), {encoding: 'utf-8'})).results

    return pokemonLocations.map(location => {

        return JSON.parse(fs.readFileSync(path.join(dataDirectory, location.url, 'index.json'), {encoding: 'utf-8'}))
    })
}

export const getPokemon = (name: string) => {
    return getAllPokemon().find((pokemon) => pokemon.name === name)
}

export const getAllMoves = () => {
    const moveLocations = JSON.parse(fs.readFileSync(path.join(dataDirectory, 'api/v2/move/index.json'), {encoding: 'utf-8'})).results

    return moveLocations.map(location => {

        return JSON.parse(fs.readFileSync(path.join(dataDirectory, location.url, 'index.json'), {encoding: 'utf-8'}))
    })
}

export const getMove = (name: string) => {
    return getAllMoves().find((move) => move.name === name)
}

export const getAllAbilities = () => {
    const abilityLocations = JSON.parse(fs.readFileSync(path.join(dataDirectory, 'api/v2/ability/index.json'), {encoding: 'utf-8'})).results

    return abilityLocations.map(location => {

        return JSON.parse(fs.readFileSync(path.join(dataDirectory, location.url, 'index.json'), {encoding: 'utf-8'}))
    })
}

export const getAbility = (name: string) => {
    return getAllAbilities().find(ability => ability.name === name)
}