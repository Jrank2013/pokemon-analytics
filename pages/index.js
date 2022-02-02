import axios from "axios";
import Link from 'next/link';

export default function Home({pokemon}) {
    return (
        <>
            <h1>Welcome to the premier place for quick pokemon stats analytics</h1>
            <ol>
                {pokemon.map(pokemon => (
                    <li key={pokemon.name}><Link href={`/pokemon/${pokemon.name}`}><a>{pokemon.name}</a></Link></li>))}
            </ol>
        </>
    )
}


export const getStaticProps = async () => {
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
        props: {pokemon}
    }

}
