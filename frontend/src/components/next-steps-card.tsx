import { Card, Code, Stack, Text } from '@chakra-ui/react';

const EXAMPLE = `// src/api/tasks.ts
import { api } from './client';

export interface Task {
  id: string;
  title: string;
}

export async function getTasks(): Promise<Task[]> {
  const { data } = await api.get<Task[]>('/tasks');
  return data;
}`;

export function NextStepsCard() {
  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>Как добавить эндпоинт</Card.Title>
        <Text fontSize="sm" color="fg.muted" mt="1">
          Типизированный клиент уже настроен — добавьте модуль рядом с health.ts
        </Text>
      </Card.Header>
      <Card.Body>
        <Stack gap="4">
          <Code
            display="block"
            whiteSpace="pre"
            overflowX="auto"
            p="4"
            borderRadius="md"
            fontSize="sm"
          >
            {EXAMPLE}
          </Code>
          <Text fontSize="sm" color="fg.muted">
            Ошибки API автоматически приводятся к <Code size="sm">ApiError</Code>, поэтому в
            компонентах достаточно обрабатывать один тип исключения.
          </Text>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}
