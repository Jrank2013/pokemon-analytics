import {Chip} from "@mui/material";
import titleCase from "voca/title_case";
import * as React from "react";

const typeColors = {
    'fire': '#fd7d24',
    'fairy': '#fdb9e9',
    'grass': '#9bcc50',
    "normal": "#a4acaf",
    "fighting": "#d56723",
    "flying": "#3dc7ef",
    "poison": "#b97fc9",
    "ground": "#53a3cf",
    "rock": "#a38c21",
    "bug": "#729f3f",
    "ghost": "#7b62a3",
    "steel": "#9eb7b8",
    "water": "#4592c4",
    "electric": "#eed535",
    "psychic": "#f366b9",
    "ice": "#51c4e7",
    "dragon": "#53a3cf",
    "dark": "#707070",
}

interface Props {
    type: string
}

const TypeChip: React.FC<Props> = ({type}) => {
    return (
        <Chip color="primary" label={titleCase(type)}
              sx={{backgroundColor: typeColors[type]}}/>
    )
}

export default TypeChip