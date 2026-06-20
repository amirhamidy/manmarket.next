export function toJalaliDate(dateString) {
    if (!dateString) return "";

    const date = new Date(dateString);

    return new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(date);
}
