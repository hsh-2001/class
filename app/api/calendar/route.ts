import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  const session: any = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Not logged in" }, { status: 401 });
  }

  const auth = new google.auth.OAuth2();
  auth.setCredentials({
    access_token: session.accessToken,
  });

  const calendar = google.calendar({ version: "v3", auth });

  const res = await calendar.events.list({
    calendarId: "primary",
    maxResults: 10,
  });

  return Response.json(res.data);
}