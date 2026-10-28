import { Badge, Box, Flex, Heading, HStack, Text } from '@chakra-ui/react';
import { appConfig } from '../config/app-config';

export function AppHeader() {
  return (
    <Box
      as="header"
      borderBottomWidth="2px"
      bg="bg.panel"
      position="sticky"
      top="0"
      zIndex="docked"
    >
      <Flex
        maxW="6xl"
        mx="auto"
        px={{ base: '4', md: '6' }}
        py="4"
        align="center"
        justify="space-between"
        gap="4"
      >
          
          </Flex>
          <Box>
            <Heading size="md">{appConfig.appName}</Heading>
            <Text fontSize="xs" color="fg.muted">
              React · Chakra UI · Axios
            </Text>
          </Box>
        </HStack>
        <Badge colorPalette="teal" variant="subtle">
          API ready
        </Badge>
      </Flex>
    </Box>
  );
}
