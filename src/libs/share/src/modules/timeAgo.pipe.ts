import { Pipe, PipeTransform } from '@angular/core';
import {
    differenceInDays,
    differenceInHours,
    differenceInMinutes,
    differenceInMonths,
    differenceInSeconds,
    differenceInWeeks,
    differenceInYears,
    format,
} from 'date-fns';

@Pipe({
    name: 'timeAgo',
    pure: false,
})
export class TimeAgoPipe implements PipeTransform {
    transform(value: string): any {
        const now = new Date().getTime();
        const then = new Date(value).getTime();
        const diff = now - then;

        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const weeks = Math.floor(days / 7);
        const months = Math.floor(days / 30.44);
        const years = Math.floor(days / 365.25);

        if (seconds < 60) {
            return "Now";
        } else if (minutes < 2) {
            return `${minutes} minute ago`;
        }
        else if (minutes < 60) {
            return `${minutes} minutes ago`;
        } else if (hours < 2) {
            return `${hours} hour ago`;
        } else if (hours < 24) {
            return `${hours} hours ago`;
        } else if (days < 2) {
            return `${days} day ago`;
        } else if (days < 30) {
            return `${days} days ago`;
        } else if (weeks < 2) {
            return `${weeks} week ago`;
        } else if (weeks < 4) {
            return `${weeks} weeks ago`;
        } else if (months < 2) {
            return `${months} month ago`;
        } else if (months < 6) {
            return `${months} months ago`;
        } else if (years < 2) {
            return `${years} year ago`;
        } else {
            return new Date(value).toLocaleDateString();
        }
    }
}
