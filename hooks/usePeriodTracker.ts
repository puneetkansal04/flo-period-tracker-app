import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { updatePeriodData as updatePeriodDataAction } from '@/store/slices/periodSlice';

export interface PeriodCalculations {
  currentDay: number;
  nextPeriodDate: Date;
  ovulationDate: Date;
  fertileWindowStart: Date;
  fertileWindowEnd: Date;
  statusText: string;
  chancesOfPregnancy: string;
}

export function usePeriodTracker() {
  const dispatch = useDispatch();
  const data = useSelector((state: RootState) => state.period);

  const [calculations, setCalculations] = useState<PeriodCalculations>({
    currentDay: 1,
    nextPeriodDate: new Date(),
    ovulationDate: new Date(),
    fertileWindowStart: new Date(),
    fertileWindowEnd: new Date(),
    statusText: '',
    chancesOfPregnancy: 'Low',
  });

  useEffect(() => {
    calculateCycle();
  }, [data]);

  const calculateCycle = () => {
    const today = new Date();
    const lastPeriod = new Date(data.lastPeriodDate);
    
    // Reset time for accurate day difference
    today.setHours(0, 0, 0, 0);
    lastPeriod.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(today.getTime() - lastPeriod.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Day 1 is the start day

    const currentDay = ((diffDays - 1) % data.cycleLength) + 1;

    const nextPeriodDate = new Date(lastPeriod);
    nextPeriodDate.setDate(lastPeriod.getDate() + data.cycleLength);

    const ovulationDate = new Date(lastPeriod);
    ovulationDate.setDate(lastPeriod.getDate() + data.cycleLength - 14);

    const fertileWindowStart = new Date(ovulationDate);
    fertileWindowStart.setDate(ovulationDate.getDate() - 5);

    const fertileWindowEnd = new Date(ovulationDate);
    fertileWindowEnd.setDate(ovulationDate.getDate() + 1);

    // Determine status text
    let statusText = '';
    if (currentDay <= data.periodLength) {
      statusText = `Period: Day ${currentDay}`;
    } else {
      const daysUntilPeriod = data.cycleLength - currentDay + 1;
      statusText = `Period in ${daysUntilPeriod} days`;
    }

    // Determine chances of pregnancy
    let chancesOfPregnancy = 'Low';
    if (today >= fertileWindowStart && today <= fertileWindowEnd) {
      chancesOfPregnancy = 'High';
    } else if (today >= new Date(fertileWindowStart.getTime() - 2 * 24 * 60 * 60 * 1000) && today <= fertileWindowEnd) {
      chancesOfPregnancy = 'Medium';
    }

    setCalculations({
      currentDay,
      nextPeriodDate,
      ovulationDate,
      fertileWindowStart,
      fertileWindowEnd,
      statusText,
      chancesOfPregnancy,
    });
  };

  const updatePeriodData = (newData: Partial<typeof data>) => {
    dispatch(updatePeriodDataAction(newData));
  };

  return {
    data,
    calculations,
    updatePeriodData,
  };
}
