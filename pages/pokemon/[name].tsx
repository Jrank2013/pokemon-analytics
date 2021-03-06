import Layout from '../../components/layout'
import Image from "next/image"
import Head from "next/head";

import {
    Box,
    MenuItem,
    Select,
    SelectChangeEvent,
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
import { getAbility, getMove, getPokemon, pokemon } from "../../lib/api";
import TypeChip from '../../components/TypeChip'


import titleCase from 'voca/title_case'

const filterMovesByVersion = (moves, version) => {
    return moves.filter(move => move.version_group_details.filter(version_details => version_details.version_group.name === version).length > 0)
}


const generationToDisplayName = {
    "red-blue": "Red/Blue",
    "yellow": "Yellow",
    "gold-silver": "Gold/Silver",
    "crystal": "Crystal",
    "ruby-sapphire": "Ruby/Sapphire",
    "emerald": "Emerald",
    "firered-leafgreen": "Fire Red/Leaf Green",
    "diamond-pearl": "Diamond/Pearl",
    "platinum": "Platinum",
    "heartgold-soulsilver": "HeartGold/SoulSilver",
    "black-white": "Black/White",
    "colosseum": "Colosseum",
    "xd": "XD",
    "black-2-white-2": "Black 2/White 2",
    "x-y": "X/Y",
    "omega-ruby-alpha-sapphire": "Omega Ruby/Alpha Sapphire",
    "sun-moon": "Sun/Moon",
    "ultra-sun-ultra-moon": "Ultra Sun/Ultra Moon",
}


export default function Pokemon({ pokemon, movesByLevelUp, movesByBreeding, movesByTM, availableGens }) {


    const [currentMoveTab, setCurrentMoveTab] = useState<number>(0)
    const [currentMoveTablePage, setCurrentMoveTablePage] = useState<number>(0)
    const [movesPerPage, setMovesPerPage] = useState<number>(10)
    const [currentVersion, setCurrentVersion] = useState<string>(availableGens[0])

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

    function onVersionChange(event: SelectChangeEvent) {
        setCurrentVersion(event.target.value)

    }

    const sortMovesByLevel = React.useCallback((moves) => {
        return moves.sort((a, b) => {
            const a_levelLearnedAt = a.version_group_details.find(({ version_group }) => version_group.name === currentVersion).level_learned_at
            const b_levelLearnedAt = b.version_group_details.find(({ version_group }) => version_group.name === currentVersion).level_learned_at
            return a_levelLearnedAt === b_levelLearnedAt ? 0 : a_levelLearnedAt > b_levelLearnedAt ? 1 : -1
        })
    }, [currentVersion])

    const tabs = [
        {
            moves: sortMovesByLevel(filterMovesByVersion(movesByLevelUp, currentVersion)),
            label: "By Level Up",
        },
        {
            moves: sortMovesByLevel(filterMovesByVersion(movesByBreeding, currentVersion)),
            label: "By Breeding",
        },
        { moves: sortMovesByLevel(filterMovesByVersion(movesByTM, currentVersion)), label: "By TM" },
    ].filter(tab => tab.moves?.length ?? 0 > 0)

    return (
        <Layout>
            <Head>
                <title>{titleCase(pokemon.name)}</title>
            </Head>

            <Box flex={"row"}>
                <Typography variant="h1" sx={{ textTransform: 'capitalize' }}>{pokemon.name}</Typography>
                <Select
                    value={currentVersion}
                    onChange={onVersionChange}
                >
                    {availableGens.map((generation: string) => (
                        <MenuItem key={generation}
                                  value={generation}>
                            {generationToDisplayName[generation]}
                        </MenuItem>
                    ))}
                </Select>
            </Box>

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
                                {tabs[currentMoveTab].label === "By Level Up" && <TableCell>Level</TableCell>}
                                <TableCell>Name</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Description</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tabs[currentMoveTab].moves.slice(currentMoveTablePage * movesPerPage, movesPerPage * (currentMoveTablePage + 1)).map(move => {
                                    const moveEntry = move.effect_entries.find(entry => entry.language.name === "en") || move.flavor_text_entries.find(entry => entry.language.name === "en");
                                    const moveName = titleCase(move.name.replace('-', " "));
                                    const version_details = move.version_group_details.find(version_details => version_details.version_group.name === currentVersion)

                                    return (
                                        <TableRow key={move.name}>
                                            {tabs[currentMoveTab].label === "By Level Up" &&
                                                <TableCell>{version_details.level_learned_at}</TableCell>}
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


const filterMoves = (moves, learnMethod) => {
    return moves.filter(move => move.version_group_details.filter(version => version.move_learn_method.name === learnMethod).length > 0) || []
}


export const getStaticProps = async ({ params }) => {

    const pokemon = getPokemon(params.name)

    const abilities = await Promise.all(
        pokemon.abilities.map(async ({ ability }) => {
            return getAbility(ability.name)
        }),
    );


    const moves = pokemon.moves.map(({ move, version_group_details }) => {
        return { ...getMove(move.name), version_group_details }
    })

    const movesByLevelUp = filterMoves(moves, 'level-up')
    const movesByBreeding = filterMoves(moves, 'egg')
    const movesByTM = filterMoves(moves, 'machine')

    const availableGens = new Set<string>()

    pokemon.moves
        .flatMap(({ version_group_details }) => version_group_details)
        .map(({ version_group }) => {
            availableGens.add(version_group.name)
        })


    return {
        props: {
            pokemon: { ...pokemon, abilities },
            movesByLevelUp,
            movesByBreeding,
            movesByTM,
            availableGens: Array.from(availableGens),
        },
    };
}

export const getStaticPaths = async () => {
    return {
        paths: pokemon.map(pokemon => ({ params: { name: pokemon.name } })),
        fallback: false,
    }
}
