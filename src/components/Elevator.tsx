import FloorButtonBox from './FloorButtonBox'
import Car from './Car'
import useFloorInfo from '../hooks/useFloorInfo'

import '../assets/scss/elevator.scss'

export default function Elevator() {
    const floorInfo = useFloorInfo()

    return (
        <div className="elevator-container">
            <div className="lane-container">
                <div className="floor-button-box-group">
                    {floorInfo.floorNums.map((v, i) => (
                        <FloorButtonBox floorNum={v} key={i} />
                    ))}
                </div>
                <div className="lane-line">
                    <div
                        className="lane-space"
                        style={{
                            height:
                                floorInfo.floorHeight * floorInfo.totalFloors,
                        }}
                    >
                        <Car />
                    </div>
                </div>
            </div>
        </div>
    )
}
