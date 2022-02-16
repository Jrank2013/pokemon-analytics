import Link from "next/link"
import { Grid } from "@mui/material";

const NavBar = () => {

    return (
        <>
            <p>Pokemon Analytics</p>
            <Grid component={"nav"} container wrap={'wrap'} paddingX={4}
                  paddingY={2}
                  spacing={{ xs: 4, sm: 4, md: 4, xl: 8 }}
                  direction={'row'}>

                <Grid item><Link href={"/"}>Home</Link></Grid>
                <Grid item><Link href={"/pokemon"}>Pokemon</Link></Grid>
                <Grid item><Link href={"/moves"}>Moves</Link></Grid>
                <Grid item><Link href={"/items"}>Items</Link></Grid>
            </Grid>
        </>
    )
}


export default NavBar