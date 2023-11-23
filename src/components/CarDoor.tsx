import { useDoor } from '../hooks/useDoor'

export default function CarDoor() {
    const door = useDoor()

    return (
        <div className="car-door-container">
            <div className="car-door" style={{ left: -door.position }}></div>
            <div className="car-door" style={{ right: -door.position }}></div>
        </div>
    )
}
