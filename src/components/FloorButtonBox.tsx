import useFloorInfo from '../hooks/useFloorInfo'
import { useElevator } from '../hooks/useElevator'

export default function FloorButtonBox({ floorNum }: { floorNum: number }) {
    const floorInfo = useFloorInfo()
    const elevator = useElevator()

    return (
        <div className="floor-button-box">
            {floorNum !== floorInfo.totalFloors && (
                <div
                    className="floor-button"
                    style={{
                        borderColor: `${
                            elevator.callsGoingUp[floorNum] ? '#f00' : '#666'
                        }`,
                    }}
                    onClick={() => elevator.callGoingUp(floorNum)}
                >
                    ▲
                </div>
            )}
            {floorNum !== 1 && (
                <div
                    className="floor-button"
                    style={{
                        borderColor: `${
                            elevator.callsGoingDown[floorNum] ? '#f00' : '#666'
                        }`,
                    }}
                    onClick={() => elevator.callGoingDown(floorNum)}
                >
                    ▼
                </div>
            )}
        </div>
    )
}
