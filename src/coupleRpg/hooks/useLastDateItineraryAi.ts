import { useCallback, useEffect, useState } from 'react';
import { AI_RECORDS_CHANGED_EVENT } from '../lib/aiRecordsConfig';
import { loadLastDateItineraryAi, type SavedDateItineraryAi } from '../storage/dateItineraryAiCache';

export function useLastDateItineraryAi(): SavedDateItineraryAi | null {
  const [record, setRecord] = useState<SavedDateItineraryAi | null>(() => loadLastDateItineraryAi());

  const sync = useCallback(() => {
    setRecord(loadLastDateItineraryAi());
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener(AI_RECORDS_CHANGED_EVENT, sync);
    return () => window.removeEventListener(AI_RECORDS_CHANGED_EVENT, sync);
  }, [sync]);

  return record;
}
