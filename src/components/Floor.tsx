import '../assets/scss/floor.scss'

export default function Floor({ floorNum }: { floorNum: number }) {
    return (
        <div className="floor-container">
            <div className="floor-number">{floorNum}F</div>
        </div>
    )
}
