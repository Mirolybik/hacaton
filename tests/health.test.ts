import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { createApp } from '../src/app.js';

describe('GET /api/health', () => {
  it('returns service status', async () => {
    const response = await request(createApp()).get('/api/health').expect(200);

    expect(response.body).toMatchObject({ status: 'ok' });
    expect(typeof response.body.uptime).toBe('number');
  });
});

describe('unknown route', () => {
  it('returns 404 with an error payload', async () => {
    const response = await request(createApp()).get('/api/unknown').expect(404);

    expect(response.body.error).toMatchObject({
      statusCode: 404,
      message: 'Route GET /api/unknown not found',
    });
  });
});
