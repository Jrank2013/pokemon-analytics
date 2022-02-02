import Layout from '../../components/layout'
import {Badge, Tab, Table, Tabs} from "react-bootstrap";
import axios from "axios";
import Image from "next/image"

export default function Pokemon({pokemon, movesByLevelUp, movesByBreeding, movesByTM}) {
    return (<Layout>

        <h1 className={"text-capitalize"}>{pokemon.name}</h1>

        <div className="flex flex-row ">
            <div>
                <Image src={pokemon.sprites.other['official-artwork'].front_default}
                     alt={`Official artwork for ${pokemon.name}`}/>
                {pokemon.types.map(type => <Badge key={type.type.name} pill color="light"
                                                  className="color: black; text-transform: capitalize">{type.type.name}</Badge>)}


            </div>
            <Table>
                <thead>
                <tr>
                    <th>Stat</th>
                    <th>Base</th>
                </tr>
                </thead>
                <tbody>
                {
                    pokemon.stats.map(stat => {
                        return (
                            <tr key={stat.stat.name}>
                                <td className="text-transform: capitalize">{stat.stat.name.replace("-", " ")}</td>
                                <td>{stat.base_stat}</td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </Table>
        </div>
        <hr/>

        <h2>Abilities</h2>
        <ul>
            {pokemon.abilities.map((ability) => {
                return (
                    <li key={ability.name}>
                        <p className="text-capitalize font-bold">{ability.name}
                            {
                                ability.pokemon.find(pokemonWithAbility => pokemonWithAbility.pokemon.name === pokemon.name).is_hidden === true
                                && <small className="text-lowercase font-normal italic"> hidden</small>
                            }

                        </p>
                        <p>{ability.effect_entries.find(entry => entry.language.name === "en").short_effect}</p>
                    </li>)
            })}
        </ul>


        <h2>Moves</h2>
        <Tabs>
            <Tab title="By Level Up" eventKey="byLevelUp">
                <ul>
                    {movesByLevelUp.map(move => <li key={move.name}>{move.name}</li>)}
                </ul>
            </Tab>
            <Tab title="By Breeding" eventKey="byBreeding">
                <ul>
                    {movesByBreeding.map(move => <li key={move.name}>{move.name}</li>)}
                </ul>
            </Tab>
            <Tab title="By TM" eventKey="byTM">
                <ul>
                    {movesByTM.map(move => <li key={move.name}>{move.name}</li>)}
                </ul>
            </Tab>
        </Tabs>
    </Layout>)
}


export const getStaticProps = async ({params}) => {

    console.log(params)
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${params.name}`);

    const abilities = await Promise.all(
        response.data.abilities.map(async ({ability}) => {
            const response = await axios.get(ability.url);
            return response.data;
        }),
    );

    const moves = await Promise.all(
        response.data.moves.map(async ({move, version_group_details}) => {
            const response = await axios.get(move.url);
            return {...response.data, version_group_details};
        }),
    );

    const movesByLevelUp = moves.filter(move => move.version_group_details.filter(version => version.move_learn_method.name === 'level-up').length > 0)
    const movesByBreeding = moves.filter(move => move.version_group_details.filter(version => version.move_learn_method.name === 'egg').length > 0)
    const movesByTM = moves.filter(move => move.version_group_details.filter(version => version.move_learn_method.name === 'machine').length > 0)
    return {
        props: {
            pokemon: {...response.data, abilities},
            movesByLevelUp,
            movesByBreeding,
            movesByTM,
        }
    };
}

export const getStaticPaths = async () => {

    const pokemon = [];
    let response;
    let url = 'https://pokeapi.co/api/v2/pokemon?limit=200';

    do {
        response = await axios.get(url);
        if (response.status !== 200) {
            throw Error(`api raised ${response.status} ${response.statusText}`);
        }
        pokemon.push(...response.data.results);
        url = response.data?.next ?? '';
    } while (url !== '');


    return {
        paths: pokemon.map(pokemon => ({params: {...pokemon}})),
        fallback: true
    }
}