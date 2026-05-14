import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PeriodData {
  lastPeriodDate: Date;
  cycleLength: number;
  periodLength: number;
}

export interface PeriodCalculations {
  currentDay: number;
  nextPeriodDate: Date;
  ovulationDate: Date;
  fertileWindowStart: Date;
  fertileWindowEnd: Date;
  statusText: string;
  chancesOfPregnancy: string;
}

const STORAGE_KEY = '@period_tracker_data';

export function usePeriodTracker(initialData?: Partial<PeriodData>) {
  const [data, setData] = useState<PeriodData>({
    lastPeriodDate: initialData?.lastPeriodDate || new Date(),
    cycleLength: initialData?.cycleLength || 28,
    periodLength: initialData?.periodLength || 5,
  });

  const [calculations, setCalculations] = useState<PeriodCalculations>({
    currentDay: 1,
    nextPeriodDate: new Date(),
    ovulationDate: new Date(),
    fertileWindowStart: new Date(),
    fertileWindowEnd: new Date(),
    statusText: '',
    chancesOfPregnancy: 'Low',
  });

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedData = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedData) {
          const parsed = JSON.parse(storedData);
          setData({
            lastPeriodDate: new Date(parsed.lastPeriodDate),
            cycleLength: parsed.cycleLength,
            periodLength: parsed.periodLength,
          });
        }
      } catch (e) {
        console.error('Failed to load period data', e);
      }
    };
    loadData();
  }, []);

  // Recalculate whenever data changes
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

  const updatePeriodData = async (newData: Partial<PeriodData>) => {
    const updated = { ...data, ...newData };
    setData(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save period data', e);
    }
  };

  return {
    data,
    calculations,
    updatePeriodData,
  };
}
