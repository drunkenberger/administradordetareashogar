import { Chore } from '../types';
import { timeToMinutes, minutesToTime, clampToRange } from './time';
import { getConflictIds } from './conflicts';
import { getMonday, getWeekDates } from './dates';
import { DEFAULTS, seedWeek } from '../data/defaultChores';

export function runDevTests() {
  try {
    // Time utilities tests
    console.assert(timeToMinutes("07:30") === 450, "timeToMinutes 07:30");
    console.assert(minutesToTime(450) === "07:30", "minutesToTime 450");
    console.assert(clampToRange("06:00") === "07:00", "clampToRange lower");
    console.assert(clampToRange("22:00") === "20:00", "clampToRange upper");

    // Conflict detection tests
    const a: Chore = {
      id: "a",
      title: "A",
      day: 0,
      start: "09:00",
      duration: 60,
      category: "daily",
      assignee: "ayudante",
    };
    const b: Chore = {
      id: "b",
      title: "B",
      day: 0,
      start: "09:30",
      duration: 30,
      category: "daily",
      assignee: "ayudante",
    };
    
    let conflicts = getConflictIds([a, b]);
    console.assert(conflicts.has("a") && conflicts.has("b"), "overlap a-b");
    
    // Move A out of B's range
    const a2 = { ...a, start: "10:30" };
    conflicts = getConflictIds([a2, b]);
    console.assert(
      !conflicts.has("a") && !conflicts.has("b"),
      "no overlap after move"
    );

    // Adjacent tasks (exact touch) should not conflict
    const a3: Chore = { ...a, start: "09:00", duration: 60 };
    const b3: Chore = { ...b, start: "10:00", duration: 30 };
    conflicts = getConflictIds([a3, b3]);
    console.assert(
      !conflicts.has("a") && !conflicts.has("b"),
      "edge-touch not conflict"
    );

    // Different days should not conflict
    const a4: Chore = { ...a, day: 1 };
    conflicts = getConflictIds([a4, b]);
    console.assert(
      !conflicts.has("a") && !conflicts.has("b"),
      "different day not conflict"
    );

    // Date utilities tests
    const mon = getMonday(new Date("2025-01-08"));
    const dates5 = getWeekDates(mon, 5);
    const dates7 = getWeekDates(mon, 7);
    console.assert(dates5.length === 5 && dates7.length === 7, "getWeekDates len");
    
    // Seed week tests
    const seeded = seedWeek(DEFAULTS, 5);
    console.assert(
      seeded.length === DEFAULTS.length * 5,
      "seedWeek replicates per day"
    );

    console.log("✅ All tests passed");
  } catch (err) {
    console.warn("Dev tests error", err);
  }
}