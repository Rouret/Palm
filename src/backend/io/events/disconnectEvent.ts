

export default function disconnectEvent() {
    console.log("Player disconnected: " + this.id);
    return this.disconnect();

}