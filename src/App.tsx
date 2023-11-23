import { useFloorInfo } from './hooks/useFloorInfo'
import Floor from './components/Floor'
import Elevator from './components/Elevator'

import './assets/scss/basic.scss'

export default function App() {
    const floors = useFloorInfo()

    return (
        <div className="display-container">
            <div className="floor-group">
                {floors.floorNums.map((v, i) => (
                    <Floor floorNum={v} key={i} />
                ))}
            </div>
            <Elevator />
        </div>
    )
}
