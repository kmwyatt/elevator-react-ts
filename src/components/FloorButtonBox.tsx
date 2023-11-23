import { useFloorInfo } from '../hooks/useFloorInfo'

export default function FloorButtonBox({ floorNum }: { floorNum: number }) {
    const floorInfo = useFloorInfo()

    return (
        <div className="floor-button-box">
            {floorNum !== floorInfo.totalFloors && (
                <div className="floor-button">▲</div>
            )}
            {floorNum !== 1 && <div className="floor-button">▼</div>}
        </div>
    )
}
