// src/utils/dateUtils.ts

/**
 * Normaliza datas para o formato ISO completo (yyyy-MM-ddTHH:mm:ss.SSS)
 */
export function normalizeDateInput(val: string | number | null): string {
  if (val === null || val === undefined) return '';
  if (typeof val === 'number') val = String(val);
  if (typeof val !== 'string') return '';
  // yyyy-MM-ddTHH:mm:ss.SSS
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}$/.test(val)) return val;
  // yyyy-MM-ddTHH:mm
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(val)) return val + ':00.000';
  // yyyy-MM-dd
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val + 'T00:00:00.000';
  // dd/MM/yyyy HH:mm:ss
  const brDateTimeFull = val.match(
    /^([0-9]{2})\/([0-9]{2})\/([0-9]{4}) ([0-9]{2}):([0-9]{2}):([0-9]{2})$/,
  );
  if (brDateTimeFull) {
    const [, day, month, year, hour, min, sec] = brDateTimeFull;
    return `${year}-${month}-${day}T${hour}:${min}:${sec}.000`;
  }
  // dd/MM/yyyy HH:mm
  const brDateTimeShort = val.match(/^([0-9]{2})\/([0-9]{2})\/([0-9]{4}) ([0-9]{2}):([0-9]{2})$/);
  if (brDateTimeShort) {
    const [, day, month, year, hour, min] = brDateTimeShort;
    return `${year}-${month}-${day}T${hour}:${min}:00.000`;
  }
  // dd/MM/yyyy ou dd/MM/yyyyTHH:mm
  const brDateTime = val.match(/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})(T([0-9]{2}):([0-9]{2}))?/);
  if (brDateTime) {
    const [, day, month, year, , hour = '00', min = '00'] = brDateTime;
    return `${year}-${month}-${day}T${hour}:${min}:00.000`;
  }
  // yyyy-MM-dd HH:mm:ss
  if (val.includes(' ')) {
    const [date, time] = val.split(' ');
    return `${date}T${time || '00:00:00'}.000`;
  }
  // yyyy-MM-dd
  const iso2 = val.match(/^(\d{4}-\d{2}-\d{2})$/);
  if (iso2) return `${iso2[1]}T00:00`;
  return val;
}

/**
 * Sempre retorna yyyy-MM-ddTHH:mm para o input datetime-local
 */
export function formatDateForInput(d: string): string {
  if (!d) return '';
  // yyyy-MM-ddTHH:mm:ss.SSS ou yyyy-MM-ddTHH:mm:ss
  const iso = d.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})/);
  if (iso) return `${iso[1]}T${iso[2]}:${iso[3]}`;
  // dd/MM/yyyyTHH:mm
  const br = d.match(/^(\d{2})\/(\d{2})\/(\d{4})T(\d{2}):(\d{2})/);
  if (br) return `${br[3]}-${br[2]}-${br[1]}T${br[4]}:${br[5]}`;
  // dd/MM/yyyy
  const br2 = d.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (br2) return `${br2[3]}-${br2[2]}-${br2[1]}T00:00`;
  // yyyy-MM-dd
  const iso2 = d.match(/^(\d{4}-\d{2}-\d{2})$/);
  if (iso2) return `${iso2[1]}T00:00`;
  return d;
}
