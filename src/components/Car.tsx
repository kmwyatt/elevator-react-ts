import CarDoor from './CarDoor'
import { useFloorInfo } from '../hooks/useFloorInfo'

export default function Car() {
    const floorInfo = useFloorInfo()

    return (
        <div className="car-container" style={{ bottom: 0 }}>
            <div className="car-button-box">
                <div className="floor-button-box">
                    {floorInfo.floorNums.map((v, i) => (
                        <div className="car-button" key={i}>
                            {v}
                        </div>
                    ))}
                </div>
            </div>
            <CarDoor />
        </div>
    )
}
