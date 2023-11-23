import { FLOOR_HEIGHT, TOTAL_FLOORS } from '../constants/config'

export function useFloorInfo() {
    const totalFloors = TOTAL_FLOORS
    const floorHeight = FLOOR_HEIGHT
    const floorNums = new Array(totalFloors)
        .fill(0)
        .map((v, i) => TOTAL_FLOORS - i)

    return { totalFloors, floorHeight, floorNums }
}
