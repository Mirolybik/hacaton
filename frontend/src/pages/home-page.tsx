import { Box, Heading, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { ApiStatusCard } from '../components/api-status-card';
import { NextStepsCard } from '../components/next-steps-card';

export function HomePage() {
  return (
    <Stack gap="8">
      <Box>
        <Heading size="2xl" mb="2">
          
        </Heading>
        <Text color="fg.muted">
          
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 1, lg: 2 }} gap="6">
        <ApiStatusCard />
        <NextStepsCard />
      </SimpleGrid>
    </Stack>
  );
}
