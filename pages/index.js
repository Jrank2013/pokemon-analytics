import Link from 'next/link';
import Layout from "../components/layout";
import { pokemon } from "../lib/api";

export default function Home({ pokemon }) {
    return (
        <Layout>
            <h1>Welcome to the premier place for quick pokemon stats analytics</h1>
            <ol>
                {pokemon.map(pokemon => (
                    <li key={pokemon.name}><Link href={`/pokemon/${pokemon.name}`}><a>{pokemon.name}</a></Link></li>))}
            </ol>
        </Layout>
    )
}


export const getStaticProps = async () => {

    return {
        props: { pokemon },
    }

}
