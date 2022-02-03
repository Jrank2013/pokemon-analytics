import Layout from '../../components/layout'
import Image from "next/image"

import {Box, Chip, Stack, Tab, Table, TableBody, TableCell, TableHead, TableRow, Tabs} from '@mui/material';
import * as React from "react";
import {useState} from "react";
import http from "../../lib/http";


export default function Pokemon({pokemon, movesByLevelUp, movesByBreeding, movesByTM}) {
    const tabs = [
        {moves: movesByLevelUp, label: "By Level Up"},
        {moves: movesByBreeding, label: "By Level Breeding"},
        {moves: movesByTM, label: "By TM"},
    ].filter(tab => tab.moves?.length ?? 0 > 0)

    const [currentMoveTab, setCurrentMoveTab] = useState<number>(0)

    const handleMoveTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setCurrentMoveTab(newValue);
    };

    return (<Layout>

        <h1 className={"text-capitalize"}>{pokemon.name}</h1>

        <div className="flex flex-row ">
            <div>
                <Image width={500} height={500} src={pokemon.sprites.other['official-artwork'].front_default}
                       alt={`Official artwork for ${pokemon.name}`}/>
                <Stack direction="row" spacing={1}>
                    {pokemon.types.map(type => <Chip key={type.type.name} color="primary"
                                                     label={type.type.name}/>)}
                </Stack>


            </div>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Stat</TableCell>
                        <TableCell>Base</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        pokemon.stats.map(stat => {
                            return (
                                <TableRow key={stat.stat.name}>
                                    <TableCell
                                        className="text-transform: capitalize">{stat.stat.name.replace("-", " ")}</TableCell>
                                    <TableCell>{stat.base_stat}</TableCell>
                                </TableRow>
                            )
                        })
                    }
                </TableBody>
            </Table>
        </div>
        <br/>

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
        <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
            <Tabs value={currentMoveTab} onChange={handleMoveTabChange} aria-label="basic tabs example">
                {tabs.map((tab) => <Tab key={tab.label} label={tab.label}/>)}
            </Tabs>
        </Box>
        <Box>
            <ul>
                {
                    tabs[currentMoveTab].moves.map(move => (
                        <li key={move.name}>
                            <p>{move.name}</p>
                        </li>)
                    )
                }
            </ul>
        </Box>

    </Layout>)
}


export const getStaticProps = async ({params}) => {

    const response = await http.get(`https://pokeapi.co/api/v2/pokemon/${params.name}`);

    const abilities = await Promise.all(
        response.data.abilities.map(async ({ability}) => {
            const response = await http.get(ability.url);
            return response.data;
        }),
    );

    const moves = await Promise.all(
        response.data.moves.map(async ({move, version_group_details}) => {
            const response = await http.get(move.url);
            return {...response.data, version_group_details};
        }),
    );

    const movesByLevelUp = moves.filter(move => move.version_group_details.filter(version => version.move_learn_method.name === 'level-up').length > 0)
    const movesByBreeding = moves.filter(move => move.version_group_details.filter(version => version.move_learn_method.name === 'egg')?.length ?? 0 > 0)
    const movesByTM = moves.filter(move => move.version_group_details.filter(version => version.move_learn_method.name === 'machine').length > 0)

    if (!response.data.name) {
        console.log(response.data)
    }

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
        response = await http.get(url);
        if (response.status !== 200) {
            throw Error(`api raised ${response.status} ${response.statusText}`);
        }
        pokemon.push(...response.data.results);
        url = response.data?.next ?? '';
    } while (url !== '');


    return {
        paths: pokemon.map(pokemon => ({params: {...pokemon}})),
        fallback: false
    }
}