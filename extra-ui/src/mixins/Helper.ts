import { format, formatDistance } from 'date-fns';

export const mixin = {
  methods: {
    relativeDate: (date: string) => {
      return formatDistance(new Date(date), new Date());
    },
    humanDate: (date: string) => {
      return format(date, 'PPPPpppp');
    }
  }
};
