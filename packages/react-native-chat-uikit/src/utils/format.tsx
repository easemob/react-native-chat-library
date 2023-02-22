import format from 'date-fns/format';

type TruncateMode = 'head' | 'mid' | 'tail';
type TruncateParams = {
  content: string;
  mode?: TruncateMode | undefined;
  maxLen?: number | undefined;
  separator?: string | undefined;
};

/**
 * String content truncate util.
 *
 * @param param0 truncate params
 * @returns string
 */
export function truncateContent({
  content,
  mode = 'tail',
  maxLen = 40,
  separator = '...',
}: TruncateParams): string {
  if (content.length <= maxLen) return content;

  if (mode === 'head') {
    return separator + content.slice(-maxLen);
  }

  if (mode === 'mid') {
    const lead = Math.ceil(maxLen / 2);
    const trail = Math.floor(maxLen / 2);
    return content.slice(0, lead) + separator + content.slice(-trail);
  }

  if (mode === 'tail') {
    return content.slice(0, maxLen) + separator;
  }

  throw new Error('Invalid truncate mode: ' + mode);
}

/**
 * Badge count truncate util
 * If count exceed the limit, it comes in the form of "MAX+"
 *
 * @param {number} count
 *
 * @param {number} MAX default 99
 * @returns {string}
 */
export function truncatedBadgeCount(count: number, MAX: number = 99): string {
  if (count >= MAX) return `${MAX}+`;
  return `${count}`;
}

export function getDateTimePoint() {
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth();
  const year = now.getFullYear();
  const yesterdayEnd = new Date(year, month, day, 0);
  const yesterMonthEnd = new Date(year, month, 1);
  const yesterYearEnd = new Date(year, 0);
  return {
    now: now,
    yesterday: yesterdayEnd,
    yesterMonth: yesterMonthEnd,
    yesterYear: yesterYearEnd,
  };
}

export function messageTimestamp(date: Date | number, locale?: Locale): string {
  const align = (c: number) => {
    if (c < 10) {
      return `0${c}`;
    }
    return c.toString();
  };
  let _date: Date;
  if (typeof date === 'number') {
    _date = new Date(date);
  } else {
    _date = date;
  }
  const r = getDateTimePoint();
  if (_date < r.yesterYear) {
    return `${_date.getFullYear()}`;
  } else if (r.yesterYear <= _date && _date < r.yesterMonth) {
    return `${align(_date.getMonth()) + 1}/${align(_date.getDate())}`;
  } else if (r.yesterMonth <= _date && _date < r.yesterday) {
    return `yesterday`;
  } else if (r.yesterday <= _date && _date < r.now) {
    return `${align(_date.getHours())}:${align(_date.getMinutes())}`;
  } else {
    return format(date, 'p', { locale });
  }
}
