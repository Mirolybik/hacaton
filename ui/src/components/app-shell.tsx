import { Box, Container, Flex, Heading, HStack, Text } from '@chakra-ui/react';
import type { ReactNode } from 'react';

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <Flex direction="column" minH="100dvh" bg="bg.subtle">
      <Box
        as="header"
        position="sticky"
        top="0"
        zIndex="docked"
        bg="bg.panel"
        borderBottomWidth="1px"
      >
        <Container maxW="6xl">
          <Flex align="center" justify="space-between" h="16">
            <HStack gap="3">
              <Box boxSize="8" borderRadius="lg" bg="brand.solid" />
              <Heading size="md">Hacaton</Heading>
            </HStack>
            <Text fontSize="sm" color="fg.muted">
              React · Chakra UI · Axios
            </Text>
          </Flex>
        </Container>
      </Box>

      <Container maxW="6xl" flex="1" py="8">
        {children}
      </Container>

      <Box as="footer" bg="bg.panel" borderTopWidth="1px">
        <Container maxW="6xl" py="4">
          <Text fontSize="sm" color="fg.muted">
            Hacaton UI skeleton
          </Text>
        </Container>
      </Box>
    </Flex>
  );
}
