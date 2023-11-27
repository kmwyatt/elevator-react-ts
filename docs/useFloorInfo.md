# useDoor.ts

건물 각 층을 렌더링하기 위한 뷰 로직을 구현한 코드이다.


### 필요한 것들

총 층수와, 층고의 값을 config에서 설정한 초기값으로 할당하고, 각 층의 번호를 붙인 배열을 생성한다.

```typescript
const totalFloors = TOTAL_FLOORS
const floorHeight = FLOOR_HEIGHT
const floorNums = new Array(totalFloors)
    .fill(0)
    .map((v, i) => TOTAL_FLOORS - i)
```

층은 1층부터 시작하지만, 각 층은 가장 윗층부터 렌더링되기 때문에 내림차순으로 번호를 붙인다.


### 반환

모든 값을 반환한다.

```typescript
    return { totalFloors, floorHeight, floorNums }
```