import { BetaAnalyticsDataClient } from '@google-analytics/data';

const propertyId = process.env.GA4_PROPERTY_ID;

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GA_CLIENT_EMAIL,
    private_key: process.env.GA_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
});

export async function fetchReport({
  dimensions,
  metrics,
  startDate = '30daysAgo',
  endDate = 'today',
  limit = 10,
}: {
  dimensions: { name: string }[];
  metrics: { name: string }[];
  startDate?: string;
  endDate?: string;
  limit?: number;
}) {
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate, endDate }],
    dimensions,
    metrics,
    limit,
  });

  return response;
}