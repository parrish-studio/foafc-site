/**
 * Current conditions from the US National Weather Service.
 *
 * Chosen because it needs no API key and never will: there is no account to
 * create, no secret to put in the hosting dashboard, and nothing to expire
 * after a handover. For a site that changes maintainer, that matters more than
 * a slightly nicer API.
 *
 * It is fetched server-side rather than from the browser because NWS asks for a
 * User-Agent identifying the caller, and browsers forbid scripts from setting
 * one. Going through our own endpoint also means a single upstream request can
 * be cached and served to every visitor.
 *
 * Framework-free on purpose — this file could move to a package unchanged.
 */

/**
 * Identifies us to NWS, as their terms ask. A contact address is requested so
 * they can reach the operator of a misbehaving client.
 */
const USER_AGENT = '(friendsofafiercechase.org, friendsofafiercechase@gmail.com)';

export interface WeatherHour {
  /** ISO timestamp of the hour. */
  time: string;
  /** Short label for display, e.g. "10 AM". */
  label: string;
  temperature: number;
}

export interface Weather {
  temperature: number;
  /** "F" or "C", as reported. */
  unit: string;
  /** Human-readable conditions, e.g. "Mostly Cloudy". */
  conditions: string;
  /** Already formatted by NWS, e.g. "5 mph". */
  windSpeed: string;
  /** Compass direction, e.g. "W". May be absent. */
  windDirection?: string;
  /** Percent, if reported. */
  humidity?: number;
  /** Percent chance of precipitation, if reported. */
  precipitation?: number;
  /** When this hour's forecast starts. */
  observedAt: string;
  /** The next few hours, for a small forecast strip. */
  hours: WeatherHour[];
}

interface NwsPeriod {
  startTime: string;
  temperature: number;
  temperatureUnit: string;
  shortForecast: string;
  windSpeed: string;
  windDirection?: string;
  relativeHumidity?: { value: number | null };
  probabilityOfPrecipitation?: { value: number | null };
}

const headers = { 'User-Agent': USER_AGENT, Accept: 'application/geo+json' };

async function getJson(url: string): Promise<unknown> {
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`NWS responded ${response.status} for ${url}`);
  }
  return response.json();
}

const hourLabel = (iso: string, timeZone: string): string =>
  new Intl.DateTimeFormat('en-US', { hour: 'numeric', timeZone }).format(new Date(iso));

/**
 * Fetches current conditions and the next few hours for a point.
 *
 * Two requests: NWS maps coordinates to a forecast grid, then the grid to a
 * forecast. The grid assignment is resolved each time rather than hard-coded,
 * so the widget keeps working if NWS reorganises its grids.
 *
 * Throws on any failure. Callers are expected to degrade rather than retry —
 * a missing temperature should never take a page down.
 */
export async function getWeather(
  latitude: number,
  longitude: number,
  { hours = 5, timeZone = 'America/New_York' } = {},
): Promise<Weather> {
  const point = (await getJson(
    `https://api.weather.gov/points/${latitude},${longitude}`,
  )) as { properties?: { forecastHourly?: string } };

  const hourlyUrl = point.properties?.forecastHourly;
  if (!hourlyUrl) {
    throw new Error('NWS did not return an hourly forecast URL for this point');
  }

  const forecast = (await getJson(hourlyUrl)) as { properties?: { periods?: NwsPeriod[] } };
  const periods = forecast.properties?.periods ?? [];
  const now = periods[0];
  if (!now) {
    throw new Error('NWS returned no forecast periods');
  }

  return {
    temperature: Math.round(now.temperature),
    unit: now.temperatureUnit,
    conditions: now.shortForecast,
    windSpeed: now.windSpeed,
    windDirection: now.windDirection,
    humidity: now.relativeHumidity?.value ?? undefined,
    precipitation: now.probabilityOfPrecipitation?.value ?? undefined,
    observedAt: now.startTime,
    hours: periods.slice(1, hours + 1).map((period) => ({
      time: period.startTime,
      label: hourLabel(period.startTime, timeZone),
      temperature: Math.round(period.temperature),
    })),
  };
}
