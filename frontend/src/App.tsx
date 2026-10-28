import { Box, ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { AppHeader } from './components/app-header';
import { HomePage } from './pages/home-page';

export default function App() {
  return (
    <ChakraProvider value={defaultSystem}>
      <Box minH="100dvh" bg="bg.subtle">
        <AppHeader />
        <Box
          as="main"
          maxW="6xl"
          mx="auto"
          px={{ base: '4', md: '6' }}
          py={{ base: '8', md: '12' }}
        >
          <HomePage />
        </Box>
      </Box>
    </ChakraProvider>
  );
}
