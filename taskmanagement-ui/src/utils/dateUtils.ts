import { formatInTimeZone } from 'date-fns-tz';
import { formatDistanceToNow as dateFnsFormatDistance } from 'date-fns';

const VIETNAM_TZ = 'Asia/Ho_Chi_Minh';

export const formatVietnamTime = (dateString: string | Date | null | undefined): string => {
  if (!dateString) return 'N/A';
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return formatInTimeZone(date, VIETNAM_TZ, 'dd/MM/yyyy HH:mm:ss');
  } catch (e) {
    return 'Invalid Date';
  }
};

export const formatVietnamDateOnly = (dateString: string | Date | null | undefined): string => {
  if (!dateString) return 'N/A';
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return formatInTimeZone(date, VIETNAM_TZ, 'dd/MM/yyyy');
  } catch (e) {
    return 'Invalid Date';
  }
};

export const formatDistanceToNowVN = (dateString: string | Date | null | undefined): string => {
  if (!dateString) return 'Unknown';
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return dateFnsFormatDistance(date, { addSuffix: true });
  } catch (e) {
    return 'Unknown';
  }
};
