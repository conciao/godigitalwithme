"use client";

import React, { useState } from "react";
import { Reservation } from "@/types/database";

interface CalendarGridProps {
  reservations: Reservation[];
}

export default function CalendarGrid({ reservations }: CalendarGridProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const days = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return (reservations || []).filter(r => r?.event_date === dateStr);
  };

  const dayCells = [];
  for (let i = 0; i < startDay; i++) {
    dayCells.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
  }
  for (let d = 1; d <= days; d++) {
    const events = getEventsForDay(d);
    dayCells.push(
      <div key={d} className="calendar-day">
        <span className="day-number">{d}</span>
        <div className="day-events">
          {events.map(e => (
            <div key={e.id} className={`calendar-event ${e.status || ""}`} title={`${e.client_name || "Guest"} - ${e.event_type || "Event"}`}>
              {(e.client_name || "Guest").split(" ")[0]}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="calendar-container stat-card shadow-lg">
      <div className="calendar-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#fff" }}>{monthNames[month]} {year}</h3>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button onClick={prevMonth} className="btn btn--ghost" style={{ padding: "0.3rem 0.6rem" }}>←</button>
          <button onClick={() => setCurrentDate(new Date())} className="btn btn--ghost" style={{ padding: "0.3rem 0.6rem" }}>Today</button>
          <button onClick={nextMonth} className="btn btn--ghost" style={{ padding: "0.3rem 0.6rem" }}>→</button>
        </div>
      </div>

      <div className="calendar-grid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div key={day} className="calendar-weekday">{day}</div>
        ))}
        {dayCells}
      </div>
    </div>
  );
}
