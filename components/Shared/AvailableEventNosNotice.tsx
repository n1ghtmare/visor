// if you provide [1, 2, 4, 5, 7, 8, 9, 11] you will get back [3, 6, 10]
// takes into account padding, which means [3, 4, 5] will get you back [1, 2] (i.e. the missing values *before* the first value)
function getSeriesGapsInSortedArray(sortedArr: number[]): number[] {
    const gaps = [];

    // add padding values
    for (let i = 1; i < sortedArr[0]; i++) {
        gaps.push(i);
    }

    for (let i = 0; i < sortedArr.length; i++) {
        const gap = sortedArr[i + 1] - sortedArr[i];
        if (gap > 1) {
            for (let j = sortedArr[i] + 1; j < sortedArr[i + 1]; j++) {
                gaps.push(j);
            }
        }
    }
    return gaps;
}

// if you provide [1, 2, 3, 7, 5, 8, 9, 10] you will get back [[1, 2, 3], [5], [7, 8, 9, 10]]
function getSeriesInSortedArray(sortedArr: number[]): number[][] {
    const series: number[][] = [];

    for (let i = 0; i < sortedArr.length; i++) {
        if (sortedArr[i + 1] - sortedArr[i] === 1) {
            const s = [];

            while (sortedArr[i + 1] - sortedArr[i] === 1) {
                s.push(sortedArr[i]);
                i++;
            }

            series.push(s.concat([s[s.length - 1] + 1]));
        } else {
            series.push([].concat(sortedArr[i]));
        }
    }
    return series;
}

export default function AvailableEventNosNotice({ eventNosInUse }: { eventNosInUse: number[] }) {
    function generateHumanizedNotice(): string {
        if (eventNosInUse.length === 0) {
            return ">0";
        }

        const sortedArr: number[] = eventNosInUse.slice(0).sort((a, b) => a - b);
        const gaps: number[] = getSeriesGapsInSortedArray(sortedArr);
        const series: number[][] = getSeriesInSortedArray(gaps);

        const humanized: string[] = series.map((x) =>
            x.length > 2 ? `${x[0]}...${x[x.length - 1]}` : x.toString()
        );

        const affix = `>${sortedArr[sortedArr.length - 1]}`;

        if (humanized.length === 0) {
            return affix;
        }

        return `${humanized.join(", ")} or ${affix}`;
    }

    return (
        <div className="px-4 py-3 text-blue-600 border border-blue-500 rounded space-y-2 bg-blue-50">
            <div>The currently available Event numbers are:</div>
            <div className="font-bold">{generateHumanizedNotice()}</div>
        </div>
    );
}
