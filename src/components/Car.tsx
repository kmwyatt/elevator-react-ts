import CarDoor from './CarDoor'
import useFloorInfo from '../hooks/useFloorInfo'
import { useMovement } from '../hooks/useMovement'
import { useElevator } from '../hooks/useElevator'

export default function Car() {
    const floorInfo = useFloorInfo()
    const movement = useMovement()
    const elevator = useElevator()

    return (
        <div className="car-container" style={{ bottom: movement.position }}>
            <div className="car-button-box">
                <div className="floor-button-box">
                    {floorInfo.floorNums.map((v, i) => (
                        <div
                            className="car-button"
                            key={i}
                            style={{
                                borderColor: `${
                                    elevator.selectedFloors[v] ? '#f00' : '#666'
                                }`,
                            }}
                            onClick={() => elevator.selectFloor(v)}
                        >
                            {v}
                        </div>
                    ))}
                </div>
            </div>
            <CarDoor />
        </div>
    )
}
