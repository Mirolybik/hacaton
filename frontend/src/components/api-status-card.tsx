import {
  Alert,
  Badge,
  Button,
  Card,
  Code,
  Flex,
  HStack,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useHealthCheck } from '../hooks/use-health-check';

const STATUS_LABELS = {
  idle: 'Не проверено',
  loading: 'Проверка…',
  success: 'Online',
  error: 'Offline',
} as const;

const STATUS_COLORS = {
  idle: 'gray',
  loading: 'blue',
  success: 'green',
  error: 'red',
} as const;

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('ru-RU', { timeStyle: 'medium' }).format(date);
}

export function ApiStatusCard() {
  const { status, data, error, latencyMs, checkedAt, check } = useHealthCheck();
  const isLoading = status === 'loading';

  return (
    <Card.Root>
      <Card.Header>
        <Flex justify="space-between" align="flex-start" gap="3">
          <Stack gap="1">
            <Card.Title>Соединение с API</Card.Title>
            <Text fontSize="sm" color="fg.muted">
              Проверка эндпоинта <Code size="sm">GET /api/health</Code>
            </Text>
          </Stack>
          <Badge colorPalette={STATUS_COLORS[status]} variant="subtle">
            {STATUS_LABELS[status]}
          </Badge>
        </Flex>
      </Card.Header>

      <Card.Body>
        <Stack gap="4">
          {status === 'success' && (
            <Alert.Root status="success" borderRadius="md">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>Бэкенд отвечает</Alert.Title>
                <Alert.Description>
                  Статус: {data?.status ?? 'ok'}
                  {latencyMs !== undefined && ` · ${latencyMs} мс`}
                </Alert.Description>
              </Alert.Content>
            </Alert.Root>
          )}

          {status === 'error' && (
            <Alert.Root status="error" borderRadius="md">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>{error?.message ?? 'Ошибка запроса'}</Alert.Title>
                <Alert.Description>
                  {error?.code && `Код: ${error.code}. `}
                  Убедитесь, что бэкенд запущен на порту 3000.
                </Alert.Description>
              </Alert.Content>
            </Alert.Root>
          )}

          <HStack justify="space-between" fontSize="sm" color="fg.muted">
            <Text>Последняя проверка</Text>
            <Text>{checkedAt ? formatTime(checkedAt) : '—'}</Text>
          </HStack>

          <Button
            alignSelf="flex-start"
            colorPalette="teal"
            loading={isLoading}
            loadingText="Проверяем…"
            onClick={() => void check()}
          >
            Проверить снова
          </Button>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}
