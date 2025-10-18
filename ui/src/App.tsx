import { createTheme, ThemeProvider } from '@mui/material';
import './App.css';
import { VoteTabs } from './VoteTabs';
import { ThemedToaster } from './ThemedToaster';

function App() {
    const theme = createTheme({
        colorSchemes: { dark: true, light: true },
        defaultColorScheme: 'dark',
        cssVariables: true,
    });
    return (
        <ThemeProvider theme={theme}>
            <VoteTabs />
            <ThemedToaster />
        </ThemeProvider>
    );
}

export default App;
