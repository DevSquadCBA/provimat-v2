export function convertToVerboseDay(date: string|null): string|null {
    if (!date) {
        return null;
    }
    const getDiferences = (d1:Date, d2:Date): string => {
        const diff_time = d1.getTime() - d2.getTime();
        return parseFloat((diff_time / (1000 * 3600 * 24)).toString()).toFixed(0);
    }
    const getVerbose = (days: number) => {
        if (days<0 || days >= 167814637) { return null }
        if (days == 0) {
            return 'Hoy'
        } else if (days < 1) {
            return `${days} día`;
        } else if (days < 7) {
            return `${days} días`;
        } else if (days < 14) {
            return `${Math.trunc(days / 7)} semana`;
        } else if (days < 30) {
            return `${Math.trunc(days / 7)} semanas`;
        } else if (days < 60) {
            return `${Math.trunc(days / 30)} mes`;
        } else if (days < 365) {
            return `${Math.trunc(days / 30)} meses`;
        } else if (days < 730) {
            return `${Math.trunc(days / 365)} año`;
        } else {
            return `${Math.trunc(days / 365)} años`;
        }
    }
    const d = getDiferences(new Date(), new Date(date));
    return getVerbose(parseInt(d));
}