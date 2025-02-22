import axios from "axios";

const clientId: string = process.env.VUE_APP_CLIENT_ID || "";
const clientSecret: string = process.env.VUE_APP_CLIENT_SECRET || "";
const refreshToken: string = process.env.VUE_APP_REFRESH_TOKEN || "";
const calendarId: string = process.env.VUE_APP_CALENDAR_ID || "";

let accessToken =
  "";

// Definição da interface para um evento do Google Calendar
interface CalendarEvent {
  summary: string;
  description?: string;
  startDateTime: string;
  endDateTime: string;
}

// Função para renovar o token de acesso
async function refreshAccessToken(): Promise<string | undefined> {
  const data = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });

  try {
    const response = await axios.post<{ access_token: string }>(
      "https://oauth2.googleapis.com/token",
      data,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    accessToken = response.data.access_token;
    return accessToken;
  } catch (error: any) {
    console.error("Erro ao renovar token:", error.response?.data || error);
  }
}

// Função para buscar eventos do Google Calendar
async function fetchEvents(): Promise<any[]> {
  try {
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);
    console.log('token' + accessToken)
    const response = await axios.get<{ items: any[] }>(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: {
          timeMin: now.toISOString(),
          timeMax: nextWeek.toISOString(),
          showDeleted: false,
          singleEvents: true,
          orderBy: "startTime",
        },
      }
    );
    return response.data.items;
  } catch (error: any) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log("Token expirado, tentando renovar...");
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) return fetchEvents();
    } else {
      console.error("Erro ao buscar eventos:", error.response?.data || error);
    }
    return [];
  }
}

// Função para criar um evento no Google Calendar
async function createEvent(eventData: CalendarEvent): Promise<any | void> {
  try {
    const response = await axios.post(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
      {
        description: eventData.description,
        summary: eventData.summary,
        start: {
          dateTime: eventData.startDateTime,
          timeZone: "America/Fortaleza",
        },
        end: {
          dateTime: eventData.endDateTime,
          timeZone: "America/Fortaleza",
        },
        sendUpdates: "all",
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      console.log("Token expirado, tentando renovar...");
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) return createEvent(eventData);
    }
    console.error("Erro ao criar evento:", error.response?.data || error);
  }
}

export { fetchEvents, createEvent };
