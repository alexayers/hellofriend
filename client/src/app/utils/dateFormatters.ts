export class DateFormatters {


  static timeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000; // Number of seconds in a year

    if (interval > 1) {
      return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000; // Number of seconds in a month
    if (interval > 1) {
      return Math.floor(interval) + " months ago";
    }
    interval = seconds / 604800; // Number of seconds in a week
    if (interval > 1) {
      return Math.floor(interval) + " weeks ago";
    }
    interval = seconds / 86400; // Number of seconds in a day
    if (interval > 1) {
      return Math.floor(interval) + "d";
    }
    interval = seconds / 3600; // Number of seconds in an hour
    if (interval > 1) {
      return Math.floor(interval) + "h";
    }
    interval = seconds / 60; // Number of seconds in a minute
    if (interval > 1) {
      return Math.floor(interval) + "m";
    }
    return Math.floor(seconds) + "s";
  }
}
