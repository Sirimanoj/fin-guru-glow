import { getDailyNewsletter } from '../lib/newsContent';

export class NotificationService {
    static async requestPermission(): Promise<boolean> {
        if (!('Notification' in window)) {
            console.log('This browser does not support desktop notification');
            return false;
        }

        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }

    static sendNotification(title: string, body: string) {
        if (Notification.permission === 'granted') {
            new Notification(title, {
                body,
                icon: '/vite.svg', // Using default vite icon for now
            });
        }
    }

    static checkAndSendNotifications() {
        if (Notification.permission !== 'granted') return;

        const now = new Date();
        const lastMoodCheck = localStorage.getItem('lastMoodCheck');
        const lastNewsletter = localStorage.getItem('lastNewsletter');
        const todayStr = now.toDateString();

        // Mood Check-in (e.g., send if not sent today)
        if (lastMoodCheck !== todayStr) {
            // In a real app, check if user actually did the check-in.
            // For now, just remind them once a day.
            this.sendNotification(
                "How are you feeling? 🧘",
                "Take a moment to log your mood and financial mindset today."
            );
            localStorage.setItem('lastMoodCheck', todayStr);
        }

        // Newsletter (e.g., send in the evening, after 5 PM)
        if (now.getHours() >= 17 && lastNewsletter !== todayStr) {
            const news = getDailyNewsletter();
            this.sendNotification(news.title, news.body);
            localStorage.setItem('lastNewsletter', todayStr);
        }
    }

    static init() {
        // Check immediately on load
        this.checkAndSendNotifications();

        // Check every minute (for demo purposes, so user doesn't wait forever)
        // In production, this might be less frequent or use a more robust scheduler
        setInterval(() => {
            this.checkAndSendNotifications();
        }, 60000);
    }
}
