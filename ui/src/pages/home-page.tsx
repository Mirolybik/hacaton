import { Button, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { HealthCheckCard } from '../components/health-check-card';

export function HomePage() {
  return (
    <Flex direction="column" align="center" gap="10" py={{ base: '6', md: '12' }}>
      <Stack gap="4" textAlign="center" maxW="2xl">
        <Heading size="3xl">Hacaton UI</Heading>
        <Text color="fg.muted" fontSize="lg">
          Базовый каркас фронтенда: React, Chakra UI и Axios.
        </Text>
        <Button colorPalette="brand" size="lg" asChild alignSelf="center">
          <a href="https://chakra-ui.com" target="_blank" rel="noreferrer">
            Документация Chakra UI
          </a>
        </Button>
      </Stack>

      <HealthCheckCard />
    </Flex>
  );
}
