import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import moment from 'moment';

export default function usePeriodTracker() {
  const { lastPeriodDate, cycleLength = 28, periodLength = 5 } = useSelector((s: RootState) => s.period);

  const today = moment().startOf('day');
  const lastPeriod = moment(lastPeriodDate || new Date()).startOf('day');
  const daysPassed = today.diff(lastPeriod, 'days') || 0;

  // Flatten logic for repeating cycles
  let currentDay = 0;
  if (daysPassed >= 0) {
    currentDay = (daysPassed % cycleLength) + 1;
  } else {
    const cycleDiff = (-daysPassed - 1) % cycleLength;
    currentDay = cycleLength - cycleDiff;
  }

  // Determine phase
  let phase: 'period' | 'follicular' | 'ovulation' | 'luteal' = 'luteal';
  const ovulationDay = cycleLength - 14;

  if (currentDay <= periodLength) {
    phase = 'period';
  } else if (currentDay <= ovulationDay - 2) {
    phase = 'follicular';
  } else if (currentDay <= ovulationDay + 1) {
    phase = 'ovulation';
  } else {
    phase = 'luteal';
  }

  // Days until next period
  const daysUntilNext = currentDay <= periodLength 
    ? periodLength - currentDay + 1 
    : cycleLength - currentDay + 1;

  // Status message
  const statusMessage = currentDay <= periodLength 
    ? `Period: Day ${currentDay}` 
    : phase === 'ovulation' 
    ? 'Ovulation Day' 
    : `Next period in ${daysUntilNext} days`;

  // Pregnancy chance
  let pregnancyChance = 'Low';
  if (currentDay >= ovulationDay - 5 && currentDay <= ovulationDay + 1) {
    pregnancyChance = 'High';
  } else if (currentDay >= ovulationDay - 7 && currentDay <= ovulationDay + 2) {
    pregnancyChance = 'Medium';
  }

  return {
    currentDay,
    phase,
    daysUntilNext,
    pregnancyChance,
    statusMessage,
    lastPeriodDate,
    cycleLength,
    periodLength
  };
}
