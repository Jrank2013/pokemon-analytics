import '../styles/globals.css'
import CssBaseline from '@mui/material/CssBaseline';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function MyApp({Component, pageProps}) {
    return (
        <>
            <CssBaseline/>
            <Component {...pageProps} />
        </>
    )
}

export default MyApp
