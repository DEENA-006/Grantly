export function getGoogleCalendarUrl(
  title: string,
  deadline: string,
  organization: string,
  applicationUrl: string
): string {
  // Convert deadline YYYY-MM-DD into YYYYMMDD
  const dateFormatted = deadline.replace(/-/g, "");
  // Set start and end for the deadline day
  const dates = `${dateFormatted}T090000Z/${dateFormatted}T180000Z`;
  
  const text = encodeURIComponent(`[Deadline] ${title} - ${organization}`);
  const details = encodeURIComponent(
    `Scholarship Application Deadline\n\nOrganization: ${organization}\nApply here: ${applicationUrl}\n\nManaged with Grantly.`
  );
  const location = encodeURIComponent(applicationUrl);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}&location=${location}`;
}

export function downloadIcsFile(
  title: string,
  deadline: string,
  organization: string,
  applicationUrl: string
) {
  const dateFormatted = deadline.replace(/-/g, "");
  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Grantly//Scholarship Tracker//EN",
    "BEGIN:VEVENT",
    `SUMMARY:[Deadline] ${title} - ${organization}`,
    `DESCRIPTION:Scholarship application deadline for ${title}. Apply: ${applicationUrl}`,
    `URL:${applicationUrl}`,
    `DTSTART;VALUE=DATE:${dateFormatted}`,
    `DTEND;VALUE=DATE:${dateFormatted}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${title.replace(/\s+/g, "_")}_deadline.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

