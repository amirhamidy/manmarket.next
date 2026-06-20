import NotificationItem from "./NotificationItem";

export default function NotificationsList({ items }) {
    return (
        <main className="w-full max-w-[556px] px-3">
            {items.map((item) => (
                <NotificationItem key={item.id} item={item} />
            ))}
        </main>
    );
}
