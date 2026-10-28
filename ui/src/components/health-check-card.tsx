import { Badge, Button, Card, Code, HStack, Spinner, Stack, Text } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { env } from '../config/env';
import { getHealth } from '../services/health.service';

type Status = 'loading' | 'ok' | 'error';

const statusMeta: Record<Status, { label: string; palette: string }> = {
  loading: { label: 'Проверка…', palette: 'blue' },
  ok: { label: 'API доступен', palette: 'green' },
  error: { label: 'API недоступен', palette: 'red' },
};

async function requestHealth(): Promise<Status> {
  try {
    const health = await getHealth();
    return health.status === 'ok' ? 'ok' : 'error';
  } catch {
    return 'error';
  }
}

export function HealthCheckCard() {
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    let cancelled = false;

    void requestHealth().then((next) => {
      if (!cancelled) {
        setStatus(next);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const check = useCallback(async () => {
    setStatus('loading');
    setStatus(await requestHealth());
  }, []);

  const meta = statusMeta[status];

  return (
    <Card.Root maxW="lg" w="full">
      <Card.Header>
        <HStack justify="space-between" gap="4">
          <Card.Title>Проверка API</Card.Title>
          <Badge colorPalette={meta.palette} variant="subtle">
            {meta.label}
          </Badge>
        </HStack>
      </Card.Header>

      <Card.Body>
        <Stack gap="4">
          <Text color="fg.muted">
            Запрос к <Code>{env.apiUrl}/health</Code>
          </Text>

          {status === 'loading' ? <Spinner size="sm" /> : null}

          <Button
            alignSelf="flex-start"
            colorPalette="brand"
            disabled={status === 'loading'}
            onClick={() => void check()}
          >
            Проверить снова
          </Button>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}
