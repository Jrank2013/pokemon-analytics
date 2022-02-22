import Layout from '../../../components/layout'
import Image from "next/image"
import Head from "next/head";

import {
    Box,
    Stack,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow,
    Tabs,
    Typography,
} from '@mui/material';
import * as React from "react";
import { useState } from "react";
import { getAbility, getMove, getPokemon, pokemon } from "../../../lib/api";
import TypeChip from '../../../components/TypeChip'


import titleCase from 'voca/title_case'


export default function Pokemon({ pokemon, movesByLevelUp, movesByBreeding, movesByTM }) {
    const tabs = [
        { moves: movesByLevelUp, label: "By Level Up" },
        { moves: movesByBreeding, label: "By Breeding" },
        { moves: movesByTM, label: "By TM" },
    ].filter(tab => tab.moves?.length ?? 0 > 0)


    const [currentMoveTab, setCurrentMoveTab] = useState<number>(0)
    const [currentMoveTablePage, setCurrentMoveTablePage] = useState<number>(0)
    const [movesPerPage, setMovesPerPage] = useState<number>(10)

    const handleMoveTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setCurrentMoveTab(newValue);
        setCurrentMoveTablePage(0)
    };

    function onTablePageChange(event: React.SyntheticEvent, newValue: number) {
        setCurrentMoveTablePage(newValue)
    }

    function onMovesPerRowChange(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        setMovesPerPage(parseInt(event.target.value))

    }

    return (
        <Layout>
            <Head>
                <title>{titleCase(pokemon.name)}</title>
            </Head>

            <Typography variant="h1" sx={{ textTransform: 'capitalize' }}>{pokemon.name}</Typography>

            <div className="flex flex-row ">
                <div>
                    <Image width={500} height={500} src={pokemon.sprites.other['official-artwork'].front_default}
                           alt={`Official artwork for ${pokemon.name}`}/>
                    <Stack direction="row" spacing={1}>
                        {
                            pokemon.types.map(type => (
                                    <TypeChip key={type.type.name} type={type.type.name}/>
                                ),
                            )}
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
                                        <TableCell>{titleCase(stat.stat.name.replace("-", " "))}</TableCell>
                                        <TableCell>{stat.base_stat}</TableCell>
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
            </div>
            <br/>

            <Typography variant={"h2"}>Abilities</Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Effect</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {pokemon.abilities.map((ability) => {
                        const abilityEntry = ability.effect_entries.find(entry => entry.language.name === "en") || ability.flavor_text_entries.find(entry => entry.language.name === "en");
                        const abilityName = titleCase(ability.name.replace('-', " "));
                        const isHiddenAbility = ability.pokemon.find(pokemonWithAbility => pokemonWithAbility.pokemon.name === pokemon.name).is_hidden === true;

                        return (
                            <TableRow key={ability.name}>
                                <TableCell>
                                    <Box sx={{ display: 'inline' }}>
                                        <Typography variant={'h6'}>{abilityName}</Typography>
                                        {isHiddenAbility && <Typography variant={'overline'}> hidden</Typography>}
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <p>{abilityEntry?.short_effect}</p>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>


            <Typography variant={"h2"}>Moves</Typography>
            {tabs.length > 0 ?
                (<>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={currentMoveTab} onChange={handleMoveTabChange} aria-label="basic tabs example">
                            {tabs.map((tab) => <Tab key={tab.label} label={tab.label}/>)}
                        </Tabs>
                    </Box>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Description</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tabs[currentMoveTab].moves.slice(currentMoveTablePage * movesPerPage, movesPerPage * (currentMoveTablePage + 1)).map(move => {
                                    const moveEntry = move.effect_entries.find(entry => entry.language.name === "en") || move.flavor_text_entries.find(entry => entry.language.name === "en");
                                    const moveName = titleCase(move.name.replace('-', " "));

                                    return (
                                        <TableRow key={move.name}>
                                            <TableCell>
                                                <p>{moveName}</p>
                                            </TableCell>
                                            <TableCell>
                                                <TypeChip key={move.type.name} type={move.type.name}/>
                                            </TableCell>
                                            <TableCell>
                                                <p>{moveEntry?.short_effect.replace('$effect_chance', move.effect_chance)}</p>
                                            </TableCell>
                                        </TableRow>
                                    )
                                },
                            )}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination count={tabs[currentMoveTab].moves.length} page={currentMoveTablePage}
                                                 onPageChange={onTablePageChange}
                                                 rowsPerPage={movesPerPage}
                                                 onRowsPerPageChange={onMovesPerRowChange}/>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </>)
                : <p>Sorry no data at this time</p>
            }
        </Layout>
    )
}


const filterMoves = (moves, learnMethod, generation) => {
    const movesForGeneration = moves.filter(move => move.version_group_details.filter(version => {
        const versionName = version.version_group.name;
        return versionName.startsWith(generation) || versionName.endsWith(generation)
    }).length > 0) || []
    return movesForGeneration.filter(move => move.version_group_details.filter(version => version.move_learn_method.name === learnMethod).length > 0) || []
}

export const getStaticProps = async ({ params }) => {

    const pokemon = getPokemon(params.name)

    const abilities = await Promise.all(
        pokemon.abilities.map(async ({ ability }) => {
            return getAbility(ability.name)
        }),
    );

    const moves = pokemon?.moves.map(({ move, version_group_details }) => {
        return { ...getMove(move.name), version_group_details }
    }) ?? []

    const movesByLevelUp = filterMoves(moves, 'level-up', params.generation)
    const movesByBreeding = filterMoves(moves, 'egg', params.generation)
    const movesByTM = filterMoves(moves, 'machine', params.generation)

    return {
        props: {
            pokemon: { ...pokemon, abilities },
            movesByLevelUp,
            movesByBreeding,
            movesByTM,
        },
    };
}

export const getStaticPaths = async () => {
    const defaultPokemon = pokemon.filter(pokemon => pokemon.is_default);
    return {
        paths: defaultPokemon.map(pokemon => pokemon.game_indices.map(generation => ({
            params: {
                name: pokemon.name,
                generation: generation.version.name,
            },
        }))).flat(),
        fallback: false,
    }
}